import type { LoadedSkill } from "./types.js";

type ToolResult = { content: Array<{ type: "text"; text: string }> };

const DOMAIN_SEARCH_TERMS: Record<string, string> = {
  "ai-learning-science": "ии искусственный интеллект обучение нейросеть chatgpt тьютор тьюторинг подсказки feedback обратная связь learning analytics данные адаптивное обучение intelligent tutoring ITS диалог",
  "ai-literacy": "ии грамотность промпт промпты hallucination галлюцинации проверка фактов надежность критическая оценка ai-output критика фактчек ChatGPT AI literacy privacy data boundaries",
  "curriculum-alignment": "фгос фоп программа рабочая ктп планирование соответствие аудит планируемые результаты",
  "curriculum-assessment": "фгос фоп рабочая программа ктп планируемые результаты оценивание рубрика критерии проект урок модуль диагностика контрольная впр огэ егэ",
  "eal-language-development": "русский как неродной рки иностранный язык мигранты билингвы словарь речь",
  "environmental-experiential-learning": "экологическое образование опытное обучение experiential learning outdoor learning fieldwork проектная деятельность практика проект среда локальная среда природа исследование опыт вне класса школьный двор наблюдение",
  "explicit-instruction": "явное обучение прямое обучение объяснение моделирование структура урока управляемая практика самостоятельная практика проверка понимания коррекция ошибок урок",
  "global-cross-cultural-pedagogies": "культура культурно релевантное обучение межкультурный локальный контекст место сообщество place-based inquiry variation theory Reggio Ubuntu culturally responsive culturally sustaining CPA phenomenon-based",
  "historical-thinking": "история исторический источник документ контекстуализация сопоставление авторство происхождение источника егэ огэ dbq sourcing corroboration close reading чтение историческое мышление",
  "inclusive-design": "инклюзия овз иом адаптированная программа доступность барьеры универсальный дизайн",
  "literacy-critical-thinking": "смысловое чтение учебный текст письмо сочинение эссе развернутый ответ аргументация анализ источников достоверность критическое мышление медиаграмотность",
  "memory-learning-science": "память практика извлечения retrieval интервальное повторение spaced practice чередование interleaving когнитивная нагрузка рабочая память двойное кодирование dual coding обратная связь feedback объяснительные вопросы elaborative interrogation разобранный пример worked example",
  "montessori-alternative-approaches": "монтессори подготовленная среда трехступенчатый урок самостоятельность смешанный возраст наблюдение альтернативная школа prepared environment independence Montessori",
  "original-frameworks": "авторская методика рамка оркестратор дизайн проектирование обучения прогрессия progressions orchestration compassionate systems regenerative developmental bands SEEDS H3Uni дилемма трансформационное обучение",
  "professional-learning": "педагог учитель методист наставничество методическое объединение наблюдение урока анализ урока коучинг рефлексия повышение квалификации professional learning PLC lesson study",
  "questioning-discussion": "вопросы дискуссия обсуждение дискуссионные протоколы сократовский сократические диалог разговор classroom talk accountable talk dialogic teaching hinge questions perspective taking teacher moves",
  "self-regulated-learning": "саморегуляция метакогниция постановка целей учебные стратегии мониторинг понимания самостоятельная работа анализ ошибок goal setting study strategies self regulation self-regulated learning metacognitive prompts",
  "student-learning": "ученик учащийся студент самостоятельная учеба подсказки проверка понимания уверенность ошибка извлечение",
  "systems-thinking": "система системное мышление причинность причинно-следственные связи петли обратной связи рычаги влияния ментальные модели айсберг systems thinking feedback loops leverage points mental models",
  "wellbeing-motivation-agency": "благополучие мотивация субъектность принадлежность травма восстановительные практики самоэффективность эмоциональная грамотность психологическая безопасность agency wellbeing SEL RULER PERMA",
};

