import { test, expect } from "@playwright/test";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadSkills } from "../src/skill-loader.js";

test("loads a complete prompt containing a shorter nested code fence", async () => {
  const libraryRoot = await mkdtemp(join(tmpdir(), "skill-loader-fences-"));
  const skillDir = join(libraryRoot, "skills", "test-domain", "nested-fence");

  try {
    await mkdir(skillDir, { recursive: true });
    await writeFile(
      join(skillDir, "SKILL.md"),
      `---
skill_id: test-domain/nested-fence
skill_name: Nested Fence
domain: test-domain
version: "1.0.0"
evidence_strength: moderate
evidence_sources: []
disable-model-invocation: false
input_schema:
  required:
    - field: topic
      type: string
      description: Topic to process
chains_well_with: []
tags: [test]
description: Loads the entire fenced prompt.
---

## Prompt

\`\`\`\`
Instruction before example.

\`\`\`
example payload
\`\`\`

Instruction after example.
\`\`\`\`

## Example Output

Not part of the prompt.
`,
      "utf-8",
    );

    const skills = await loadSkills(libraryRoot);

    expect(skills).toHaveLength(1);
    expect(skills[0].prompt).toContain("Instruction before example.");
    expect(skills[0].prompt).toContain("```\nexample payload\n```");
    expect(skills[0].prompt).toContain("Instruction after example.");
    expect(skills[0].prompt).not.toContain("Not part of the prompt.");
  } finally {
    await rm(libraryRoot, { recursive: true, force: true });
  }
});
