import { getPack, isPackId } from '../content/packs';
import { AXES, scoreAnswers } from './scoring';
import type { Answer, PackId, Result } from './types';
/** Frozen v1 pack + scoring contract. Share only aggregate raw tendencies, never individual answers. */
export function encodeResult(
  packId: PackId,
  answers: readonly Answer[],
): string {
  const result = scoreAnswers(getPack(packId), answers);
  if (!result.complete) throw new Error('Finish the episode before sharing');
  return `v1.${packId}.${result.traits.map((t) => Math.sign(t.raw) * Math.min(5, Math.abs(t.raw))).join('_')}`;
}
export function decodeResult(token: string): Result {
  if (typeof token !== 'string' || token.length > 80 || token.trim() !== token)
    throw new Error('This result link is not valid');
  const parts = token.split('.');
  if (parts.length !== 3 || parts[0] !== 'v1' || !isPackId(parts[1]))
    throw new Error('This result link is not supported');
  if (!/^-?[1-9]_-?[1-9]_-?[1-9]_-?[1-9]$/.test(parts[2]))
    throw new Error('This result link is incomplete');
  const raw = parts[2].split('_').map(Number);
  if (raw.some((n) => Math.abs(n) % 2 !== 1))
    throw new Error('This result contains an impossible score');
  const pack = getPack(parts[1]);
  return {
    version: 1,
    packId: pack.id,
    code: raw.map((n) => (n > 0 ? '1' : '0')).join(''),
    traits: AXES.map((a, i) => {
      const score = Math.round(50 + (50 * raw[i]) / 9);
      return {
        ...a,
        raw: raw[i],
        maximum: 9,
        score,
        lean: raw[i] > 0 ? a.high : a.low,
        strength:
          Math.abs(score - 50) < 10
            ? 'balanced'
            : Math.abs(score - 50) < 28
              ? 'slight'
              : 'clear',
      };
    }),
    answered: 12,
    total: 12,
    complete: true,
    evidence: [],
  };
}