const RU_QUERY_ALIASES: Array<{ pattern: RegExp; terms: string[] }> = [
  { pattern: /^(учен|учащ|студент|школьник)/u, terms: ["student", "learner"] },
  { pattern: /^(учител|педагог|преподав)/u, terms: ["teacher", "educator"] },
  { pattern: /^(урок|заняти)/u, terms: ["lesson", "instruction", "teaching"] },
  { pattern: /^(явн|прям|объясн|моделир|показ|структур)/u, terms: ["explicit", "direct", "instruction", "modelling", "lesson"] },
  { pattern: /^(управляем|совместн|практик|самостоятельн|независим)/u, terms: ["guided", "independent", "practice", "gradual-release"] },
  { pattern: /^(коррекц|исправлен|ошибк)/u, terms: ["checking-understanding", "feedback", "error", "correction", "formative"] },
  { pattern: /^(фгос|фоп|рабоч|план|модул|раздел|ктп|программ)/u, terms: ["planning", "unit", "curriculum", "sequence", "alignment"] },
  { pattern: /^(результат|цель|задач)/u, terms: ["outcome", "objective", "learning", "result"] },
  { pattern: /^(оцен|критери|рубри|балл|егэ|огэ|впр|контрол|диагност)/u, terms: ["assessment", "rubric", "criteria", "feedback", "formative", "diagnostic"] },
  { pattern: /^(чтен|текст|пониман|грамотн)/u, terms: ["reading", "text", "comprehension", "literacy"] },
  { pattern: /^(учебн|смыслов)/u, terms: ["reading", "text", "comprehension", "literacy"] },
  { pattern: /^(письм|эссе|сочинен|развернут|аргумент)/u, terms: ["writing", "argument", "essay", "scaffold"] },
  { pattern: /^(источник|достовер|надежн|медиа|медиаграм|фактчек|новост)/u, terms: ["source", "credibility", "media", "literacy", "bias", "evidence"] },
  { pattern: /^(анализ|критическ|мышлен|предвзят|доказательств)/u, terms: ["analysis", "critical-thinking", "evaluation", "evidence", "reasoning"] },
  { pattern: /^(рки|неродн|иностран|билинг|мигрант|язык|лексик|словар)/u, terms: ["eal", "language", "multilingual", "vocabulary", "sentence"] },
  { pattern: /^(культур|межкультур|локальн|сообществ|местн|регио|убунту|вариац|феномен)/u, terms: ["culture", "culturally-responsive", "cross-cultural", "community", "place-based", "Reggio", "Ubuntu", "variation", "phenomenon"] },
  { pattern: /^(поддерж|опор|скаффолд|шаблон|рамк|подсказ)/u, terms: ["scaffold", "support", "hint", "sentence-frame"] },
  { pattern: /^(памят|повтор|запомин|извлеч|ретрив)/u, terms: ["memory", "retrieval", "practice", "spacing"] },
  { pattern: /^(интервал|черед|перемеш|спейс)/u, terms: ["spaced", "spacing", "interleaving", "practice"] },
  { pattern: /^(когнитив|нагруз|рабоч|памят)/u, terms: ["cognitive-load", "working-memory", "load", "memory"] },
  { pattern: /^(двойн|кодирован|визуал|схем|диаграм)/u, terms: ["dual-coding", "visual", "diagram", "multimedia"] },
  { pattern: /^(обратн|связ|фидбек|feedback)/u, terms: ["feedback", "formative", "quality"] },
  { pattern: /^(объяснительн|elaborative|почему|как|вопрос)/u, terms: ["elaborative", "interrogation", "question", "why", "how"] },
  { pattern: /^(разобран|пример|worked|fading)/u, terms: ["worked-example", "fading", "completion", "scaffolding"] },
  { pattern: /^(мотивац|субъект|агент)/u, terms: ["motivation", "agency", "self-regulated"] },
  { pattern: /^(благополуч|принадлеж|травм|восстанов|самоэффект|эмоциональн)/u, terms: ["wellbeing", "belonging", "trauma-informed", "restorative", "self-efficacy", "emotional-literacy"] },
  { pattern: /^(саморегул|метакогн|стратег|цел|целей|постановк|мониторинг)/u, terms: ["self-regulated", "self-regulation", "metacognition", "goal-setting", "strategy", "monitoring"] },
  { pattern: /^(самостоятель|независим)/u, terms: ["unassisted", "independent", "independence", "self-regulated", "practice"] },
  { pattern: /^(уверен|калибров)/u, terms: ["confidence", "calibration", "metacognition"] },
  { pattern: /^(провер|верифиц)/u, terms: ["check", "verification", "evidence"] },
  { pattern: /^(инклюз|овз|иом|адаптир|доступ|барьер)/u, terms: ["inclusive", "udl", "barrier", "adapted"] },
  { pattern: /^(ии|нейросет|чатгпт|gpt|ai|промпт|галлюцин|факт|надежн)/u, terms: ["ai", "prompt", "chatgpt", "hallucination", "fact-check", "reliability"] },
  { pattern: /^(истори|источник|документ|контекстуал|сопостав|авторств|происхожд|егэ|огэ)/u, terms: ["history", "historical", "source", "document", "contextualisation", "corroboration", "sourcing"] },
  { pattern: /^(систем|причин|петл|рычаг|ментальн|модел|айсберг)/u, terms: ["systems", "systems-thinking", "causal", "feedback-loop", "leverage", "mental-model", "iceberg"] },
  { pattern: /^(монтессори|подготовлен|трехступ|смешан|возраст|наблюден)/u, terms: ["Montessori", "prepared-environment", "three-period", "mixed-age", "observation"] },
  { pattern: /^(наставнич|методическ|коучинг|рефлекс|квалификац|наблюден)/u, terms: ["coaching", "mentor", "professional-development", "lesson-observation", "reflection", "PLC"] },
  { pattern: /^(эколог|природ|сред|полев|fieldwork|outdoor|двор)/u, terms: ["ecological", "environmental", "outdoor", "fieldwork", "local-environment", "place-based"] },
  { pattern: /^(авторск|рамк|оркестр|дилемм|регенератив|трансформац)/u, terms: ["framework", "orchestrator", "dilemma", "regenerative", "transformative"] },
  { pattern: /^(дискус|обсужден|вопрос|диалог|разговор|сократ|протокол)/u, terms: ["discussion", "question", "dialogue", "Socratic", "protocol"] },
  { pattern: /^(ошиб|застр|сложн|непоним)/u, terms: ["error", "stuck", "misconception", "diagnosis"] },
];

