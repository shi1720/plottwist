import data from './packs.json';
import type { Pack, PackId } from '../engine/types';
export const PACKS = data as unknown as readonly Pack[];
export function getPack(id: string): Pack {
  const pack = PACKS.find((p) => p.id === id);
  if (!pack) throw new Error('Unknown episode');
  return pack;
}
export function isPackId(id: unknown): id is PackId {
  return typeof id === 'string' && PACKS.some((p) => p.id === id);
}
