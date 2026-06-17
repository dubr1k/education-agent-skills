import { test, expect } from "@playwright/test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SERVER_SCRIPT = resolve(__dirname, "../dist/index.js");
const bundledSkills = JSON.parse(
  readFileSync(resolve(__dirname, "../src/skills.json"), "utf-8"),
) as Array<{ metadata: { domain: string } }>;

async function createClient(env?: Record<string, string>): Promise<Client> {
  const transport = new StdioClientTransport({
    command: "node",
    args: [SERVER_SCRIPT],
    env: { ...process.env, ...env } as Record<string, string>,
    stderr: "pipe",
  });
  const client = new Client({ name: "test-client", version: "1.0.0" });
  await client.connect(transport);
  return client;
}

test.describe("MCP Server — Startup", () => {
  let client: Client;

  test.afterEach(async () => {
    await client?.close();
  });

  test("registers one tool and prompt per bundled skill plus meta tools", async () => {
    client = await createClient();

    const { tools } = await client.listTools();
    const metaTools = ["list_skills", "get_skill_details", "find_skills", "suggest_skills"];
    expect(tools.length).toBe(bundledSkills.length + metaTools.length);
    for (const name of metaTools) {
      expect(tools.find((t) => t.name === name)).toBeTruthy();
    }

    const { prompts } = await client.listPrompts();
    expect(prompts.length).toBe(bundledSkills.length);
  });
});

