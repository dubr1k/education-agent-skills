#!/usr/bin/env node
// DSH adapter / адаптер DSH. CC BY-SA 4.0; см. LICENSE.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import { parse, stringify } from 'yaml';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = 'https://github.com/dubr1k/education-agent-skills';
const UPSTREAM = 'https://github.com/GarethManning/education-agent-skills';
export const DEFAULT_SKILLS = [
  'retrieval-practice-generator', 'criterion-referenced-rubric-generator',
  'explicit-instruction-sequence-builder', 'spaced-practice-scheduler', 'progressive-hint-ladder',
];
const RUBRIC = 'criterion-referenced-rubric-generator';
const PREAMBLE = `## DSH runtime contract / контракт выполнения

These instructions are interpreted by the model, not an executable teaching engine.
- Gather required inputs from the conversation; ask for missing essentials before generating the result. Treat {{...}} as literal placeholders to interpret using supplied values, not template code automatically substituted by DSH. Use optional defaults only when stated and disclose assumptions.
- No automatic schema validation or typed output enforcement: interpret the input/output contracts below and check the requested format yourself.
- No automatic context injection: use only context the user supplied or explicitly authorized. References to a context engine describe an optional external architecture, not an installed service.
- No automatic evidence persistence: evidence fields are a conversational summary convention, not a database or telemetry. Do not write learner records or claim they were saved without an explicit user request and an available authorized tool.
- No runtime-enforced learner gates: ask for attempts and reflection and wait for replies as pedagogical instructions; do not claim software enforces them. Keep hint levels in this conversation only unless the user supplies earlier context.
- This adapter does not set model effort. Upstream effort metadata is informational only.
- Chaining is optional advice, not automatic dispatch. Never assume a named companion is installed. Check the current skill catalog before any invocation; if absent, explain the limitation and offer a manual standalone approach. Do not install dependencies or the whole library automatically.
- Follow the user's language and actual educational level, including higher education. Do not impose school standards (including ФГОС/ФОП) unless requested or supplied in context.
- Research citations support pedagogical approaches, not proof that this AI prompt is effective. Verify subject facts, curriculum fit, examples and answer keys; retain limitations and seek educator review.

`;
const RUBRIC_NOTE = `### Rubric framework boundary / граница применимости

Manning programmes where Competent = success are an unsupported framework for this general rubric skill. Do not call coherent-rubric-logic-builder merely because the upstream description names it: it is not part of the default five-skill installation. Explain this limitation first. Offer a manual fallback: ask for the programme's actual competency definitions and success rules, then draft a clearly labelled provisional rubric for educator review, or offer a general criterion-referenced rubric if appropriate. Do not invent Manning framework rules. Only use a specialist skill if it is genuinely present in the current runtime catalog and relevant to the user's request.

`;

