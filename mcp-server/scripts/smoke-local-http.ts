import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { createServer as createHttpServer, type IncomingMessage, type ServerResponse } from "node:http";
import type { AddressInfo } from "node:net";

const LOCAL_TOKEN = "local-smoke-token";
const META_TOOLS = ["list_skills", "find_skills", "suggest_skills", "get_skill_details"];

type LocalServer = {
  baseUrl: string;
  close: () => Promise<void>;
};

async function startLocalServer(): Promise<LocalServer> {
  process.env.MCP_ACCESS_TOKENS = LOCAL_TOKEN;

  const { default: mcpHandler } = await import("../api/mcp.js");
  const { default: protectedResourceHandler } = await import("../api/well-known/oauth-protected-resource/mcp.js");
  const { default: authorizationServerHandler } = await import("../api/well-known/oauth-authorization-server.js");

  const server = createHttpServer(async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const requestUrl = new URL(req.url || "/", "http://127.0.0.1");
      if (requestUrl.pathname === "/mcp") {
        await mcpHandler(req, res);
        return;
      }
      if (requestUrl.pathname === "/.well-known/oauth-protected-resource/mcp") {
        protectedResourceHandler(req, res);
        return;
      }
      if (requestUrl.pathname === "/.well-known/oauth-authorization-server") {
        authorizationServerHandler(req, res);
        return;
      }
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end("Not found");
    } catch (error) {
      res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
      res.end(error instanceof Error ? error.stack : String(error));
    }
  });

  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${address.port}`;
  process.env.MCP_PUBLIC_BASE_URL = baseUrl;

  return {
    baseUrl,
    close: () => new Promise<void>((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    }),
  };
}

async function expectAnonymous401(mcpUrl: URL): Promise<void> {
  const response = await fetch(mcpUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list" }),
  });

  if (response.status !== 401) {
    throw new Error(`Expected anonymous /mcp to return 401, got ${response.status}`);
  }

  const wwwAuthenticate = response.headers.get("www-authenticate") || "";
  if (!wwwAuthenticate.includes("resource_metadata")) {
    throw new Error("Anonymous 401 response is missing resource_metadata in WWW-Authenticate");
  }
}

async function expectOAuthMetadata(baseUrl: string): Promise<void> {
  for (const path of ["/.well-known/oauth-protected-resource/mcp", "/.well-known/oauth-authorization-server"]) {
    const response = await fetch(`${baseUrl}${path}`);
    if (!response.ok) {
      throw new Error(`Expected ${path} metadata to return 2xx, got ${response.status}`);
    }
    const metadata = await response.json() as Record<string, unknown>;
    if (!Object.keys(metadata).length) {
      throw new Error(`Expected ${path} metadata to be non-empty`);
    }
  }
}

function textFromToolResult(result: Awaited<ReturnType<Client["callTool"]>>): string {
  const content = result.content as Array<{ type: string; text?: string }> | undefined;
  return content?.find((item) => item.type === "text")?.text || "";
}

async function expectAuthenticatedMcp(mcpUrl: URL): Promise<{ tools: number; prompts: number }> {
  const transport = new StreamableHTTPClientTransport(mcpUrl, {
    requestInit: {
      headers: {
        Authorization: `Bearer ${LOCAL_TOKEN}`,
      },
    },
  });
  const client = new Client({ name: "educational-skills-local-http-smoke", version: "1.0.0" });

  await client.connect(transport);
  try {
    const { tools } = await client.listTools();
    const { prompts } = await client.listPrompts();

    if (tools.length !== 169) throw new Error(`Expected 169 tools, got ${tools.length}`);
    if (prompts.length !== 165) throw new Error(`Expected 165 prompts, got ${prompts.length}`);

    for (const name of META_TOOLS) {
      if (!tools.some((tool) => tool.name === name)) {
        throw new Error(`Missing meta-tool ${name}`);
      }
    }

    const findResult = await client.callTool({
      name: "find_skills",
      arguments: { query: "ФГОС диагностическая работа критерии оценивания" },
    });
    const findText = textFromToolResult(findResult);
    if (!/curriculum-assessment|Diagnostic Assessment Designer|Criterion-Referenced Rubric Generator|Assessment Blueprint Designer/i.test(findText)) {
      throw new Error("Russian find_skills smoke did not return assessment-related skills");
    }

    const suggestResult = await client.callTool({
      name: "suggest_skills",
      arguments: {
        problem_description: "Ученики используют ChatGPT, нужно проверить источники, галлюцинации и надежность ответа",
      },
    });
    const suggestText = textFromToolResult(suggestResult);
    if (!/AI Output Critical Audit|AI Hallucination Fact-Check|Prompt Literacy|ai-literacy/i.test(suggestText)) {
      throw new Error("Russian suggest_skills smoke did not return AI literacy skills");
    }

    return { tools: tools.length, prompts: prompts.length };
  } finally {
    await client.close();
  }
}

async function main() {
  const localServer = await startLocalServer();
  const mcpUrl = new URL(`${localServer.baseUrl}/mcp`);

  try {
    await expectAnonymous401(mcpUrl);
    await expectOAuthMetadata(localServer.baseUrl);
    const authenticated = await expectAuthenticatedMcp(mcpUrl);

    console.log(JSON.stringify({
      mode: "local-http",
      mcpUrl: mcpUrl.toString(),
      tools: authenticated.tools,
      prompts: authenticated.prompts,
      anonymous: "401",
      oauthMetadata: "ok",
      russianFindSkills: "ok",
      russianSuggestSkills: "ok",
    }, null, 2));
  } finally {
    await localServer.close();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : error);
  process.exit(1);
});
