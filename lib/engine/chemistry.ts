import { getCharacter } from '../content/characters';
export function compareCharacters(left: string, right: string) {
  const a = getCharacter(left),
    b = getCharacter(right);
  const shared = Array.from(left).filter((v, i) => v === right[i]).length;
  const differences = 4 - shared;
  const titles = [
    'The alternate-universe twins',
    'The comfortable double act',
    'The perfectly odd couple',
    'The unexpected crossover',
    'The opposites-attract episode',
  ];
  const premises = [
    'You finish each other’s sentences. Unfortunately, you also enable each other’s exact same nonsense.',
    'Enough common ground to feel at home. Just enough difference to keep the episode interesting.',
    'Two shared instincts. Two recurring debates. This show has range.',
    'Nobody understands how this friendship works. That is half the appeal.',
    'Different approaches to almost everything. The writers are working overtime.',
  ];
  const tips = [
    left[0] === right[0]
      ? 'You tend to set a similar social pace. Check that neither of you is just going along.'
      : 'One of you may want an audience while the other wants a breather. Make space for both.',
    left[1] === right[1]
      ? 'You often start decisions from the same place. Invite a different perspective when you get stuck.'
      : 'Try asking “comfort or solutions?” before offering your version of help.',
    left[2] === right[2]
      ? 'Your planning rhythms line up. Remember to question the plan—or make one—when needed.'
      : 'Agree on the non-negotiables, then leave the rest open to improvisation.',
    left[3] === right[3]
      ? 'You notice similar things. Ask what the other might be overlooking.'
      : 'Connect the big idea to one thing you can do together today.',
  ];
  return {
    left: a,
    right: b,
    shared,
    differences,
    title: titles[differences],
    premise: premises[differences],
    tips,
  };
}
