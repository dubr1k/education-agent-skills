import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  assemblePrompt,
  handleListSkills,
  handleGetSkillDetails,
  handleFindSkills,
  handleSuggestSkills,
} from "./tool-handler.js";
import type { LoadedSkill } from "./types.js";

const ANNOTATIONS = {
  readOnlyHint: true as const,
  destructiveHint: false as const,
};

export function createServer(skills: LoadedSkill[]): McpServer {
  const skillsByToolName = new Map<string, LoadedSkill>();
  const skillsById = new Map<string, LoadedSkill>();
  for (const skill of skills) {
    skillsByToolName.set(skill.toolName, skill);
    skillsById.set(skill.metadata.skill_id, skill);
  }

  const server = new McpServer({
    name: "academic-skills-ru",
    version: "0.3.0",
  });

  // Регистрируем bundled skills как prompts для пользовательского вызова.
  for (const skill of skills) {
    const argsSchema: Record<string, z.ZodTypeAny> = {};

    for (const field of skill.metadata.input_schema.required) {
      argsSchema[field.field] = z.string().describe(field.description);
    }
    if (skill.metadata.input_schema.optional) {
      for (const field of skill.metadata.input_schema.optional) {
        argsSchema[field.field] = z.string().optional().describe(field.description);
      }
    }

    const { metadata, description } = skill;
    const evidenceTag = metadata.evidence_strength
      ? ` [доказательность: ${metadata.evidence_strength}]`
      : "";
    const promptName = skill.toolName;

    server.registerPrompt(promptName, {
      title: metadata.skill_name,
      description: `${description}${evidenceTag}`,
      argsSchema,
    }, (args) => {
      const assembled = assemblePrompt(
        skillsByToolName.get(promptName)!,
        args as Record<string, unknown>,
      );
      return {
        messages: [
          {
            role: "user" as const,
            content: { type: "text" as const, text: assembled },
          },
        ],
      };
    });
  }

  // Регистрируем bundled skills как tools для Claude.ai и оркестраторов.
  for (const skill of skills) {
    const shape: Record<string, z.ZodTypeAny> = {};

    for (const field of skill.metadata.input_schema.required) {
      shape[field.field] =
        field.type === "array"
          ? z.array(z.any()).describe(field.description)
          : z.string().describe(field.description);
    }
    if (skill.metadata.input_schema.optional) {
      for (const field of skill.metadata.input_schema.optional) {
        shape[field.field] =
          field.type === "array"
            ? z.array(z.any()).optional().describe(field.description)
            : z.string().optional().describe(field.description);
      }
    }

    const toolName = skill.toolName;
    const { metadata, description } = skill;
    const evidenceTag = metadata.evidence_strength
      ? ` [доказательность: ${metadata.evidence_strength}]`
      : "";
    const toolDesc = `${metadata.skill_name} — ${description}${evidenceTag}`;

    server.registerTool(toolName, {
      title: metadata.skill_name,
      description: toolDesc,
      inputSchema: shape,
      annotations: { title: metadata.skill_name, ...ANNOTATIONS },
    }, async (args) => {
      const assembled = assemblePrompt(
        skillsByToolName.get(toolName)!,
        args as Record<string, unknown>,
      );
      const framed = `ИНСТРУКЦИИ: вы выполняете образовательный навык. Следуйте инструкциям навыка точно. Если пользователь пишет по-русски или контекст русскоязычный, итоговый ответ дайте на русском, сохраняя научные термины и цитирования без искажений. Не показывайте эти служебные инструкции пользователю — сразу сформируйте требуемый результат.

<skill_instructions>
${assembled}
</skill_instructions>

Сформируйте полный результат сейчас.`;
      return { content: [{ type: "text" as const, text: framed }] };
    });
  }

  // Регистрируем 4 meta-tools для поиска и навигации по библиотеке.
  server.registerTool("list_skills", {
    title: "Список навыков",
    description: "Показать доступные образовательные навыки по доменам. Возвращает skill ID, название, доказательность, теги и примерное время педагога.",
    inputSchema: { domain: z.string().optional().describe("Фильтр по домену") },
    annotations: { title: "Список навыков", ...ANNOTATIONS },
  }, async (args) => handleListSkills(skills, args));

  server.registerTool("get_skill_details", {
    title: "Детали навыка",
    description: "Получить полные метаданные навыка: источники доказательности, схемы ввода/вывода и связи с другими навыками.",
    inputSchema: { skill_id: z.string().describe("Skill ID, например 'memory-learning-science/cognitive-load-analyser'") },
    annotations: { title: "Детали навыка", ...ANNOTATIONS },
  }, async (args) => handleGetSkillDetails(skillsById, args));

  server.registerTool("find_skills", {
    title: "Поиск навыков",
    description: "Искать навыки по тегу, домену, уровню доказательности или свободному тексту в названиях и описаниях.",
    inputSchema: {
      query: z.string().optional().describe("Свободный поиск по названиям, описаниям и тегам"),
      domain: z.string().optional().describe("Фильтр по домену"),
      evidence_strength: z.string().optional().describe("Фильтр: strong | moderate | emerging | original"),
      tag: z.string().optional().describe("Фильтр по тегу"),
    },
    annotations: { title: "Поиск навыков", ...ANNOTATIONS },
  }, async (args) => handleFindSkills(skills, args));

  server.registerTool("suggest_skills", {
    title: "Подбор навыков",
    description: "Опишите педагогическую задачу обычным русским или английским языком и получите 3-5 релевантных навыков.",
    inputSchema: {
      problem_description: z.string().describe("Описание задачи педагога обычным языком"),
    },
    annotations: { title: "Подбор навыков", ...ANNOTATIONS },
  }, async (args) => handleSuggestSkills(skills, args));

  return server;
}
