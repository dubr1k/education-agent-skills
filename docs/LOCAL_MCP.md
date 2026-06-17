# Local MCP setup

This fork is local-only. Do not run it as a public remote MCP service.

Use the local MCP server when you want MCP discovery tools such as `find_skills`, `suggest_skills`, `get_skill_details`, and `list_skills`. Use direct skill installation when your agent can read `skills/` folders natively.

## Build the local MCP server

```bash
git clone https://github.com/dubr1k/education-agent-skills.git
cd education-agent-skills/mcp-server
npm install
npm run bundle-skills
npm run build
```

The build reads the pre-built snapshot from `mcp-server/src/skills.json` and writes `dist/skills.json`.

## Local stdio MCP

Use stdio for Claude Desktop, Codex, Hermes, or any MCP client that can launch a local process:

```json
{
  "mcpServers": {
    "education-skills": {
      "command": "node",
      "args": ["/absolute/path/to/education-agent-skills/mcp-server/dist/index.js"]
    }
  }
}
```

This is the supported runtime path for the fork. There is no public token, no hosted signup, and no remote endpoint to configure.

## Verify locally

Run the full MCP test suite:

```bash
cd mcp-server
npm test
```

Run the local HTTP smoke test around the same handlers used by the MCP HTTP entrypoint:

```bash
cd mcp-server
npm run build
npm run smoke:local-http
```

Expected smoke result:

- anonymous local HTTP requests return `401`;
- local OAuth metadata is reachable;
- authenticated local MCP client sees 169 tools;
- authenticated local MCP client sees 165 prompts;
- Russian `find_skills` routes assessment language correctly;
- Russian `suggest_skills` routes AI literacy language correctly.

The local HTTP smoke exists for regression testing only. It is not a deployment instruction.

## After editing skills

The MCP runtime serves `mcp-server/src/skills.json`, not live `SKILL.md` files. After adding or editing any skill:

```bash
PYTHONPATH=/tmp/educational-skills-pyyaml python3 scripts/generate-registry.py
cd mcp-server
npm run bundle-skills
npm run build
npm test
cd ..
npm test
git diff --check
```

Commit the edited `SKILL.md`, `registry.json`, and `mcp-server/src/skills.json` together.
