import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { assemblePrompt, handleFindSkills } from '../src/tool-handler.js';
import type { LoadedSkill } from '../src/types.js';

const skills: LoadedSkill[] = JSON.parse(readFileSync(new URL('../src/skills.json', import.meta.url), 'utf8'));

test('every served prompt carries locale boundaries, including user-invoked skills', () => {
  expect(skills).toHaveLength(165);
  for (const skill of skills) {
    expect(skill.prompt, skill.metadata.skill_id).toContain('Русскоязычный контекст не определяет страну');
    expect(skill.prompt, skill.metadata.skill_id).toContain('школа, СПО, вуз, ДПО');
    expect(skill.prompt, skill.metadata.skill_id).toContain('не заявляйте соответствие ФГОС/ФОП');
    expect(skill.prompt, skill.metadata.skill_id).not.toContain('or names a non-Russian context, respond in English');
  }
});

test('planning retains supplied hours, identifiers and grading boundaries verbatim', () => {
  const skill = skills.find(s => s.toolName === 'backwards-design-unit-planner')!;
  const values = {
    desired_outcomes: 'ОК 01; индикатор ИД-1; текст {{source}} $&',
    student_level: 'СПО, Таджикистан, русский язык, десятибалльная шкала',
    unit_duration: '72 часа; 2 вечерних занятия',
  };
  const result = assemblePrompt(skill, values);
  for (const value of Object.values(values)) expect(result).toContain(value);
  expect(result).toContain('сохраняйте предоставленные часы, коды компетенций, индикаторы и шкалу оценивания');
  expect(result).toContain('новые значения отмечайте как предложения');
});

test('inclusive prompts do not turn imported terminology into a diagnosis or status', () => {
  for (const skill of skills.filter(s => s.metadata.domain === 'inclusive-design')) {
    expect(skill.prompt).toContain('SEND/IEP не подтверждает ОВЗ, ИОМ, АООП или диагноз');
  }
});

for (const query of ['РПД', 'СПО', 'вуз', 'ДПО']) {
  test(`Russian education-level discovery works for ${query}`, () => {
    const result = handleFindSkills(skills, { query });
    const text = result.content.map(c => c.text).join('\n');
    expect(text).toContain('backwards-design-unit-planner');
  });
}
