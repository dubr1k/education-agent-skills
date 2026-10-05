import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { parse } from 'yaml';

const root = path.resolve(__dirname, '..');
const names = ['retrieval-practice-generator', 'criterion-referenced-rubric-generator',
  'explicit-instruction-sequence-builder', 'spaced-practice-scheduler', 'progressive-hint-ladder'];
function run(dir: string, ...args: string[]) {
  return spawnSync(process.execPath, [path.join(root, 'scripts/install-dsh.mjs'), '--skills-dir', dir, ...args],
    { cwd: root, encoding: 'utf8' });
}
function temp(testInfo: any) {
  const dir = testInfo.outputPath('fixture');
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}
function skill(dir: string, name: string) { return fs.readFileSync(path.join(dir, name, 'SKILL.md'), 'utf8'); }

test('DSH_HOME controls the default and explicit skills-dir wins', ({}, info) => {
  const dir = temp(info);
  const home = path.join(dir, 'home');
  const explicit = path.join(dir, 'explicit');
  for (const extra of [[], ['--skills-dir', explicit]]) {
    const result = spawnSync(process.execPath,
      [path.join(root, 'scripts/install-dsh.mjs'), '--dry-run', ...extra],
      { cwd: root, encoding: 'utf8', env: { ...process.env, DSH_HOME: home } });
    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toContain(path.join(extra.length ? explicit : path.join(home, 'skills'), names[0]));
  }
  expect(fs.readdirSync(dir)).toEqual([]);
});

test('DSH dry-run creates nothing and defaults to exactly five', ({}, info) => {
  const dir = path.join(temp(info), 'absent');
  const result = run(dir, '--dry-run');
  expect(result.status, result.stderr).toBe(0);
  expect(fs.existsSync(dir)).toBe(false);
  for (const name of names) expect(result.stdout).toContain(name);
  expect(result.stdout.split('\n').filter(line => line.startsWith('INSTALL '))).toHaveLength(5);
});

test('DSH renders discoverable YAML and preserves contracts, citations and provenance', ({}, info) => {
  const dir = temp(info);
  const result = run(dir);
  expect(result.status, result.stderr).toBe(0);
  expect(fs.readdirSync(dir).sort()).toEqual([...names].sort());
  for (const name of names) {
    const text = skill(dir, name);
    const header = parse(text.split('---\n')[1]);
    expect(header.name).toBe(name);
    expect(header.description).toBeTruthy();
    expect(header.input_schema).toBeUndefined();
    expect(header.effort).toBeUndefined();
    expect(text).toContain('No automatic schema validation');
    expect(text).toContain('literal placeholders');
    expect(text).toContain('No automatic evidence persistence');
    expect(text).toContain('No automatic context injection');
    expect(text).toContain('No runtime-enforced learner gates');
    expect(text).toContain('does not set model effort');
    expect(text).toContain('## Source metadata (reference only)');
    expect(text).toContain('Gareth Manning');
    expect(text).toContain('CC BY-SA 4.0');
    const provenance = JSON.parse(fs.readFileSync(path.join(dir, name, 'PROVENANCE.json'), 'utf8'));
    expect(provenance.sourceCommit).toMatch(/^[a-f0-9]{40}$/);
    const source = fs.readFileSync(path.join(root, provenance.sourcePath));
    expect(provenance.sourceSha256).toBe(createHash('sha256').update(source).digest('hex'));
    const originalMetadata = parse(source.toString().split('---\n')[1]);
    const referenceMetadata = parse(text.match(/```yaml\n([\s\S]*?)```/)![1]);
    expect(referenceMetadata).toEqual(originalMetadata);
    expect(header.description.length).toBeLessThanOrEqual(250);
    expect(provenance.renderedSha256).toBe(createHash('sha256').update(text).digest('hex'));
    expect(fs.readFileSync(path.join(dir, name, 'LICENSE'), 'utf8')).toContain('Gareth Manning');
  }
  expect(skill(dir, names[4])).toContain('student_attempt_required: true');
  expect(skill(dir, names[0])).toContain('question_count');
});

