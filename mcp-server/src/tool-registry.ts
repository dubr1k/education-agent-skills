import type { LoadedSkill } from "./types.js";

export interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, { type: string; description: string }>;
    required: string[];
  };
}

export function buildSkillToolDefinition(skill: LoadedSkill): McpToolDefinition {
  const { metadata, description, toolName } = skill;
  const properties: Record<string, { type: string; description: string }> = {};
  const required: string[] = [];

  for (const field of metadata.input_schema.required) {
    properties[field.field] = {
      type: field.type === "array" ? "array" : "string",
      description: field.description,
    };
    required.push(field.field);
  }

  if (metadata.input_schema.optional) {
    for (const field of metadata.input_schema.optional) {
      properties[field.field] = {
        type: field.type === "array" ? "array" : "string",
        description: field.description,
      };
    }
  }

  const evidenceTag = metadata.evidence_strength ? ` [доказательность: ${metadata.evidence_strength}]` : "";

  return {
    name: toolName,
    description: `${metadata.skill_name} — ${description}${evidenceTag}`,
    inputSchema: {
      type: "object",
      properties,
      required,
    },
  };
}

export function buildMetaToolDefinitions(): McpToolDefinition[] {
  return [
    {
      name: "list_skills",
      description:
        "Показать все доступные образовательные навыки по доменам. Возвращает skill ID, название, уровень доказательности, теги и примерное время педагога.",
      inputSchema: {
        type: "object",
        properties: {
          domain: {
            type: "string",
            description:
              "Опционально: фильтр по домену (например, 'memory-learning-science'). Если не указан, будут показаны все домены.",
          },
        },
        required: [],
      },
    },
    {
      name: "get_skill_details",
      description:
        "Получить полные метаданные навыка: источники доказательности, схемы ввода/вывода и связи с другими навыками.",
      inputSchema: {
        type: "object",
        properties: {
          skill_id: {
            type: "string",
            description: "Skill ID (например, 'memory-learning-science/cognitive-load-analyser')",
          },
        },
        required: ["skill_id"],
      },
    },
    {
      name: "find_skills",
      description:
        "Искать навыки по тегу, домену, уровню доказательности или свободному тексту в названиях и описаниях.",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Свободный поиск по названиям, описаниям и тегам навыков",
          },
          domain: {
            type: "string",
            description: "Фильтр по домену",
          },
          evidence_strength: {
            type: "string",
            description: "Фильтр по уровню доказательности: strong | moderate | emerging | original | practitioner",
          },
          tag: {
            type: "string",
            description: "Фильтр по тегу",
          },
        },
        required: [],
      },
    },
    {
      name: "suggest_skills",
      description:
        "Опишите педагогическую задачу обычным русским или английским языком и получите 3-5 релевантных навыков с пояснениями.",
      inputSchema: {
        type: "object",
        properties: {
          problem_description: {
            type: "string",
            description:
              "Описание задачи педагога обычным языком (например, 'ученики 8 класса быстро забывают материал прошлых тем')",
          },
        },
        required: ["problem_description"],
      },
    },
  ];
}