function sha(text) { return createHash('sha256').update(text).digest('hex'); }
function lstat(file) { try { return fs.lstatSync(file); } catch (e) { if (e.code === 'ENOENT') return null; throw e; } }
// Проверяем каждый компонент: resolve() сам по себе не защищает от symlink.
function noLinks(file) {
  const absolute = path.resolve(file);
  let current = path.parse(absolute).root;
  for (const part of absolute.slice(current.length).split(path.sep).filter(Boolean)) {
    current = path.join(current, part);
    if (lstat(current)?.isSymbolicLink()) throw new Error(`Symlink refused: ${current}`);
  }
  return absolute;
}
function inventory() {
  const entries = [];
  const base = path.join(ROOT, 'skills');
  for (const domain of fs.readdirSync(base, { withFileTypes: true })) {
    if (!domain.isDirectory()) continue;
    for (const entry of fs.readdirSync(path.join(base, domain.name), { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const sourcePath = `skills/${domain.name}/${entry.name}/SKILL.md`;
      if (!lstat(path.join(ROOT, sourcePath))) continue;
      noLinks(path.join(ROOT, sourcePath));
      const source = fs.readFileSync(path.join(ROOT, sourcePath), 'utf8');
      const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
      if (!match) throw new Error(`Invalid frontmatter: ${sourcePath}`);
      const meta = parse(match[1]);
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(meta.name) || meta.name !== entry.name || typeof meta.description !== 'string') {
        throw new Error(`Invalid discovery name/description: ${sourcePath}`);
      }
      entries.push({ sourcePath, source, meta, body: match[2], domain: domain.name });
    }
  }
  const found = new Map();
  for (const entry of entries) {
    entry.ambiguous = entries.filter(other => other.meta.name === entry.meta.name).length > 1;
    found.set(entry.meta.name, entry);
  }
  return found;
}
export function render(skill) {
  const meta = skill.meta;
  const description = meta.name === RUBRIC
    ? 'Generate general criterion-referenced rubrics with descriptive levels. Manning programmes are an unsupported framework: discuss manual fallback; never assume a specialist skill is installed.'
    : meta.description;
  const header = { name: meta.name, description };
  // Сохраняем standard invocation flags; custom поля переносим в читаемое тело.
  for (const key of ['disable-model-invocation', 'user-invocable']) if (key in meta) header[key] = meta[key];
  return `---\n${stringify(header)}---\n\n${PREAMBLE}${meta.name === RUBRIC ? RUBRIC_NOTE : ''}`
    + `## Source metadata (reference only)\n\nVerbatim source metadata for reference, not runtime services or dispatch instructions. The DSH runtime contract and rubric framework boundary above override any source routing suggestion. Interpret schemas as conversational guidance only.\n\n\`\`\`yaml\n${stringify(meta)}\`\`\`\n\n`
    + skill.body + '\n\n## Attribution / происхождение\n\n'
    + `Original education materials: Gareth Manning (${UPSTREAM}). Russian adaptations: dubr1k (${SOURCE}). DSH adaptation: flattened discovery, runtime contract and safe optional routing. Licensed CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/); see LICENSE and PROVENANCE.json alongside this file. Source citations are retained; no endorsement implied.\n`;
}
function options(args) {
  const result = { skillsDir: path.join(process.env.DSH_HOME || path.join(os.homedir(), '.dsh'), 'skills'), skills: [] };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--skills-dir' || arg === '--skill') {
      const value = args[++i];
      if (!value || value.startsWith('--')) throw new Error(`Missing value: ${arg}`);
      if (arg === '--skill') result.skills.push(value); else result.skillsDir = value;
    } else if (['--all', '--dry-run', '--overwrite', '--backup', '--help'].includes(arg)) result[arg.slice(2)] = true;
    else throw new Error(`Unknown option: ${arg}`);
  }
  if (result.all && result.skills.length) throw new Error('Use --all OR --skill, not both');
  if (Boolean(result.overwrite) !== Boolean(result.backup)) throw new Error('Replacement requires BOTH --overwrite --backup');
  return result;
}
export function main(args = process.argv.slice(2)) {
  const opts = options(args);
  if (opts.help) {
    console.log('Usage: node scripts/install-dsh.mjs [--skills-dir PATH] [--skill NAME (repeatable) | --all] [--dry-run] [--overwrite --backup]\nDefault: five curated skills into $DSH_HOME/skills, or ~/.dsh/skills when DSH_HOME is unset/empty. Existing targets are never replaced without a backup.');
    return;
  }
  const all = inventory();
  const selected = [...new Set(opts.all ? [...all.keys()].sort() : opts.skills.length ? opts.skills : DEFAULT_SKILLS)];
  const dest = noLinks(opts.skillsDir);
  if (lstat(dest) && !fs.statSync(dest).isDirectory()) throw new Error(`Not a directory: ${dest}`);
  // Не допускаем установки поверх исходников или репозитория Git.
  for (const protectedDir of ['skills', '.git', 'scripts', 'docs', 'tests', 'mcp-server']) {
    const protectedPath = path.join(ROOT, protectedDir);
    if (dest === protectedPath || dest.startsWith(protectedPath + path.sep)) throw new Error(`Protected source directory: ${dest}`);
  }
  const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim();
  const license = fs.readFileSync(path.join(ROOT, 'LICENSE'), 'utf8');
  const plans = selected.map(name => {
    const source = all.get(name);
    if (!source) throw new Error(`Unknown skill: ${name}`);
    if (source.ambiguous) throw new Error(`Ambiguous discovery name: ${name}; select other unique skills with --skill. No renaming or partial installation performed.`);
    const target = noLinks(path.join(dest, name));
    if (path.dirname(target) !== dest) throw new Error(`Unsafe target: ${target}`);
    const exists = lstat(target);
    if (exists && !opts.overwrite) throw new Error(`Target exists: ${target}; use --overwrite --backup`);
    const rendered = render(source);
    const original = execFileSync('git', ['show', `${commit}:${source.sourcePath}`], { cwd: ROOT });
    return { name, target, exists, rendered, provenance: {
      formatVersion: 1, sourceRepository: SOURCE, upstreamRepository: UPSTREAM,
      upstreamBaselineCommit: '6bbbce418f82e11044009c9f3b7373a354de5bd0',
      integrationBaseCommit: 'b4e9e384be5798cc4d5132b3ee795211370a8a95',
      sourceCommit: commit, sourcePath: source.sourcePath,
      sourceUrl: `${SOURCE}/blob/${commit}/${source.sourcePath}`,
      sourceModifiedFromCommit: sha(original) !== sha(source.source),
      sourceSha256: sha(source.source), renderedSha256: sha(rendered),
      adapterSha256: sha(fs.readFileSync(fileURLToPath(import.meta.url))),
      license: 'CC-BY-SA-4.0', attribution: 'Gareth Manning; Russian adaptations by dubr1k',
      modifications: 'DSH runtime contract, flattened discovery, metadata in body, rubric fallback. Source differences from pinned commit are identified by sourceModifiedFromCommit and sourceSha256.',
    } };
  });
  const backupBase = noLinks(path.join(dest, '.dsh-backups'));
  if (lstat(backupBase) && !fs.statSync(backupBase).isDirectory()) throw new Error(`Not a directory: ${backupBase}`);
  for (const plan of plans) console.log(`${plan.exists ? 'BACKUP + REPLACE' : 'INSTALL'} ${plan.target}`);
  if (opts['dry-run']) { console.log('Dry run: no files written.'); return; }
  fs.mkdirSync(dest, { recursive: true });
  const batch = randomUUID();
  const backupDir = path.join(backupBase, batch);
  // Staging и backups вложены на два уровня: DSH не обнаружит их как skills.
  const stageRoot = fs.mkdtempSync(path.join(dest, '.dsh-stage-'));
  try {
    for (const plan of plans) {
      const stage = path.join(stageRoot, plan.name);
      fs.mkdirSync(stage);
      fs.writeFileSync(path.join(stage, 'SKILL.md'), plan.rendered, { flag: 'wx' });
      fs.writeFileSync(path.join(stage, 'LICENSE'), license, { flag: 'wx' });
      fs.writeFileSync(path.join(stage, 'PROVENANCE.json'), JSON.stringify(plan.provenance, null, 2) + '\n', { flag: 'wx' });
    }
    for (const plan of plans) {
      noLinks(plan.target);
      if (Boolean(lstat(plan.target)) !== Boolean(plan.exists)) throw new Error(`Target changed during install: ${plan.target}`);
      let backup;
      if (plan.exists) {
        noLinks(backupDir);
        fs.mkdirSync(backupDir, { recursive: true });
        backup = path.join(backupDir, plan.name);
        // Оба пути абсолютные и проверены: не перезаписываем чужой backup.
        if (lstat(backup)) throw new Error(`Backup exists: ${backup}`);
        fs.renameSync(plan.target, backup);
        console.log(`BACKUP ${backup}`);
      }
      try { fs.renameSync(path.join(stageRoot, plan.name), plan.target); }
      catch (error) {
        if (backup && !lstat(plan.target)) fs.renameSync(backup, plan.target);
        throw error;
      }
    }
  } finally {
    // Удаляется только собственная staging-директория, не target/backup.
    noLinks(stageRoot);
    if (path.dirname(stageRoot) !== dest || !path.basename(stageRoot).startsWith('.dsh-stage-')) throw new Error('Unsafe staging cleanup');
    fs.rmSync(stageRoot, { recursive: true, force: true });
  }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); } catch (error) { console.error(`DSH install: ${error.message}`); process.exitCode = 1; }
}
