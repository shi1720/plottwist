import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { PACKS, getPack, isPackId } from '../lib/content/packs';
import { CHARACTERS, getCharacter } from '../lib/content/characters';
import { scoreAnswers, validatePack } from '../lib/engine/scoring';
import { encodeResult, decodeResult } from '../lib/engine/sharing';
import { compareCharacters } from '../lib/engine/chemistry';
import { parseSession } from '../lib/engine/storage';
import type { Answer, Pack } from '../lib/engine/types';
const choices = fc.array(fc.integer({ min: 0, max: 3 }), {
  minLength: 12,
  maxLength: 12,
});
function answersFor(pack: Pack, indices: number[]): Answer[] {
  return pack.scenes.map((s, i) => ({
    sceneId: s.id,
    choiceId: s.choices[indices[i]].id,
  }));
}
function extremes(pack: Pack, code: string): Answer[] {
  return pack.scenes.map((s) => {
    const axis = s.choices[0].weights.findIndex((w) => w !== 0);
    const value = code[axis] === '1' ? 3 : -3;
    return {
      sceneId: s.id,
      choiceId: s.choices.find((c) => c.weights[axis] === value)!.id,
    };
  });
}
describe('content contract', () => {
  it('has balanced coverage and unique complete content', () => {
    expect(PACKS).toHaveLength(3);
    expect(CHARACTERS).toHaveLength(16);
    for (const pack of PACKS) {
      expect(validatePack(pack)).toEqual([]);
      expect(pack.scenes).toHaveLength(12);
      for (const s of pack.scenes) {
        expect(s.choices).toHaveLength(4);
        expect(s.title.length).toBeGreaterThan(10);
      }
    }
  });
  it('all 16 characters are reachable in every episode', () => {
    for (const p of PACKS)
      for (const c of CHARACTERS) {
        const r = scoreAnswers(p, extremes(p, c.code));
        expect(r.code).toBe(c.code);
        expect(r.complete).toBe(true);
        expect(r.traits.map((t) => t.score)).toEqual(
          c.code.split('').map((v) => (v === '1' ? 100 : 0)),
        );
      }
  });
  it('rejects unknown IDs', () => {
    expect(() => getPack('no')).toThrow();
    expect(() => getCharacter('2000')).toThrow();
    expect(isPackId(null)).toBe(false);
  });
});
describe('scoring invariants', () => {
  for (const pack of PACKS) {
    it(`${pack.id}: order independent, bounded, round-trippable and immutable`, () => {
      fc.assert(
        fc.property(choices, (indices) => {
          const answers = answersFor(pack, indices);
          const before = JSON.stringify(answers);
          const r = scoreAnswers(pack, answers);
          const reversed = scoreAnswers(pack, [...answers].reverse());
          expect(reversed.code).toBe(r.code);
          expect(reversed.traits).toEqual(r.traits);
          expect(r.traits.every((t) => t.score >= 0 && t.score <= 100)).toBe(
            true,
          );
          expect(CHARACTERS.some((c) => c.code === r.code)).toBe(true);
          const shared = decodeResult(encodeResult(pack.id, answers));
          expect(shared.code).toBe(r.code);
          expect(shared.traits.map((t) => t.raw)).toEqual(
            r.traits.map(
              (t) => Math.sign(t.raw) * Math.min(5, Math.abs(t.raw)),
            ),
          );
          expect(shared.traits.map((t) => t.strength)).toEqual(
            r.traits.map((t) => t.strength),
          );
          expect(shared.evidence).toEqual([]);
          expect(JSON.stringify(answers)).toBe(before);
        }),
        { numRuns: 500, seed: 20260905 },
      );
    });
  }
  it('changing an answer replaces evidence and restoring it restores the result', () => {
    const p = getPack('pilot'),
      a = extremes(p, '0000');
    const original = scoreAnswers(p, a);
    const replacement = {
      sceneId: a[0].sceneId,
      choiceId: p.scenes[0].choices.find((c) => c.weights[0] === 3)!.id,
    };
    const edited = [replacement, ...a.slice(1)];
    expect(scoreAnswers(p, edited).traits[0].raw).toBe(-3);
    expect(scoreAnswers(p, edited).evidence[0].choiceId).toBe(
      replacement.choiceId,
    );
    expect(scoreAnswers(p, [a[0], ...edited.slice(1)])).toEqual(original);
  });
  it('increasing one contribution cannot change unrelated axes', () => {
    fc.assert(
      fc.property(choices, (indices) => {
        const p = getPack('pilot');
        const a = answersFor(p, indices);
        const initial = scoreAnswers(p, a);
        a[0] = {
          sceneId: p.scenes[0].id,
          choiceId: p.scenes[0].choices.find((c) => c.weights[0] === 3)!.id,
        };
        const changed = scoreAnswers(p, a);
        expect(changed.traits[0].score).toBeGreaterThanOrEqual(
          initial.traits[0].score,
        );
        expect(changed.traits.slice(1)).toEqual(initial.traits.slice(1));
      }),
      { numRuns: 200, seed: 42 },
    );
  });
  it('labels incomplete and balanced states without inventing a completed result', () => {
    const p = getPack('pilot');
    const r = scoreAnswers(p, []);
    expect(r.complete).toBe(false);
    expect(r.code).toBe('0000');
    expect(r.traits.every((t) => t.score === 50 && t.lean === 'Balanced')).toBe(
      true,
    );
    expect(() => encodeResult('pilot', [])).toThrow(/Finish/);
  });
  it('rejects duplicate, foreign, invalid, and excessive answers', () => {
    const p = getPack('pilot'),
      a = extremes(p, '1111');
    expect(() => scoreAnswers(p, [a[0], a[0]])).toThrow(/Duplicate/);
    expect(() => scoreAnswers(p, [{ sceneId: 'x', choiceId: 'y' }])).toThrow(
      /Unknown scene/,
    );
    expect(() =>
      scoreAnswers(p, [{ sceneId: a[0].sceneId, choiceId: a[1].choiceId }]),
    ).toThrow(/belong/);
    expect(() => scoreAnswers(p, [null] as unknown as Answer[])).toThrow(
      /Invalid answer/,
    );
    expect(() => scoreAnswers(p, Array(12) as Answer[])).toThrow(
      /Invalid answer/,
    );
    expect(() => scoreAnswers(p, {} as Answer[])).toThrow(/count/);
    expect(() => scoreAnswers(p, [...a, a[0]])).toThrow(/count/);
  });
});
describe('untrusted link boundary', () => {
  it.each([
    '',
    'v2.pilot.1_1_1_1',
    'v1.unknown.1_1_1_1',
    'v1.pilot.1_1_1',
    'v1.pilot.0_1_1_1',
    'v1.pilot.2_1_1_1',
    'v1.pilot.99_1_1_1',
    'v1.pilot.NaN_1_1_1',
    'v1.pilot.1_1_1_1.extra',
    'x'.repeat(100),
    'v1.pilot.01_1_1_1',
    'v1.pilot.1_1_1_1\n',
  ])('rejects %s', (token) => expect(() => decodeResult(token)).toThrow());
  it('rejects arbitrary malformed values without leaking parser exceptions', () => {
    fc.assert(
      fc.property(fc.string(), (value) => {
        try {
          const r = decodeResult(value);
          expect(r.complete).toBe(true);
          expect(r.traits.every((t) => Number.isFinite(t.score))).toBe(true);
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
        }
      }),
      { numRuns: 500, seed: 12 },
    );
    expect(() => decodeResult(null as unknown as string)).toThrow();
  });
  it('uses a frozen explicit regression vector', () => {
    const r = decodeResult('v1.pilot.9_-3_1_-9');
    expect(r.code).toBe('1010');
    expect(r.traits.map((t) => t.score)).toEqual([100, 33, 56, 0]);
  });
});
describe('local resume boundary', () => {
  const pack = getPack('pilot'),
    answers = extremes(pack, '1010');
  const session = {
    version: 1,
    packId: 'pilot',
    answers: answers.slice(0, 3),
    cursor: 2,
    updatedAt: 100,
  };
  it('round-trips canonical partial and completed sessions', () => {
    expect(parseSession(JSON.stringify(session))).toEqual(session);
    expect(
      parseSession(JSON.stringify({ ...session, answers, cursor: 11 })),
    ).not.toBeNull();
  });
  it('rejects corrupt, sparse, wrong-version and impossible cursor data', () => {
    for (const data of [
      null,
      'bad',
      'x'.repeat(10001),
      JSON.stringify({ ...session, version: 2 }),
      JSON.stringify({ ...session, packId: 'unknown' }),
      JSON.stringify({ ...session, cursor: 5 }),
      JSON.stringify({ ...session, cursor: -1 }),
      JSON.stringify({ ...session, cursor: 12 }),
      JSON.stringify({ ...session, cursor: 0.5 }),
      JSON.stringify({ ...session, updatedAt: null }),
      JSON.stringify({ ...session, answers: [answers[1]] }),
      JSON.stringify({ ...session, answers: [answers[0], answers[0]] }),
    ])
      expect(parseSession(data)).toBeNull();
  });
});
describe('chemistry', () => {
  it('all 256 pairs have symmetric narrative and complementary counts', () => {
    for (const a of CHARACTERS)
      for (const b of CHARACTERS) {
        const ab = compareCharacters(a.code, b.code),
          ba = compareCharacters(b.code, a.code);
        expect(ab.title).toBe(ba.title);
        expect(ab.premise).toBe(ba.premise);
        expect(ab.tips).toEqual(ba.tips);
        expect(ab.shared + ab.differences).toBe(4);
        expect(ab.tips).toHaveLength(4);
      }
  });
  it('same and opposite pairs have explicit narratives', () => {
    expect(compareCharacters('0000', '0000').shared).toBe(4);
    expect(compareCharacters('0000', '1111').differences).toBe(4);
    expect(() => compareCharacters('no', '1111')).toThrow();
  });
});
