import { createHash } from 'node:crypto';
import { PACKS } from '../lib/content/packs';
import { CHARACTERS } from '../lib/content/characters';
export function contentContractHash() {
  return createHash('sha256')
    .update(
      JSON.stringify({
        version: 1,
        axes: ['energy', 'logic', 'order', 'vision'],
        packs: PACKS.map((p) => ({
          id: p.id,
          scenes: p.scenes.map((s) => ({
            id: s.id,
            choices: s.choices.map((c) => ({ id: c.id, weights: c.weights })),
          })),
        })),
        characters: CHARACTERS.map((c) => ({ code: c.code, name: c.name })),
      }),
    )
    .digest('hex');
}
