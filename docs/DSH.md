# DeepSeek Harness (DSH): выборочная native-интеграция

Это отдельный renderer/installer, не plugin Claude/Codex, не MCP-сервер и не context engine. Исходные `skills/<domain>/<name>/SKILL.md`, frontmatter и остальные host-интеграции сохраняются. DSH обнаруживает **непосредственные дочерние** каталоги с `SKILL.md`; имя в YAML совпадает с именем каталога.

## Установка

Нужны Git checkout этого fork, Node.js 20+ и локальные зависимости из lockfile:

```bash
npm ci --ignore-scripts
node scripts/install-dsh.mjs --skills-dir ./test-results/dsh-preview --dry-run
node scripts/install-dsh.mjs --skills-dir ./test-results/dsh-preview
# После проверки: реальная установка (по умолчанию ~/.dsh/skills)
node scripts/install-dsh.mjs --dry-run
node scripts/install-dsh.mjs
```

Если задан непустой `DSH_HOME`, default target — `$DSH_HOME/skills`; иначе `~/.dsh/skills`. Явный `--skills-dir` имеет приоритет над обоими вариантами.

По умолчанию устанавливаются **только пять** навыков:

- `retrieval-practice-generator`
- `criterion-referenced-rubric-generator`
- `explicit-instruction-sequence-builder`
- `spaced-practice-scheduler`
- `progressive-hint-ladder`

Установка отдельного навыка заменяет default-выбор, а не дополняет его:

```bash
node scripts/install-dsh.mjs --skill retrieval-practice-generator --skill spaced-practice-scheduler --dry-run
```

Другие навыки с уникальным именем можно выбрать через повторяемый `--skill NAME`; это не проверка педагогической пригодности остальных навыков. Companion skills никогда не устанавливаются автоматически. `--all` — только явный opt-in, несовместимый с `--skill`: **на текущем upstream он намеренно завершается ошибкой до записи**, потому что `critical-thinking-task-designer` встречается в двух доменах. Выбор этого неоднозначного имени также отклоняется. Адаптер не переименовывает source/discovery IDs и не выбирает один вариант молча; используйте уникальные имена. Default пять этой коллизией не затронуты.

## Защита существующих данных

- `--dry-run` проверяет и показывает план, но не создаёт ни каталогов, ни файлов.
- Любая коллизия останавливает preflight до записи. Нет неявного overwrite, даже для ранее установленного этим скриптом навыка.
- Для обновления требуются **оба** флага: `--overwrite --backup`. Старый каталог целиком перемещается в `<skills-dir>/.dsh-backups/<unique-id>/<name>`; путь выводится в консоль. Резервная копия сохраняет пользовательские дополнительные файлы; новая версия их не переносит автоматически.
- Symlink в целевом пути, включая родительские каталоги и dangling links, запрещён. Укажите реальный путь без symlink. Исходные каталоги репозитория защищены от установки поверх них.
- Рендеринг и запись staged-файлов выполняются до замены. Замена атомарна для одного каталога, **не для всего набора**. При поздней ошибке уже установленные навыки остаются; резервные копии сохраняются. Обратная установка старого каталога выполняется при ошибке его финального rename, если target свободен.
- Не запускайте несколько установщиков и не меняйте целевой каталог параллельно: это локальный установщик, не защита от враждебной конкурентной модификации файловой системы. Staging/backups вложены так, что у их непосредственного родителя нет `SKILL.md` и DSH их не обнаруживает как дополнительные навыки.
- Откат вручную: закройте использующие навык сессии, сохраните текущую версию отдельно, затем верните нужный backup в исходное имя. Не удаляйте резервную копию, пока не проверите результат.

Установщик не меняет настройки DSH, не ставит глобальные пакеты и не включает hooks. После установки откройте новую сессию DSH, проверьте наличие пяти имён в каталоге навыков и явно загрузите нужный навык. Автоматическая активация зависит от текущего host-каталога и запроса, а не от этого скрипта.

## Что выполняет модель, а не DSH

DSH не исполняет custom `input_schema`, `output_schema`, `effort`, `chains_well_with`, `evidence_*`. Renderer оставляет стандартные discovery/invocation поля в YAML, переносит все source metadata в читаемое тело и добавляет runtime-пояснение:

- модель собирает обязательные входные данные из диалога, задаёт вопросы при пробелах и интерпретирует буквальные `{{...}}`; автоматической подстановки и schema validation нет;
- формат результата проверяет модель; optional defaults — явные предположения;
- context injection, evidence persistence, chaining/dispatch, learner gates и управление model effort **не реализованы**;
- попытка ученика, постепенные подсказки и reflection — инструкции для диалога, не software gates; evidence summary остаётся сообщением, не автоматически сохранённой записью;
- упоминание другого навыка не доказывает его установку; до вызова нужен текущий каталог, иначе объяснение ограничения и самостоятельный/manual fallback;
- язык и уровень берутся из задачи, включая вуз; школьные ФГОС/ФОП не навязываются;
- citations сохраняются, но не доказывают эффективность конкретного AI prompt. Педагог проверяет факты и пригодность результата.

**Rubric boundary:** `coherent-rubric-logic-builder` отсутствует в default-наборе. DSH-описание не направляет модель вызывать его. Для Manning / Competent = success модель сообщает об unsupported framework, запрашивает реальные правила программы и предлагает явно предварительный manual fallback либо общую criterion-referenced rubric. Specialist допустим только при подтверждённом наличии в runtime-каталоге; правила Manning не выдумываются.

**Литературный пример:** исходный explicit-instruction lesson теперь явно обозначает перенос Macbeth → Romeo and Juliet. Требуется предварительное изучение обоих фрагментов; иначе все фазы остаются на Macbeth. Уточнены порядок гибели Mercutio/Tybalt и условие знакомства с дополнительными текстами. Это исправление исходного примера и DSH-rendering. Registry и MCP snapshot пересобраны: содержательных изменений нет, потому что metadata/prompt не менялись, а MCP bundler не включает раздел Example Output.

## Лицензия и воспроизводимость

Каждый установленный каталог содержит `LICENSE` (полный CC BY-SA 4.0), attribution Gareth Manning / русские адаптации dubr1k и `PROVENANCE.json`:

- URL fork/upstream, конкретный Git HEAD и путь исходника;
- pinned upstream baseline `6bbbce418f82e11044009c9f3b7373a354de5bd0` и integration base `b4e9e384be5798cc4d5132b3ee795211370a8a95`;
- SHA-256 фактически прочитанного source, renderer и результата;
- `sourceModifiedFromCommit`, чтобы локальная правка не выдавалась за содержимое pinned commit.

Источник для чистой повторяемой установки — Git checkout фиксированного commit; при dirty source сохраняйте свои изменения отдельно: source URL указывает на committed base, не на локальные байты. Изменения DSH перечислены в attribution/provenance. Условия ShareAlike и исходные citations сохраняются; endorsement авторов не подразумевается.

## Проверки

```bash
npm test -- tests/dsh-integration.spec.ts
npm test
python3 scripts/validate-skills.py
python3 scripts/validate-registry.py
```

Тесты используют временные каталоги под игнорируемым `test-results/`, не `~/.dsh`. Проверяют default пять, explicit selection/all, YAML discovery и runtime contract, fallback, provenance/license, dry-run, conflict/backup, symlinks и согласованность литературного примера. Это filesystem/contract regression, не end-to-end запуск DSH и не проверка педагогического качества LLM-ответов.
