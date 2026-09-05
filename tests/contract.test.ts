import { it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { contentContractHash } from '../scripts/content-contract';
import { getPack } from '../lib/content/packs';
import { encodeResult, decodeResult } from '../lib/engine/sharing';
it('freezes the v1 identity and weight contract', () =>
  expect(contentContractHash()).toBe(
    readFileSync('lib/content/v1-contract.sha256', 'utf8').trim(),
  ));
it('coarsens extremes without changing character or tendency category', () => {
  const pack = getPack('pilot');
  const answers = pack.scenes.map((s) => ({
    sceneId: s.id,
    choiceId: s.choices.find((c) => c.weights.some((w) => w === 3))!.id,
  }));
  const token = encodeResult('pilot', answers);
  expect(token).toBe('v1.pilot.5_5_5_5');
  expect(decodeResult(token).code).toBe('1111');
  expect(decodeResult(token).traits.every((t) => t.strength === 'clear')).toBe(
    true,
  );
});