test.describe("MCP Server — list_skills", () => {
  let client: Client;

  test.beforeEach(async () => {
    client = await createClient();
  });

  test.afterEach(async () => {
    await client?.close();
  });

  test("returns skills grouped by all bundled domains", async () => {
    const result = await client.callTool({ name: "list_skills", arguments: {} });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    const expectedDomains = Array.from(
      new Set(bundledSkills.map((s) => s.metadata.domain)),
    );

    for (const domain of expectedDomains) {
      expect(text).toContain(`## ${domain}`);
    }
  });

  test("filters by single domain", async () => {
    const result = await client.callTool({
      name: "list_skills",
      arguments: { domain: "memory-learning-science" },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("## memory-learning-science");
    expect(text).not.toContain("## curriculum-assessment");
    expect(text).toContain("Cognitive Load Analyser");
  });
});

test.describe("MCP Server — find_skills", () => {
  let client: Client;

  test.beforeEach(async () => {
    client = await createClient();
  });

  test.afterEach(async () => {
    await client?.close();
  });

  test("finds student-learning skills from a Russian query", async () => {
    const result = await client.callTool({
      name: "find_skills",
      arguments: {
        domain: "student-learning",
        query: "застрял ошибка диагностика",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("Stuck & Error Diagnosis Coach");
    expect(text).toContain("student-learning");
  });

  test("finds unassisted checkpoints from Russian independent-practice language", async () => {
    const result = await client.callTool({
      name: "find_skills",
      arguments: {
        domain: "student-learning",
        query: "самостоятельная проверка",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("Unassisted Evidence Checkpoint");
    expect(text).toContain("student-learning");
  });

  test("finds curriculum-assessment skills from Russian planning language", async () => {
    const result = await client.callTool({
      name: "find_skills",
      arguments: {
        domain: "curriculum-assessment",
        query: "ФГОС рабочая программа КТП планируемые результаты критерии",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("curriculum-assessment");
    expect(text).toMatch(/Backwards Design Unit Planner|Scope and Sequence Designer|Competency Unpacker|Criterion-Referenced Rubric Generator/);
  });

  test("finds curriculum-alignment skills from Russian alignment language", async () => {
    const result = await client.callTool({
      name: "find_skills",
      arguments: {
        domain: "curriculum-alignment",
        query: "ФГОС ФОП рабочая программа КТП соответствие планируемые результаты",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("curriculum-alignment");
    expect(text).toMatch(/Coverage Audit|Curriculum Crosswalk|Developmental Band Translator|KUD Chart Author/);
  });

  test("finds eal-language-development skills from Russian RKI language", async () => {
    const result = await client.callTool({
      name: "find_skills",
      arguments: {
        domain: "eal-language-development",
        query: "РКИ русский как неродной билингвы словарь языковые рамки",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("eal-language-development");
    expect(text).toMatch(/Language Demand Analyser|Vocabulary Tiering Tool|Academic Language Sentence Frame Generator|Scaffolded Task Modifier/);
  });

  test("finds inclusive-design skills from Russian inclusion language", async () => {
    const result = await client.callTool({
      name: "find_skills",
      arguments: {
        domain: "inclusive-design",
        query: "ОВЗ ИОМ адаптированная программа инклюзия доступность барьеры",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("inclusive-design");
    expect(text).toMatch(/UDL Barrier Anticipator|UDL Lesson Auditor|UDL Options Designer/);
  });

  test("finds literacy-critical-thinking skills from Russian literacy language", async () => {
    const result = await client.callTool({
      name: "find_skills",
      arguments: {
        domain: "literacy-critical-thinking",
        query:
          "учебный текст аргументация сочинение эссе медиаграмотность анализ источников критическое мышление",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("literacy-critical-thinking");
    expect(text).toMatch(/Argument Structure Scaffold Generator|Critical Thinking Task Designer|Media Literacy Deconstruction Protocol|Source Credibility Evaluation Protocol|Text Complexity Analyser/);
  });

  test("finds explicit-instruction skills from Russian instruction language", async () => {
    const result = await client.callTool({
      name: "find_skills",
      arguments: {
        domain: "explicit-instruction",
        query:
          "явное обучение структура урока объяснение моделирование управляемая практика самостоятельная практика проверка понимания коррекция ошибок",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("explicit-instruction");
    expect(text).toMatch(/Explicit Instruction Sequence Builder|Checking for Understanding Protocol Designer|Think-Aloud Script Generator|Practice Problem Sequence Designer|Lesson Opening Designer/);
  });

  test("finds memory-learning-science skills from Russian learning science language", async () => {
    const result = await client.callTool({
      name: "find_skills",
      arguments: {
        domain: "memory-learning-science",
        query:
          "практика извлечения из памяти интервальное повторение чередование когнитивная нагрузка двойное кодирование обратная связь объяснительные вопросы",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("memory-learning-science");
    expect(text).toMatch(/Retrieval Practice Generator|Spaced Practice Scheduler|Interleaving Unit Planner|Cognitive Load Analyser|Dual Coding Designer|Feedback Quality Analyser|Elaborative Interrogation Question Generator/);
  });

  test("finds questioning-discussion skills from Russian classroom talk language", async () => {
    const result = await client.callTool({
      name: "find_skills",
      arguments: {
        domain: "questioning-discussion",
        query:
          "вопросы обсуждение диалог сократические вопросы hinge questions дискуссионные протоколы classroom talk",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("questioning-discussion");
    expect(text).toMatch(/Dialogic Teaching Move Generator|Discussion Protocol Selector|Hinge Question Designer|Perspective-Taking Activity Designer|Socratic Questioning Sequence Generator/);
  });

  test("finds self-regulated-learning skills from Russian self-regulation language", async () => {
    const result = await client.callTool({
      name: "find_skills",
      arguments: {
        domain: "self-regulated-learning",
        query:
          "саморегуляция метакогниция постановка целей учебные стратегии мониторинг понимания самостоятельная работа анализ ошибок",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("self-regulated-learning");
    expect(text).toMatch(/Error Analysis Protocol|Goal-Setting Protocol Designer|Metacognitive Prompt Library|Self-Regulation Scaffold Generator|Study Strategy Selector/);
  });

  test("finds wellbeing-motivation-agency skills from Russian wellbeing language", async () => {
    const result = await client.callTool({
      name: "find_skills",
      arguments: {
        domain: "wellbeing-motivation-agency",
        query:
          "благополучие мотивация субъектность принадлежность травма восстановительные практики самоэффективность эмоциональная грамотность",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("wellbeing-motivation-agency");
    expect(text).toMatch(/Agency Scaffold Generator|Belonging & Classroom Culture Designer|Trauma-Informed Practice Designer|Self-Efficacy Builder Sequence|RULER Emotional Literacy Sequence/);
  });

  test("finds historical-thinking skills from Russian source-analysis language", async () => {
    const result = await client.callTool({
      name: "find_skills",
      arguments: {
        domain: "historical-thinking",
        query:
          "история исторический источник документ контекстуализация сопоставление авторство происхождение источника ЕГЭ ОГЭ DBQ",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("historical-thinking");
    expect(text).toMatch(/Sourcing Skill Builder|Contextualisation Skill Builder|Corroboration Skill Builder|Document-Based Lesson Designer|Historical Thinking Assessment Designer/);
  });

  test("finds systems-thinking skills from Russian systems language", async () => {
    const result = await client.callTool({
      name: "find_skills",
      arguments: {
        domain: "systems-thinking",
        query:
          "системное мышление причинно-следственные связи петли обратной связи рычаги влияния ментальные модели айсберг",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("systems-thinking");
    expect(text).toMatch(/Systems Awareness Iceberg|Mental Model Mapper|Leverage and Response Design|Ladder of Inference Reflection|Agency Circles for Systems Action/);
  });

  test("finds montessori-alternative-approaches skills from Russian Montessori language", async () => {
    const result = await client.callTool({
      name: "find_skills",
      arguments: {
        domain: "montessori-alternative-approaches",
        query:
          "Монтессори подготовленная среда трехступенчатый урок самостоятельность смешанный возраст наблюдение",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("montessori-alternative-approaches");
    expect(text).toMatch(/Prepared Environment Designer|Three-Part Lesson Designer|Mixed-Age Learning Task Designer|Uninterrupted Work Cycle Designer/);
  });

  test("finds professional-learning skills from Russian teacher-development language", async () => {
    const result = await client.callTool({
      name: "find_skills",
      arguments: {
        domain: "professional-learning",
        query:
          "педагог учитель методическое объединение наставничество наблюдение урока рефлексия коучинг повышение квалификации",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("professional-learning");
    expect(text).toMatch(/Lesson Observation Protocol Designer|Instructional Coaching Conversation Guide|Lesson Study Cycle Designer|Reflective Practice Prompt Generator|Professional Development Session Designer/);
  });

  test("finds environmental-experiential-learning skills from Russian outdoor inquiry language", async () => {
    const result = await client.callTool({
      name: "find_skills",
      arguments: {
        domain: "environmental-experiential-learning",
        query:
          "экологическое образование опытное обучение outdoor learning fieldwork проектная деятельность локальная среда природа",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("environmental-experiential-learning");
    expect(text).toMatch(/Ecological Inquiry Anchor Designer|Outdoor Learning Sequence Designer|Experiential Learning Cycle Designer|Service Learning Project Designer|Biophilic Learning Environment Designer/);
  });

  test("finds ai-learning-science skills from Russian AI tutoring language", async () => {
    const result = await client.callTool({
      name: "find_skills",
      arguments: {
        domain: "ai-learning-science",
        query:
          "ИИ искусственный интеллект нейросеть ChatGPT тьюторинг подсказки обратная связь learning analytics",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("ai-learning-science");
    expect(text).toMatch(/Intelligent Tutoring Dialogue Designer|Adaptive Hint Sequence Designer|AI Feedback Design Principles|Learning Analytics Interpretation Guide|Formative Assessment Loop Designer/);
  });

  test("finds ai-literacy skills from Russian AI-literacy language", async () => {
    const result = await client.callTool({
      name: "find_skills",
      arguments: {
        domain: "ai-literacy",
        query:
          "ИИ грамотность промпты галлюцинации проверка фактов надежность критическая оценка AI-output",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("ai-literacy");
    expect(text).toMatch(/AI Output Critical Audit Designer|AI Hallucination Fact-Check Protocol|Prompt Literacy Sequence Designer|AI Learning Boundary Mapper|Disciplinary AI Literacy Sequence Designer/);
  });

  test("finds original-frameworks skills from Russian framework language", async () => {
    const result = await client.callTool({
      name: "find_skills",
      arguments: {
        domain: "original-frameworks",
        query:
          "авторская рамка методика orchestration проектирование обучения developmental bands SEEDS H3Uni progressions",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("original-frameworks");
    expect(text).toMatch(/Compassionate Systems Awareness Orchestrator|Developmental Band System Designer|SEEDS Regenerative Inquiry Cycle|Three Horizons Learning Transition Mapper|Assessment Design Orchestrator/);
  });

  test("finds global-cross-cultural-pedagogies skills from Russian culturally responsive language", async () => {
    const result = await client.callTool({
      name: "find_skills",
      arguments: {
        domain: "global-cross-cultural-pedagogies",
        query:
          "культурно релевантное обучение межкультурный контекст локальное сообщество place-based inquiry variation theory Reggio Ubuntu",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("global-cross-cultural-pedagogies");
    expect(text).toMatch(/Culturally Responsive Teaching Designer|Place-Based Inquiry Anchor|Variation Theory Task Designer|Reggio Documentation Protocol|Ubuntu Collective Knowledge Task Designer/);
  });
});

test.describe("MCP Server — suggest_skills", () => {
  let client: Client;

  test.beforeEach(async () => {
    client = await createClient();
  });

  test.afterEach(async () => {
    await client?.close();
  });

  test("returns 3-5 results for a plain English query", async () => {
    const result = await client.callTool({
      name: "suggest_skills",
      arguments: {
        problem_description:
          "My students struggle with reading comprehension and I need scaffolded tasks for EAL learners",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    const skillMatches = text.match(/- \*\*[^*]+\*\*/g);
    expect(skillMatches).toBeTruthy();
    expect(skillMatches!.length).toBeGreaterThanOrEqual(3);
    expect(skillMatches!.length).toBeLessThanOrEqual(5);
  });

  test("returns relevant results for a Russian query", async () => {
    const result = await client.callTool({
      name: "suggest_skills",
      arguments: {
        problem_description:
          "Ученики плохо понимают учебный текст, нужна поддержка для билингвальных учащихся и русского как неродного",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;
    const skillMatches = text.match(/- \*\*[^*]+\*\*/g);
    expect(skillMatches).toBeTruthy();
    expect(skillMatches!.length).toBeGreaterThanOrEqual(3);
    expect(skillMatches!.length).toBeLessThanOrEqual(5);
    expect(text).toMatch(/Language|Reading|Vocabulary|Scaffold/i);
  });

  test("returns student-learning results for Russian self-study scenarios", async () => {
    const result = await client.callTool({
      name: "suggest_skills",
      arguments: {
        problem_description:
          "Ученик завышает уверенность, просит подсказки и плохо проверяет самостоятельное понимание перед контрольной",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toMatch(/Confidence Calibration Check|Progressive Hint Ladder|Unassisted Evidence Checkpoint/);
    expect(text).toContain("student-learning");
  });

  test("keeps English student-learning queries working", async () => {
    const result = await client.callTool({
      name: "suggest_skills",
      arguments: {
        problem_description:
          "A student needs confidence calibration, progressive hints, and an unassisted check after AI-supported practice",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toMatch(/Confidence Calibration Check/);
    expect(text).toMatch(/Progressive Hint Ladder|Unassisted Evidence Checkpoint/);
  });

  test("returns relevant Russian results for assessment, RKI, and inclusive scenarios", async () => {
    const queries = [
      {
        problem_description: "Нужны критерии оценивания для контрольной и диагностической работы перед ОГЭ",
        expected: /Assessment|Rubric|Feedback|Question/i,
      },
      {
        problem_description: "Нужна поддержка РКИ: русский как неродной, билингвальные учащиеся, словарь",
        expected: /Language|Vocabulary|Sentence|Reading/i,
      },
      {
        problem_description: "Нужна адаптированная программа и ИОМ для ученика с ОВЗ в инклюзивном классе",
        expected: /Inclusive|Barrier|UDL|Accessibility/i,
      },
    ];

    for (const query of queries) {
      const result = await client.callTool({
        name: "suggest_skills",
        arguments: { problem_description: query.problem_description },
      });
      const text = (result.content as Array<{ type: string; text: string }>)[0].text;
      const skillMatches = text.match(/- \*\*[^*]+\*\*/g);

      expect(skillMatches).toBeTruthy();
      expect(skillMatches!.length).toBeGreaterThanOrEqual(3);
      expect(skillMatches!.length).toBeLessThanOrEqual(5);
      expect(text).toMatch(query.expected);
    }
  });

  test("returns relevant Russian results for post-adaptation end-to-end scenarios", async () => {
    const queries = [
      {
        problem_description:
          "Ученики используют ChatGPT для доклада, но не проверяют галлюцинации, источники и надежность ответа ИИ",
        expected: /AI Output Critical Audit|AI Hallucination Fact-Check|Prompt Literacy|AI Learning Boundary|ai-literacy/i,
      },
      {
        problem_description:
          "В классе повторяется конфликт, нужна восстановительная практика, психологическая безопасность и чувство принадлежности",
        expected: /Restorative Practice|Trauma-Informed|Belonging|RULER|wellbeing-motivation-agency/i,
      },
      {
        problem_description:
          "На уроке истории ученики читают документ без анализа авторства, происхождения источника и сопоставления с другими источниками",
        expected: /Sourcing Skill|Corroboration|Contextualisation|Document-Based|historical-thinking/i,
      },
      {
        problem_description:
          "Нужно исследовать школьный двор как локальную природную среду: наблюдение, fieldwork, экологическое образование и проектная деятельность",
        expected: /Ecological Inquiry|Outdoor Learning|Experiential Learning|Service Learning|environmental-experiential-learning/i,
      },
      {
        problem_description:
          "Педагогу нужен протокол наблюдения урока для наставничества, рефлексии и методического объединения",
        expected: /Lesson Observation|Instructional Coaching|Reflective Practice|Lesson Study|professional-learning/i,
      },
    ];

    for (const query of queries) {
      const result = await client.callTool({
        name: "suggest_skills",
        arguments: { problem_description: query.problem_description },
      });
      const text = (result.content as Array<{ type: string; text: string }>)[0].text;
      const skillMatches = text.match(/- \*\*[^*]+\*\*/g);

      expect(skillMatches).toBeTruthy();
      expect(skillMatches!.length).toBeGreaterThanOrEqual(3);
      expect(skillMatches!.length).toBeLessThanOrEqual(5);
      expect(text).toMatch(query.expected);
    }
  });

  test("returns domain fallback when no matches found", async () => {
    const result = await client.callTool({
      name: "suggest_skills",
      arguments: {
        problem_description: "xyzzyplugh",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("list_skills");
    expect(text).toContain("Available domains");
  });
});

test.describe("MCP Server — skill tools", () => {
  let client: Client;

  test.beforeEach(async () => {
    client = await createClient();
  });

  test.afterEach(async () => {
    await client?.close();
  });

  test("returns instruction-framed prompt with inputs substituted", async () => {
    const result = await client.callTool({
      name: "cognitive-load-analyser",
      arguments: {
        task_description:
          "Students read a passage about mitosis while labelling a diagram",
        student_level: "Year 9 novice",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("ИНСТРУКЦИИ: вы выполняете образовательный навык");
    expect(text).toContain("<skill_instructions>");
    expect(text).toContain("Сформируйте полный результат сейчас.");
    expect(text).toContain("Cognitive Load Theory");
    expect(text).toContain("mitosis");
    expect(text).toContain("Year 9 novice");
  });

  test("includes Russian curriculum context in bundled curriculum-assessment prompts", async () => {
    const result = await client.callTool({
      name: "backwards-design-unit-planner",
      arguments: {
        desired_outcomes:
          "ФГОС: сформировать планируемые результаты по теме дроби и подготовить критерии оценивания",
        student_level: "7 класс",
        unit_duration: "6 уроков",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("Russian / bilingual context");
    expect(text).toContain("ФГОС");
    expect(text).toContain("КТП");
    expect(text).toContain("7 класс");
  });

  test("includes Russian alignment context in bundled curriculum-alignment prompts", async () => {
    const result = await client.callTool({
      name: "coverage-audit",
      arguments: {
        framework:
          "Рабочая программа: планируемые результаты, тематическое планирование, КТП",
        requirements:
          "ФГОС ООО: предметные результаты и метапредметные результаты",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("Russian / bilingual context");
    expect(text).toContain("ФГОС");
    expect(text).toContain("КТП");
    expect(text).toContain("coverage_table");
  });

  test("includes Russian EAL context in bundled eal-language-development prompts", async () => {
    const result = await client.callTool({
      name: "vocabulary-tiering-tool",
      arguments: {
        text_or_topic:
          "Текст по биологии для билингвальных учащихся: нужно выделить академический словарь и термины",
        student_level: "6 класс",
        subject_area: "биология",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("Russian / bilingual context");
    expect(text).toContain("РКИ");
    expect(text).toContain("русский как неродной");
    expect(text).toContain("6 класс");
  });

  test("includes Russian inclusive-design context in bundled prompts", async () => {
    const result = await client.callTool({
      name: "udl-barrier-anticipator",
      arguments: {
        task_description:
          "Ученики читают текст и письменно отвечают на вопросы по теме; цель - объяснить причинно-следственные связи",
        learner_variability:
          "В классе есть ученики с ОВЗ, ИОМ, билингвальные учащиеся и ученик с рекомендациями ПМПК",
        environment: "Инклюзивный класс, тьютор доступен только часть урока",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("Russian / bilingual context");
    expect(text).toContain("ОВЗ");
    expect(text).toContain("ПМПК");
    expect(text).toContain("тьютор");
  });

  test("includes Russian literacy-critical-thinking context in bundled prompts", async () => {
    const result = await client.callTool({
      name: "text-complexity-analyser",
      arguments: {
        text_description:
          "Учебный текст по обществознанию с аргументами, статистикой и спорными источниками",
        student_level: "8 класс",
        reading_purpose:
          "Проанализировать аргументацию, оценить достоверность источников и подготовить эссе",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("Russian / bilingual context");
    expect(text).toContain("медиаграмотность");
    expect(text).toContain("сочинение");
    expect(text).toContain("8 класс");
  });

  test("includes Russian explicit-instruction context in bundled prompts", async () => {
    const result = await client.callTool({
      name: "explicit-instruction-sequence-builder",
      arguments: {
        skill_to_teach:
          "Решать линейные уравнения через явное объяснение, моделирование и управляемую практику",
        student_level: "7 класс",
        lesson_time: "45 минут",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("Russian / bilingual context");
    expect(text).toContain("явное обучение");
    expect(text).toContain("проверка понимания");
    expect(text).toContain("7 класс");
  });

  test("includes Russian memory-learning-science context in bundled prompts", async () => {
    const result = await client.callTool({
      name: "cognitive-load-analyser",
      arguments: {
        task_description:
          "Ученики 6 класса одновременно читают текст, заполняют схему и отвечают на вопросы по теме круговорота воды",
        student_level: "6 класс, новички",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("Russian / bilingual context");
    expect(text).toContain("когнитивная нагрузка");
    expect(text).toContain("рабочая память");
    expect(text).toContain("6 класс");
  });

  test("includes Russian questioning-discussion context in bundled prompts", async () => {
    const result = await client.callTool({
      name: "dialogic-teaching-move-generator",
      arguments: {
        student_response:
          "Ученица говорит: 'Автор просто хотел показать, что герой плохой', и класс быстро соглашается",
        learning_goal:
          "Учащиеся должны обосновывать интерпретации и развивать ответы друг друга в диалоге",
        subject_context:
          "7 класс, литература, обсуждение поступка героя через сократические вопросы и classroom talk",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("Russian / bilingual context");
    expect(text).toContain("сократические вопросы");
    expect(text).toContain("дискуссионные протоколы");
    expect(text).toContain("7 класс");
  });

  test("includes Russian self-regulated-learning context in bundled prompts", async () => {
    const result = await client.callTool({
      name: "study-strategy-selector",
      arguments: {
        learning_task:
          "Подготовиться к контрольной по биологии: термины, процессы и задания на объяснение",
        student_level:
          "8 класс, перечитывает конспект и не отслеживает понимание",
        material_type: "смешанный материал: факты, понятия и применение",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("Russian / bilingual context");
    expect(text).toContain("саморегуляция");
    expect(text).toContain("метакогниция");
    expect(text).toContain("8 класс");
  });

  test("includes Russian wellbeing-motivation-agency context in bundled prompts", async () => {
    const result = await client.callTool({
      name: "trauma-informed-practice-designer",
      arguments: {
        classroom_situation:
          "После конфликта ученик резко реагирует на замечания, класс тревожится, нужна предсказуемость и восстановительные практики",
        student_level: "6 класс",
        available_support: "психолог, социальный педагог, классный руководитель",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("Russian / bilingual context");
    expect(text).toContain("травма-информированный подход");
    expect(text).toContain("психолога");
    expect(text).toContain("6 класс");
  });

  test("includes Russian historical-thinking context in bundled prompts", async () => {
    const result = await client.callTool({
      name: "sourcing-skill-builder",
      arguments: {
        historical_topic:
          "Причины реформ Петра I: работа с указом, письмом современника и фрагментом учебника",
        student_level: "8 класс",
        current_challenge:
          "Ученики читают документ без анализа авторства и происхождения источника",
        curriculum_framework: "ОГЭ/ЕГЭ: аргументация с опорой на исторический источник",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("Russian / bilingual context");
    expect(text).toContain("авторство и происхождение источника");
    expect(text).toContain("ОГЭ/ЕГЭ");
    expect(text).toContain("8 класс");
  });

  test("includes Russian systems-thinking context in bundled prompts", async () => {
    const result = await client.callTool({
      name: "systems-awareness-iceberg",
      arguments: {
        focal_event:
          "В классе повторяется ситуация: ученики молчат на обсуждении, хотя письменные ответы сильные",
        context:
          "7 класс, литература, нужно увидеть структуры, ментальные модели и петли обратной связи",
        student_level: "7 класс",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("Russian / bilingual context");
    expect(text).toContain("системное мышление");
    expect(text).toContain("петли обратной связи");
    expect(text).toContain("7 класс");
  });

  test("includes Russian Montessori context in bundled prompts", async () => {
    const result = await client.callTool({
      name: "prepared-environment-designer",
      arguments: {
        current_environment:
          "Класс начальной школы: материалы лежат высоко, дети постоянно спрашивают разрешение, стены перегружены плакатами",
        improvement_goals:
          "Создать подготовленную среду для самостоятельности, спокойных переходов и наблюдения",
        student_level: "2 класс",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("Russian / bilingual context");
    expect(text).toContain("подготовленная среда");
    expect(text).toContain("Монтессори");
    expect(text).toContain("2 класс");
  });

  test("includes Russian professional-learning context in bundled prompts", async () => {
    const result = await client.callTool({
      name: "lesson-observation-protocol-designer",
      arguments: {
        observation_focus:
          "Проверка понимания на уроке: как учитель собирает evidence от всех учеников, а не только от активных",
        observation_purpose:
          "Формирующее наблюдение урока в цикле наставничества и методического объединения",
        teacher_context: "молодой педагог, 2 год работы",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("Russian / bilingual context");
    expect(text).toContain("наблюдение урока");
    expect(text).toContain("методист");
    expect(text).toContain("look-fors");
  });

  test("includes Russian environmental-experiential context in bundled prompts", async () => {
    const result = await client.callTool({
      name: "ecological-inquiry-anchor-designer",
      arguments: {
        local_ecosystem:
          "Школьный двор: клумбы, старые деревья, участок с мхом и следами птиц после дождя",
        curriculum_objective:
          "5 класс, биология: наблюдение за живыми системами, взаимосвязи и экологическое образование",
        student_level: "5 класс",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("Russian / bilingual context");
    expect(text).toContain("экологическое образование");
    expect(text).toContain("школьный двор");
    expect(text).toContain("5 класс");
  });

  test("includes Russian ai-learning-science context in bundled prompts", async () => {
    const result = await client.callTool({
      name: "intelligent-tutoring-dialogue-designer",
      arguments: {
        learning_objective:
          "Понять, почему умножение на дробь меньше 1 уменьшает число",
        anticipated_difficulties:
          "Ученики используют правило 'умножение всегда увеличивает' и ждут готовую подсказку от ИИ-тьютора",
        student_level: "6 класс",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("Russian / bilingual context");
    expect(text).toContain("тьюторинг");
    expect(text).toContain("проверка фактов");
    expect(text).toContain("6 класс");
  });

  test("includes Russian ai-literacy context in bundled prompts", async () => {
    const result = await client.callTool({
      name: "ai-output-critical-audit-designer",
      arguments: {
        ai_output_sample:
          "ChatGPT уверенно объясняет исторический факт без источников и с возможной галлюцинацией",
        student_level: "9 класс",
        subject_area: "история",
        task_context: "критическая оценка AI-output и проверка фактов",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("Russian / bilingual context");
    expect(text).toContain("галлюцинации");
    expect(text).toContain("критическая оценка AI-output");
    expect(text).toContain("9 класс");
  });

  test("includes Russian original-frameworks context in bundled prompts", async () => {
    const result = await client.callTool({
      name: "compassionate-systems-awareness-orchestrator",
      arguments: {
        starting_point:
          "Повторяющийся конфликт вокруг школьного проекта: нужно не обвинять участников, а увидеть систему",
        context:
          "8 класс, классный руководитель хочет использовать systems-awareness-iceberg и agency-circles",
        intended_use: "student lesson",
        student_level: "8 класс",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("Russian / bilingual context");
    expect(text).toContain("systems-awareness-iceberg");
    expect(text).toContain("agency-circles");
    expect(text).toContain("8 класс");
  });

  test("includes Russian global-cross-cultural context in bundled prompts", async () => {
    const result = await client.callTool({
      name: "culturally-responsive-teaching-designer",
      arguments: {
        lesson_content:
          "7 класс, обществознание: аргументация о роли локального сообщества и культурных практик",
        student_community:
          "Многоязычный класс: русскоязычные ученики, билингвальные семьи, мигрантский опыт, сильные связи с районом",
        subject_area: "обществознание",
      },
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("Russian / bilingual context");
    expect(text).toContain("культурно релевантное обучение");
    expect(text).toContain("локальное сообщество");
    expect(text).toContain("7 класс");
  });

  test("handles collision names with domain prefix", async () => {
    const { tools } = await client.listTools();
    const criticalThinkingTools = tools.filter((t) =>
      t.name.includes("critical-thinking-task-designer"),
    );

    expect(criticalThinkingTools.length).toBe(2);
    expect(criticalThinkingTools.map((t) => t.name).sort()).toEqual([
      "curriculum-assessment__critical-thinking-task-designer",
      "literacy-critical-thinking__critical-thinking-task-designer",
    ]);
  });
});

test.describe("MCP Server — skill prompts", () => {
  let client: Client;

  test.beforeEach(async () => {
    client = await createClient();
  });

  test.afterEach(async () => {
    await client?.close();
  });

  test("returns assembled prompt as user message with inputs substituted", async () => {
    const result = await client.getPrompt({
      name: "cognitive-load-analyser",
      arguments: {
        task_description:
          "Students read a passage about mitosis while labelling a diagram",
        student_level: "Year 9 novice",
      },
    });

    expect(result.messages.length).toBe(1);
    expect(result.messages[0].role).toBe("user");

    const text = result.messages[0].content as { type: string; text: string };
    expect(text.type).toBe("text");
    // Должен содержать экспертную роль из prompt.
    expect(text.text).toContain("Cognitive Load Theory");
    // Должен содержать секцию ввода с подставленными значениями.
    expect(text.text).toContain("## Ввод пользователя / Teacher Input");
    expect(text.text).toContain("mitosis");
    expect(text.text).toContain("Year 9 novice");
  });

  test("handles collision names with domain prefix", async () => {
    const { prompts } = await client.listPrompts();
    const criticalThinking = prompts.filter((p) =>
      p.name.includes("critical-thinking-task-designer"),
    );

    expect(criticalThinking.length).toBe(2);
    expect(criticalThinking.map((p) => p.name).sort()).toEqual([
      "curriculum-assessment__critical-thinking-task-designer",
      "literacy-critical-thinking__critical-thinking-task-designer",
    ]);
  });
});

test.describe("MCP Server — SKILLS_FILTER", () => {
  let client: Client;

  test.afterEach(async () => {
    await client?.close();
  });

  test("limits loaded domains to those in SKILLS_FILTER", async () => {
    client = await createClient({
      SKILLS_FILTER: "memory-learning-science,explicit-instruction",
    });

    // Инструменты навыков плюс 4 мета-инструмента после фильтрации.
    const { tools } = await client.listTools();
    const metaTools = ["list_skills", "get_skill_details", "find_skills", "suggest_skills"];
    const skillTools = tools.filter((t) => !metaTools.includes(t.name));
    expect(skillTools.length).toBeGreaterThan(0);
    expect(skillTools.length).toBeLessThan(131);

    // Подсказки тоже должны фильтроваться.
    const { prompts } = await client.listPrompts();
    expect(prompts.length).toBeGreaterThan(0);
    expect(prompts.length).toBeLessThan(131);

    // Проверяем через list_skills, что видны только отфильтрованные домены.
    const result = await client.callTool({ name: "list_skills", arguments: {} });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;

    expect(text).toContain("## memory-learning-science");
    expect(text).toContain("## explicit-instruction");
    expect(text).not.toContain("## curriculum-assessment");
    expect(text).not.toContain("## wellbeing-motivation-agency");
  });
});
