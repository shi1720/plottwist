import { it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { PACKS } from '../lib/content/packs';
import { scoreAnswers } from '../lib/engine/scoring';
it('matches the independent Python oracle on 300 seeded complete and partial episodes', () => {
  let state = 1720;
  const random = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state;
  };
  const inputs = Array.from({ length: 300 }, (_, i) => {
    const pack = PACKS[i % 3];
    const length = i % 13;
    return {
      packId: pack.id,
      answers: pack.scenes
        .slice(0, length)
        .map((s) => ({ sceneId: s.id, choiceId: s.choices[random() % 4].id })),
    };
  });
  const run = spawnSync('python3', ['evaluation/reference.py'], {
    input: inputs.map((i) => JSON.stringify(i)).join('\n') + '\n',
    encoding: 'utf8',
  });
  expect(run.status, run.stderr).toBe(0);
  const expected = run.stdout
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line));
  expect(expected).toHaveLength(inputs.length);
  inputs.forEach((input, i) => {
    const result = scoreAnswers(
      PACKS.find((p) => p.id === input.packId)!,
      input.answers,
    );
    expect({
      raw: result.traits.map((t) => t.raw),
      scores: result.traits.map((t) => t.score),
      code: result.code,
      complete: result.complete,
    }).toEqual(expected[i]);
  });
});
