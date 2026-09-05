import { expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { CHARACTERS } from '../lib/content/characters';
import { PACKS } from '../lib/content/packs';
import {
  CHARACTER_STORIES,
  characterArtPath,
  EPISODE_ARCS,
} from '../lib/content/stories';

it('ships a distinct, bounded WebP portrait and original scene for every character', () => {
  const hashes = new Set<string>();
  const scenes = new Set<string>();
  for (const character of CHARACTERS) {
    const portrait = readFileSync(`public${characterArtPath(character.code)}`);
    expect(new TextDecoder().decode(portrait.subarray(8, 12))).toBe('WEBP');
    expect(portrait.byteLength).toBeLessThan(150_000);
    hashes.add(createHash('sha256').update(portrait).digest('hex'));
    const story = CHARACTER_STORIES[character.code];
    expect(story.artAlt.length).toBeGreaterThan(20);
    scenes.add(story.coldOpen);
  }
  expect(hashes.size).toBe(16);
  expect(scenes.size).toBe(16);
  expect(Object.keys(CHARACTER_STORIES)).toHaveLength(16);
});

it('gives every answer its own reaction and every episode three complete acts', () => {
  const reactions = PACKS.flatMap((p) =>
    p.scenes.flatMap((s) => s.choices.map((c) => c.reaction)),
  );
  expect(new Set(reactions).size).toBe(144);
  for (const pack of PACKS) {
    expect(EPISODE_ARCS[pack.id]).toHaveLength(pack.scenes.length / 4);
  }
});