test('DSH rubric discovery does not route to an absent skill', ({}, info) => {
  const dir = temp(info);
  expect(run(dir).status).toBe(0);
  const text = skill(dir, names[1]);
  const header = parse(text.split('---\n')[1]);
  expect(header.description).not.toContain('use coherent-rubric-logic-builder instead');
  expect(text).toContain('unsupported framework');
  expect(text).toContain('Do not call coherent-rubric-logic-builder');
  expect(text).toContain('manual fallback');
  expect(fs.existsSync(path.join(dir, 'coherent-rubric-logic-builder'))).toBe(false);
});

test('DSH existing targets refused before any writes; overwrite requires backup', ({}, info) => {
  const dir = temp(info);
  const target = path.join(dir, names[1]);
  fs.mkdirSync(target); fs.writeFileSync(path.join(target, 'mine.txt'), 'keep');
  expect(run(dir).status).not.toBe(0);
  expect(fs.readdirSync(dir)).toEqual([names[1]]);
  expect(run(dir, '--overwrite').status).not.toBe(0);
  const dry = run(dir, '--overwrite', '--backup', '--dry-run');
  expect(dry.status, dry.stderr).toBe(0);
  expect(fs.readdirSync(dir)).toEqual([names[1]]);
  const done = run(dir, '--overwrite', '--backup');
  expect(done.status, done.stderr).toBe(0);
  const backupRoot = path.join(dir, '.dsh-backups');
  const backups = fs.readdirSync(backupRoot);
  expect(backups).toHaveLength(1);
  expect(fs.readFileSync(path.join(backupRoot, backups[0], names[1], 'mine.txt'), 'utf8')).toBe('keep');
  expect(fs.existsSync(path.join(backupRoot, 'SKILL.md'))).toBe(false);
});

test('DSH selection is explicit, deduplicated, and rejects unknown/traversal', ({}, info) => {
  const dir = temp(info);
  expect(run(dir, '--skill', names[0], '--skill', names[0]).status).toBe(0);
  expect(fs.readdirSync(dir)).toEqual([names[0]]);
  for (const value of ['../escape', 'not-a-skill']) expect(run(dir, '--skill', value).status).not.toBe(0);
  expect(run(dir, '--all', '--skill', names[0]).status).not.toBe(0);
  const allDir = path.join(dir, 'all');
  const all = run(allDir, '--all');
  expect(all.status).not.toBe(0);
  expect(all.stderr).toContain('Ambiguous discovery name: critical-thinking-task-designer');
  expect(fs.existsSync(allDir)).toBe(false);
  const ambiguous = run(allDir, '--skill', 'critical-thinking-task-designer');
  expect(ambiguous.stderr).toContain('Ambiguous discovery name');
  expect(fs.existsSync(allDir)).toBe(false);
});

test('DSH rejects target symlinks, including dangling links and parent links', ({}, info) => {
  const dir = temp(info);
  const outside = path.join(dir, 'outside'); fs.mkdirSync(outside);
  const destination = path.join(dir, 'skills'); fs.mkdirSync(destination);
  fs.symlinkSync(outside, path.join(destination, names[0]));
  expect(run(destination, '--overwrite', '--backup').status).not.toBe(0);
  fs.symlinkSync(path.join(dir, 'missing'), path.join(destination, names[1]));
  expect(run(destination, '--skill', names[1], '--overwrite', '--backup').status).not.toBe(0);
  fs.symlinkSync(outside, path.join(dir, 'linked'));
  expect(run(path.join(dir, 'linked', 'nested')).status).not.toBe(0);
  expect(fs.readdirSync(outside)).toEqual([]);
});

test('explicit instruction example labels cross-text transfer and preserves literary facts', ({}, info) => {
  const file = 'skills/explicit-instruction/explicit-instruction-sequence-builder/SKILL.md';
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  expect(source).toContain('Cross-text transfer');
  expect(source).toContain('prior knowledge of both Macbeth and Romeo and Juliet');
  expect(source).toContain('If this prior knowledge is absent');
  expect(source).toContain('Lady Macbeth');
  expect(source).toContain('Act 1, Scene 5');
  expect(source).toContain('Romeo and Juliet, Act 3, Scene 1');
  expect(source).toContain('Tybalt kills Mercutio; Romeo then kills Tybalt');
  expect(source).toContain('Same text as the guided example');
  const dir = temp(info); expect(run(dir).status).toBe(0);
  expect(skill(dir, names[2])).toContain('prior knowledge of both Macbeth and Romeo and Juliet');
});