function normalizeSearchText(value: string): string {
  return value.toLocaleLowerCase("ru-RU").replace(/ё/g, "е");
}

function tokenizeSearchText(value: string): string[] {
  return normalizeSearchText(value).match(/[\p{L}\p{N}-]+/gu) ?? [];
}

function termsForToken(token: string): string[] {
  const terms = new Set([token]);
  for (const alias of RU_QUERY_ALIASES) {
    if (alias.pattern.test(token)) {
      for (const term of alias.terms) terms.add(term);
    }
  }
  return [...terms];
}

function searchableSkillText(skill: LoadedSkill): string {
  return normalizeSearchText([
    skill.metadata.skill_name,
    skill.metadata.skill_id,
    skill.metadata.domain,
    DOMAIN_SEARCH_TERMS[skill.metadata.domain] ?? "",
    skill.description,
    ...skill.metadata.tags,
  ].join(" "));
}

function tokenMatchesSkill(token: string, haystack: string): boolean {
  return termsForToken(token).some((term) => haystack.includes(normalizeSearchText(term)));
}

export function assemblePrompt(skill: LoadedSkill, args: Record<string, unknown>): string {
  let prompt = skill.prompt;

  // Заменяем {{placeholder}} на переданные значения.
  for (const [key, value] of Object.entries(args)) {
    const placeholder = new RegExp(`\\{\\{${key}\\}\\}`, "gi");
    const strValue = Array.isArray(value) ? JSON.stringify(value) : String(value);
    prompt = prompt.replace(placeholder, strValue);
  }

  // Убираем оставшиеся {{placeholders}} для optional параметров.
  prompt = prompt.replace(/\{\{[^}]+\}\}/g, "[not provided]");

  // Собираем краткий ввод для параметров, которых не было в template.
  // Некоторые prompts используют отличающиеся соглашения по placeholders.
  const inputSummary = Object.entries(args)
    .map(([key, value]) => {
      const label = key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      const strValue = Array.isArray(value) ? JSON.stringify(value) : String(value);
      return `**${label}:** ${strValue}`;
    })
    .join("\n");

  return `${prompt}\n\n---\n\n## Ввод пользователя / Teacher Input\n\n${inputSummary}`;
}

