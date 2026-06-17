import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import * as yaml from "yaml";

const SKILLS_DIR = path.join(__dirname, "..", "skills");
const REGISTRY_PATH = path.join(__dirname, "..", "registry.json");
const PLUGIN_PATH = path.join(__dirname, "..", ".claude-plugin", "plugin.json");
const README_PATH = path.join(__dirname, "..", "README.md");
const MCP_README_PATH = path.join(__dirname, "..", "mcp-server", "README.md");
const CHANGELOG_PATH = path.join(__dirname, "..", "CHANGELOG.md");
const MCP_CHANGELOG_PATH = path.join(__dirname, "..", "mcp-server", "CHANGELOG.md");
const PLAN_PATH = path.join(__dirname, "..", "PLAN.md");
const STATE_PATH = path.join(__dirname, "..", "STATE.md");
const RU_LOCALIZATION_PATH = path.join(__dirname, "..", "docs", "RU_LOCALIZATION.md");
const LOCAL_MCP_PATH = path.join(__dirname, "..", "docs", "LOCAL_MCP.md");
const REPO_ROOT = path.join(__dirname, "..");

// Вспомогательная функция: собрать все пути SKILL.md.
function getAllSkillPaths(): string[] {
  const paths: string[] = [];
  const domains = fs.readdirSync(SKILLS_DIR);
  for (const domain of domains) {
    const domainPath = path.join(SKILLS_DIR, domain);
    if (!fs.statSync(domainPath).isDirectory()) continue;
    const skills = fs.readdirSync(domainPath);
    for (const skill of skills) {
      const skillFile = path.join(domainPath, skill, "SKILL.md");
      if (fs.existsSync(skillFile)) {
        paths.push(skillFile);
      }
    }
  }
  return paths.sort();
}

// Вспомогательная функция: разобрать YAML frontmatter из SKILL.md.
function parseFrontmatter(filePath: string): Record<string, unknown> {
  const content = fs.readFileSync(filePath, "utf-8");
  if (!content.startsWith("---")) throw new Error(`No frontmatter: ${filePath}`);
  const endIdx = content.indexOf("---", 3);
  if (endIdx === -1) throw new Error(`No closing ---: ${filePath}`);
  const fmText = content.slice(3, endIdx);
  return yaml.parse(fmText) as Record<string, unknown>;
}

function getAllReadmePaths(dir = REPO_ROOT): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const paths: string[] = [];

  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;

    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      paths.push(...getAllReadmePaths(entryPath));
    } else if (entry.name === "README.md") {
      paths.push(entryPath);
    }
  }

  return paths.sort();
}

test.describe("Skill Discovery", () => {
  test("finds at least the published baseline of SKILL.md files", () => {
    const paths = getAllSkillPaths();
    expect(paths.length).toBeGreaterThanOrEqual(131);
  });

  test("skills span at least the published baseline of domains", () => {
    const domains = fs.readdirSync(SKILLS_DIR).filter((d) =>
      fs.statSync(path.join(SKILLS_DIR, d)).isDirectory()
    );
    expect(domains.length).toBeGreaterThanOrEqual(17);
  });

  test("every SKILL.md has valid YAML frontmatter", () => {
    const paths = getAllSkillPaths();
    for (const p of paths) {
      expect(() => parseFrontmatter(p)).not.toThrow();
    }
  });

  test("every SKILL.md has Agent Skills v2 name field", () => {
    const paths = getAllSkillPaths();
    for (const p of paths) {
      const fm = parseFrontmatter(p);
      expect(fm.name).toBeTruthy();
      expect(typeof fm.name).toBe("string");
      expect((fm.name as string).length).toBeLessThanOrEqual(64);
      expect(fm.name).toMatch(/^[a-z0-9-]+$/);
    }
  });

  test("every SKILL.md has description <= 250 chars", () => {
    const paths = getAllSkillPaths();
    for (const p of paths) {
      const fm = parseFrontmatter(p);
      expect(fm.description).toBeTruthy();
      expect(typeof fm.description).toBe("string");
      expect((fm.description as string).length).toBeLessThanOrEqual(250);
    }
  });

  test("every SKILL.md has disable-model-invocation boolean", () => {
    const paths = getAllSkillPaths();
    for (const p of paths) {
      const fm = parseFrontmatter(p);
      expect(typeof fm["disable-model-invocation"]).toBe("boolean");
    }
  });

  test("every SKILL.md preserves existing required fields", () => {
    const paths = getAllSkillPaths();
    const requiredFields = ["skill_id", "skill_name", "domain", "evidence_strength"];
    for (const p of paths) {
      const fm = parseFrontmatter(p);
      for (const field of requiredFields) {
        expect(fm[field]).toBeTruthy();
      }
    }
  });

  test("every SKILL.md includes Russian / bilingual runtime guidance", () => {
    const paths = getAllSkillPaths();
    expect(paths.length).toBe(165);

    for (const p of paths) {
      const content = fs.readFileSync(p, "utf-8");
      expect(content, p).toContain("Russian / bilingual context");
    }
  });
});

