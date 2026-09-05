import { getPack, isPackId } from '../content/packs';
import { scoreAnswers } from './scoring';
import type { Answer, PackId } from './types';
export const STORAGE_KEY = 'plottwist.session.v1';
export interface Session {
  version: 1;
  packId: PackId;
  answers: Answer[];
  cursor: number;
  updatedAt: number;
}
export function parseSession(raw: string | null): Session | null {
  try {
    if (!raw || raw.length > 10000) return null;
    const data = JSON.parse(raw) as Session;
    if (
      data.version !== 1 ||
      !isPackId(data.packId) ||
      !Number.isInteger(data.cursor) ||
      !Number.isFinite(data.updatedAt)
    )
      return null;
    const pack = getPack(data.packId);
    scoreAnswers(pack, data.answers);
    if (
      data.cursor < 0 ||
      data.cursor >= pack.scenes.length ||
      data.cursor > data.answers.length
    )
      return null;
    // Resumable sessions must be a canonical prefix, never sparse or reordered.
    if (data.answers.some((a, i) => a.sceneId !== pack.scenes[i].id))
      return null;
    return data;
  } catch {
    return null;
  }
}
