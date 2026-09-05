import type { Answer, Axis, Pack, Result, Trait } from './types';
export const AXES: readonly { axis: Axis; low: string; high: string }[] = [
  { axis: 'energy', low: 'Quiet presence', high: 'Room energy' },
  { axis: 'logic', low: 'Heart first', high: 'Head first' },
  { axis: 'order', low: 'Improv mode', high: 'A good plan' },
  { axis: 'vision', low: 'Here & now', high: 'What if?' },
];
/** Pure O(scenes + answers) scorer. Scores use only answered scenes; incomplete results are marked explicitly. */
export function scoreAnswers(pack: Pack, answers: readonly Answer[]): Result {
  if (!Array.isArray(answers) || answers.length > pack.scenes.length)
    throw new Error('Invalid answer count');
  const index = new Map(pack.scenes.map((scene) => [scene.id, scene]));
  const seen = new Set<string>();
  const raw = [0, 0, 0, 0],
    maximum = [0, 0, 0, 0];
  const evidence = Array.from(answers, (answer) => {
    if (
      !answer ||
      typeof answer.sceneId !== 'string' ||
      typeof answer.choiceId !== 'string'
    )
      throw new Error('Invalid answer');
    if (seen.has(answer.sceneId)) throw new Error('Duplicate scene answer');
    seen.add(answer.sceneId);
    const scene = index.get(answer.sceneId);
    if (!scene) throw new Error('Unknown scene');
    const choice = scene.choices.find((c) => c.id === answer.choiceId);
    if (!choice) throw new Error('Choice does not belong to scene');
    for (let i = 0; i < 4; i++) {
      raw[i] += choice.weights[i];
      maximum[i] += Math.max(
        ...scene.choices.map((c) => Math.abs(c.weights[i])),
      );
    }
    return {
      sceneId: scene.id,
      choiceId: choice.id,
      text: choice.text,
      weights: choice.weights,
    };
  });
  const traits: Trait[] = AXES.map((axis, i) => {
    const score =
      maximum[i] === 0 ? 50 : Math.round(50 + (50 * raw[i]) / maximum[i]);
    return {
      ...axis,
      score,
      raw: raw[i],
      maximum: maximum[i],
      lean: raw[i] === 0 ? 'Balanced' : raw[i] > 0 ? axis.high : axis.low,
      strength:
        Math.abs(score - 50) < 10
          ? 'balanced'
          : Math.abs(score - 50) < 28
            ? 'slight'
            : 'clear',
    };
  });
  // Exactly balanced dimensions choose the low pole; the UI still says Balanced.
  const code = raw.map((value) => (value > 0 ? '1' : '0')).join('');
  return {
    version: 1,
    packId: pack.id,
    code,
    traits,
    answered: answers.length,
    total: pack.scenes.length,
    complete: answers.length === pack.scenes.length,
    evidence,
  };
}
export function validatePack(pack: Pack): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const coverage = [0, 0, 0, 0];
  for (const scene of pack.scenes) {
    if (ids.has(scene.id)) errors.push(`Duplicate scene ${scene.id}`);
    ids.add(scene.id);
    const choices = new Set<string>();
    for (const c of scene.choices) {
      if (choices.has(c.id)) errors.push(`Duplicate choice ${c.id}`);
      choices.add(c.id);
      if (
        c.weights.length !== 4 ||
        c.weights.some(
          (w) => !Number.isFinite(w) || !Number.isInteger(w) || Math.abs(w) > 3,
        )
      )
        errors.push(`Invalid weights ${c.id}`);
    }
    for (let i = 0; i < 4; i++) {
      const weights = scene.choices.map((c) => c.weights[i]);
      if (weights.some((w) => w !== 0)) {
        coverage[i]++;
        if (Math.min(...weights) !== -Math.max(...weights))
          errors.push(`Unbalanced scene ${scene.id}`);
      }
    }
  }
  if (new Set(coverage).size !== 1 || coverage[0] === 0)
    errors.push('Unequal or empty dimension coverage');
  return errors;
}