test.describe("Registry Validation", () => {
  let registry: {
    version: string;
    standard: string;
    total_skills: number;
    domains: Array<{ id: string; label: string; skill_count: number }>;
    skills: Array<{
      id: string;
      name: string;
      description: string;
      disable_model_invocation: boolean;
      path: string;
      domain: string;
      chain_edges: {
        receives_from: unknown[];
        feeds_into: unknown[];
        output_field: unknown;
        input_field: unknown;
      };
    }>;
  };

  test.beforeAll(() => {
    const content = fs.readFileSync(REGISTRY_PATH, "utf-8");
    registry = JSON.parse(content);
  });

  test("registry.json is valid JSON with correct version", () => {
    expect(registry.version).toBe("2.0");
    expect(registry.standard).toBe("agent-skills-1.0");
  });

  test("registry skill count matches the generated skill list", () => {
    expect(registry.total_skills).toBe(registry.skills.length);
  });

  test("registry domain count matches the generated domain list", () => {
    const uniqueDomains = new Set(registry.skills.map((s) => s.domain));
    expect(registry.domains.length).toBe(uniqueDomains.size);
  });

  test("all descriptions are <= 250 characters", () => {
    for (const s of registry.skills) {
      expect(s.description.length).toBeLessThanOrEqual(250);
    }
  });

  test("all paths start with skills/ and point to existing files", () => {
    for (const s of registry.skills) {
      expect(s.path).toMatch(/^skills\//);
      const fullPath = path.join(__dirname, "..", s.path);
      expect(fs.existsSync(fullPath)).toBe(true);
    }
  });

  test("disable_model_invocation is boolean for all skills", () => {
    for (const s of registry.skills) {
      expect(typeof s.disable_model_invocation).toBe("boolean");
    }
  });

  test("chain_edges fields are null placeholders in v2", () => {
    for (const s of registry.skills) {
      expect(s.chain_edges.output_field).toBeNull();
      expect(s.chain_edges.input_field).toBeNull();
    }
  });

  test("domain skill counts match actual skill entries", () => {
    const counts: Record<string, number> = {};
    for (const s of registry.skills) {
      counts[s.domain] = (counts[s.domain] || 0) + 1;
    }
    for (const d of registry.domains) {
      expect(counts[d.id]).toBe(d.skill_count);
    }
  });

  test("registry matches SKILL.md files on disk", () => {
    const diskPaths = getAllSkillPaths().map((p) =>
      path.relative(path.join(__dirname, ".."), p)
    );
    const registryPaths = registry.skills.map((s) => s.path);
    expect(registryPaths.sort()).toEqual(diskPaths.sort());
  });
});

test.describe("Plugin Manifest Validation", () => {
  let plugin: {
    name: string;
    display_name: string;
    version: string;
    skills: string;
    license: string;
  };

  test.beforeAll(() => {
    const content = fs.readFileSync(PLUGIN_PATH, "utf-8");
    plugin = JSON.parse(content);
  });

  test("plugin.json is valid JSON", () => {
    expect(plugin.name).toBe("educational-skills-ru");
    expect(plugin.display_name).toBe("Educational Skills RU");
    expect(plugin.version).toBe("2.2.0");
  });

  test("plugin.json skills directory exists", () => {
    const skillsDir = path.join(__dirname, "..", plugin.skills);
    expect(fs.existsSync(skillsDir)).toBe(true);
    expect(fs.statSync(skillsDir).isDirectory()).toBe(true);
  });

  test("plugin.json has correct license", () => {
    expect(plugin.license).toBe("CC BY-SA 4.0");
  });
});

test.describe("Documentation Validation", () => {
  test("README install guide uses the fork repository", () => {
    const readme = fs.readFileSync(README_PATH, "utf-8");

    expect(readme).toContain("## Быстрый старт");
    expect(readme).toContain("## Для кого");
    expect(readme).toContain("## Зачем это нужно");
    expect(readme).not.toContain("## Get Started");
    expect(readme).not.toContain("## Who This Is For");
    expect(readme).not.toContain("## Why This Exists");
    expect(readme).toContain("https://github.com/dubr1k/education-agent-skills");
    expect(readme).toContain("git clone https://github.com/dubr1k/education-agent-skills.git");
    expect(readme).toContain("claude plugin install https://github.com/dubr1k/education-agent-skills");
    expect(readme).not.toContain("https://github.com/GarethManning/education-agent-skills");
    expect(readme).not.toContain("GarethManning/education-agent-skills");
    expect(readme).not.toContain("mcp-server-sigma-sooty.vercel.app");
    expect(readme).not.toContain("Hosted MCP access signup");
  });

  test("all README files avoid upstream install instructions", () => {
    const readmes = getAllReadmePaths();
    expect(readmes.length).toBeGreaterThanOrEqual(2);

    for (const readmePath of readmes) {
      const readme = fs.readFileSync(readmePath, "utf-8");
      expect(readme).toContain("https://github.com/dubr1k/education-agent-skills");
      expect(readme).not.toContain("https://github.com/GarethManning/education-agent-skills");
      expect(readme).not.toContain("GarethManning/education-agent-skills");
      expect(readme).not.toContain("mcp-server-sigma-sooty.vercel.app");
      expect(readme).not.toContain("Hosted MCP access signup");
    }
  });

  test("planning docs describe adaptation as complete, not pending", () => {
    const plan = fs.readFileSync(PLAN_PATH, "utf-8");
    const state = fs.readFileSync(STATE_PATH, "utf-8");
    const ruLocalization = fs.readFileSync(RU_LOCALIZATION_PATH, "utf-8");
    const docs = [plan, state, ruLocalization].join("\n");

    expect(docs).toContain("все 165 skills");
    expect(docs).toContain("всех 20 домен");
    expect(docs).not.toContain("Commit and push the completed adaptation wave");
    expect(docs).not.toContain("Довести текущую волну до конца");
    expect(docs).not.toContain("Следующий конкретный шаг\n\nНачать адаптацию");
  });

  test("MCP docs explain snapshot runtime, transports, and model responsibility", () => {
    const rootReadme = fs.readFileSync(README_PATH, "utf-8");
    const mcpReadme = fs.readFileSync(MCP_README_PATH, "utf-8");
    const docs = `${rootReadme}\n${mcpReadme}`;

    expect(docs).toContain("pre-built snapshot");
    expect(docs).toContain("mcp-server/src/skills.json");
    expect(docs).toContain("Local stdio");
    expect(docs).toContain("Local HTTP smoke");
    expect(docs).toContain("не отдельная LLM");
    expect(docs).toContain("165 skill tools");
    expect(docs).toContain("165 prompts");
  });

  test("local-only MCP docs cover setup, smoke testing, and avoid hosted deployment guidance", () => {
    const changelog = fs.readFileSync(CHANGELOG_PATH, "utf-8");
    const mcpChangelog = fs.readFileSync(MCP_CHANGELOG_PATH, "utf-8");
    const localMcp = fs.readFileSync(LOCAL_MCP_PATH, "utf-8");
    const rootReadme = fs.readFileSync(README_PATH, "utf-8");
    const mcpReadme = fs.readFileSync(MCP_README_PATH, "utf-8");
    const docs = `${changelog}\n${mcpChangelog}\n${localMcp}\n${rootReadme}\n${mcpReadme}`;
    const activeSetupDocs = `${localMcp}\n${rootReadme}\n${mcpReadme}`;

    expect(changelog).toContain("RU fork — 2026-06-17");
    expect(changelog).toContain("165 skills and 20 domains");
    expect(mcpChangelog).toContain("0.4.0-ru — 2026-06-17");
    expect(localMcp).toContain("This fork is local-only");
    expect(localMcp).toContain("npm run smoke:local-http");
    expect(localMcp).toContain("169 tools");
    expect(localMcp).toContain("165 prompts");
    expect(localMcp).toContain("not a deployment instruction");
    expect(docs).toContain("mcp-server/src/skills.json");
    expect(activeSetupDocs).not.toContain("mcp-server-sigma-sooty.vercel.app");
    expect(activeSetupDocs).not.toContain("MCP_HTTP_URL");
    expect(activeSetupDocs).not.toContain("MCP_ACCESS_TOKEN");
    expect(activeSetupDocs).not.toContain("Hosted MCP access signup");
    expect(activeSetupDocs).not.toContain("Use `mcp-server` as the Vercel project root");
  });
});
