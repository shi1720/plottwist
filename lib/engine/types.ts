export type Axis = 'energy' | 'logic' | 'order' | 'vision';
export type Vector = readonly [number, number, number, number];
export type PackId = 'pilot' | 'office' | 'friends';
export interface Choice {
  id: string;
  text: string;
  reaction: string;
  weights: Vector;
}
export interface Scene {
  id: string;
  setting: string;
  title: string;
  detail: string;
  choices: readonly Choice[];
}
export interface Pack {
  id: PackId;
  title: string;
  subtitle: string;
  color: string;
  scenes: readonly Scene[];
}
export interface Answer {
  sceneId: string;
  choiceId: string;
}
export interface Trait {
  axis: Axis;
  low: string;
  high: string;
  score: number;
  raw: number;
  maximum: number;
  lean: string;
  strength: 'balanced' | 'slight' | 'clear';
}
export interface Result {
  version: 1;
  packId: PackId;
  code: string;
  traits: readonly Trait[];
  answered: number;
  total: number;
  complete: boolean;
  evidence: readonly {
    sceneId: string;
    choiceId: string;
    text: string;
    weights: Vector;
  }[];
}
export interface Character {
  code: string;
  name: string;
  tagline: string;
  description: string;
  roast: string;
  strength: string;
  growth: string;
  quote: string;
  color: string;
  family: 'spark' | 'cloud' | 'flower' | 'square';
  tags: readonly string[];
}