export function handleListSkills(
  skills: LoadedSkill[],
  args: Record<string, unknown>,
): ToolResult {
  const domain = typeof args.domain === "string" ? args.domain : undefined;
  const filtered = domain ? skills.filter((s) => s.metadata.domain === domain) : skills;

  const grouped = new Map<string, LoadedSkill[]>();
  for (const skill of filtered) {
    const d = skill.metadata.domain;
    if (!grouped.has(d)) grouped.set(d, []);
    grouped.get(d)!.push(skill);
  }

  const lines: string[] = [];
  for (const [d, domainSkills] of [...grouped.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    lines.push(`## ${d}\n`);
    for (const s of domainSkills) {
      lines.push(
        `- **${s.metadata.skill_name}** (${s.toolName})\n  Доказательность: ${s.metadata.evidence_strength} | Время: ${s.metadata.teacher_time} | Теги: ${s.metadata.tags.join(", ")}`,
      );
    }
    lines.push("");
  }

  return { content: [{ type: "text", text: lines.join("\n") }] };
}

export function handleGetSkillDetails(
  skillsById: Map<string, LoadedSkill>,
  args: Record<string, unknown>,
): ToolResult {
  const skillId = typeof args.skill_id === "string" ? args.skill_id : "";
  const skill = skillsById.get(skillId);

  if (!skill) {
    return { content: [{ type: "text", text: `Навык не найден: ${skillId}` }] };
  }

  const m = skill.metadata;
  const details = {
    skill_id: m.skill_id,
    skill_name: m.skill_name,
    tool_name: skill.toolName,
    domain: m.domain,
    version: m.version,
    evidence_strength: m.evidence_strength,
    evidence_sources: m.evidence_sources,
    teacher_time: m.teacher_time,
    tags: m.tags,
    chains_well_with: m.chains_well_with,
    input_schema: m.input_schema,
    output_schema: m.output_schema,
  };

  return { content: [{ type: "text", text: JSON.stringify(details, null, 2) }] };
}

export function handleFindSkills(
  skills: LoadedSkill[],
  args: Record<string, unknown>,
): ToolResult {
  const query = typeof args.query === "string" ? args.query : "";
  const domain = typeof args.domain === "string" ? args.domain : "";
  const evidenceStrength = typeof args.evidence_strength === "string" ? args.evidence_strength : "";
  const tag = typeof args.tag === "string" ? args.tag.toLowerCase() : "";

  let results = skills;

  if (domain) {
    results = results.filter((s) => s.metadata.domain === domain);
  }
  if (evidenceStrength) {
    results = results.filter((s) => s.metadata.evidence_strength === evidenceStrength);
  }
  if (tag) {
    results = results.filter((s) => s.metadata.tags.some((t) => t.toLowerCase().includes(tag)));
  }
  if (query) {
    const queryTokens = tokenizeSearchText(query).filter((w) => w.length > 2);
    results = results.filter((s) => {
      const haystack = searchableSkillText(s);
      return queryTokens.every((word) => tokenMatchesSkill(word, haystack));
    });
  }

  if (results.length === 0) {
    return { content: [{ type: "text", text: "Подходящие навыки не найдены." }] };
  }

  const lines = results.map(
    (s) =>
      `- **${s.metadata.skill_name}** (${s.toolName})\n  ${s.description}\n  Доказательность: ${s.metadata.evidence_strength} | Домен: ${s.metadata.domain}`,
  );

  return { content: [{ type: "text", text: lines.join("\n\n") }] };
}

export function handleSuggestSkills(
  skills: LoadedSkill[],
  args: Record<string, unknown>,
): ToolResult {
  const description = typeof args.problem_description === "string" ? args.problem_description : "";

  if (!description) {
    return {
      content: [{ type: "text", text: "Please provide a problem_description." }],
    };
  }

  // Строим keyword ranking с русскими и английскими совпадениями.
  const words = tokenizeSearchText(description).filter((w) => w.length > 2);

  const scored = skills.map((skill) => {
    const haystack = searchableSkillText(skill);

    let score = 0;
    for (const word of words) {
      if (tokenMatchesSkill(word, haystack)) score++;
    }
    return { skill, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, 5).filter((s) => s.score > 0);

  if (top.length === 0) {
    // Резервный сценарий: возвращаем список доменов для ручной навигации.
    const domains = [...new Set(skills.map((s) => s.metadata.domain))].sort();
    return {
      content: [
        {
          type: "text",
          text: `Сильных совпадений не найдено. Попробуйте посмотреть домены через list_skills. Available domains:\n${domains.map((d) => `- ${d}`).join("\n")}`,
        },
      ],
    };
  }

  const lines = top.map(({ skill: s, score }) => {
    const tagHits = words.filter((w) =>
      s.metadata.tags.some((t) => t.toLowerCase().includes(w)),
    );
    const relevance = tagHits.length > 0
      ? `Совпадения: ${tagHits.join(", ")}`
      : `Подходит к описанной задаче`;
    return `- **${s.metadata.skill_name}** (\`${s.toolName}\`)\n  ${s.description}\n  ${relevance} | Доказательность: ${s.metadata.evidence_strength} | Домен: ${s.metadata.domain}`;
  });

  return {
    content: [
      {
        type: "text",
          text: `Запрос: "${description}"\n\nРекомендуемые навыки:\n\n${lines.join("\n\n")}`,
      },
    ],
  };
}
