/** Presentation-only lore. Character codes and the v1 scoring contract stay stable. */
export const CHARACTER_STORIES: Record<
  string,
  { artAlt: string; entrance: string; coldOpen: string; prop: string }
> = {
  '0000': {
    artAlt:
      'A kind lavender mug in a yellow scarf offering a spare cup of tea.',
    entrance: 'Already on the sofa. Somehow knows everything.',
    coldOpen:
      'The dinner is canceled. You quietly produce soup for six. Nobody asks how you knew. You do not explain the soup.',
    prop: 'The emergency biscuit',
  },
  '0001': {
    artAlt:
      'A dreamy crescent moon in a director’s beret carrying a blank clapperboard.',
    entrance: 'Has mentally scored this conversation.',
    coldOpen:
      'Everyone is looking for a restaurant. You notice the rain on the window and pitch a film about missed connections. Someone asks if the film has dinner in it.',
    prop: 'An unfinished screenplay',
  },
  '0010': {
    artAlt: 'A mint heart-shaped backpack offering a spare packet of snacks.',
    entrance: 'Brought a spare. Of the spare.',
    coldOpen:
      'You claim you are only here because the route was efficient. Then you unpack everyone’s favorite snacks, a charger, and a birthday candle. Nobody’s birthday is today. You like coverage.',
    prop: 'The suspiciously complete bag',
  },
  '0011': {
    artAlt:
      'A thoughtful lavender book with bookmark tabs preserving a tiny dried flower.',
    entrance: 'Remembers the original version of this story.',
    coldOpen:
      'Someone says this is the worst dinner plan ever. You open the 2019 archive. There are screenshots. A timeline. A photo of a very apologetic raccoon.',
    prop: 'The receipts, alphabetized',
  },
  '0100': {
    artAlt:
      'A skeptical mint magnifying glass detective holding an evidence envelope.',
    entrance: 'One raised eyebrow. Three solved mysteries.',
    coldOpen:
      'The host insists they booked a table. You look at the confirmation. Then at the host. “Fascinating. Do we normally eat on Tuesdays in another city?”',
    prop: 'One devastating observation',
  },
  '0101': {
    artAlt:
      'A curious lavender rabbit inspecting a fan of colorful blank browser tabs.',
    entrance: 'Just needs to check one tiny thing.',
    coldOpen:
      'You search “restaurants near me.” Twenty minutes later you know why menus use that font, who invented the fork, and nothing about where you are eating.',
    prop: 'Tab number forty-seven',
  },
  '0110': {
    artAlt:
      'A composed mint calculator with a button grid holding a small orange ruler.',
    entrance: 'Has a formula for this exact emergency.',
    coldOpen:
      'The reservation vanishes. You open a sheet called Dinner_FINAL_v6. There are three backups, dietary filters, and a tab nobody is emotionally ready to discuss.',
    prop: 'Dinner_FINAL_v6',
  },
  '0111': {
    artAlt:
      'A strategic mint chess knight carrying a rolled plan and tiny yellow pawn.',
    entrance: 'Knew this would happen. On Wednesday.',
    coldOpen:
      'While the room debates dinner, you casually reveal a second reservation. Asked when you made it, you say “before we chose the first restaurant.” Everyone sits down.',
    prop: 'The backup to the backup',
  },
  '1000': {
    artAlt:
      'An exuberant orange party popper with colorful confetti and a yellow balloon.',
    entrance: 'Treats arriving as an event worth celebrating.',
    coldOpen:
      'Dinner falls through. You propose celebrating the exciting opportunity to eat somewhere else. Somehow there is a toast. Nobody has a glass yet.',
    prop: 'Confetti of unclear origin',
  },
  '1001': {
    artAlt:
      'A mischievous orange imp with a curling tail and mint paper airplane.',
    entrance: '“Hear me out” has entered the chat.',
    coldOpen:
      'You spot a karaoke bar across the street. “Technically, crisps are dinner.” Forty minutes later, the quiet friend is doing a duet with the owner.',
    prop: 'An idea with no risk assessment',
  },
  '1010': {
    artAlt:
      'A caring mint teapot in a yellow apron carrying a sandwich and a drink.',
    entrance: 'Has everyone eaten? No? Sit down.',
    coldOpen:
      'You count heads, distribute snacks, and send a location pin. You then realize you have adopted two people who were just waiting for a bus.',
    prop: 'Water. More water.',
  },
  '1011': {
    artAlt:
      'An encouraging orange megaphone giving a thumbs-up and carrying a rolled blueprint.',
    entrance: 'Believes in your side project more than you do.',
    coldOpen:
      'A friend mentions a vague dream of opening a café. By dessert, you have named it, found three volunteers, and delivered a toast they may use in a funding round.',
    prop: 'A dangerously convincing pep talk',
  },
  '1100': {
    artAlt:
      'A bold orange matchstick in a running pose holding a folded route map.',
    entrance: 'Already pressed the button labeled “don’t.”',
    coldOpen:
      'The restaurant says there is a two-hour wait. You say “new plan” and start walking. Six people follow. You decide where you are going at the next crossing.',
    prop: 'Confidence, currently unsupervised',
  },
  '1101': {
    artAlt:
      'A witty orange atom with orbiting electrons holding a mint laboratory flask.',
    entrance: 'Has a counterpoint. Of course they do.',
    coldOpen:
      'You ask whether reservations are just a social construct. The host says yes, and so is the queue, which you are now at the back of.',
    prop: 'One deeply unnecessary counterpoint',
  },
  '1110': {
    artAlt:
      'A decisive mint clipboard with check marks, a stopwatch, and an orange pencil.',
    entrance: 'Somehow gave everyone a job title.',
    coldOpen:
      'You assign one person to call, one to navigate, and one to manage morale. You have turned finding tacos into a production. Against all odds, you finish under budget.',
    prop: 'The call sheet',
  },
  '1111': {
    artAlt:
      'A crowned orange star in a mint tie pointing forward with a rolled vision plan.',
    entrance: 'Sees a crisis. Calls it a pilot program.',
    coldOpen:
      'The booking falls through. You suggest acquiring the restaurant. Everyone laughs. You have already opened a notes app titled “Hospitality: a thesis.”',
    prop: 'A wildly premature pitch deck',
  },
};
export const characterArtPath = (code: string) => `/characters/${code}.webp`;

export const EPISODE_ARCS = {
  pilot: [
    {
      title: 'Meet the main character',
      note: 'A quiet group chat. Suspicious. Let’s establish your usual level of involvement.',
    },
    {
      title: 'Complicate everything',
      note: 'The cast gets bigger. The plans get worse. Your instincts get a speaking part.',
    },
    {
      title: 'Earn the closing credits',
      note: 'Good news, missing oat milk, a lost reservation. An extremely normal finale.',
    },
  ],
  office: [
    {
      title: 'Join the meeting',
      note: 'The camera is on. The agenda is theoretical. What kind of colleague walks in?',
    },
    {
      title: 'Move the deadline',
      note: 'An offsite, a missed handoff, a rushed launch. The calendar has chosen violence.',
    },
    {
      title: 'Ship the season finale',
      note: 'Take the stage, make the call, define a good week. Then please log off.',
    },
  ],
  friends: [
    {
      title: 'Open the group chat',
      note: 'One voice note. Several questionable plans. A cast with absolutely no mute button.',
    },
    {
      title: 'Add three extra people',
      note: 'Plans cancel. Friends disagree. Somehow you are catering. Friendship has range.',
    },
    {
      title: 'Keep the good ones',
      note: 'New faces, big decisions, old rituals. The real plot was the people who stayed.',
    },
  ],
} as const;
