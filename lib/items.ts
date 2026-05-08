import type { Item } from './types';

export type SeedItem = Omit<Item, 'id'>;

export const SEED_ITEMS: SeedItem[] = [
  // SNACK (2–5 min)
  { tier: 'snack', text: 'Step outside and look at the sky',                  desc: 'just sixty seconds, no phone',           cats: ['movement','rest'],  modes: ['any','morning','fried','bedtime'] },
  { tier: 'snack', text: 'Three slow breaths with eyes closed',                desc: 'in for four, out for six',               cats: ['rest'],             modes: ['any','morning','fried','bedtime'] },
  { tier: 'snack', text: 'Doodle in the margin of a notebook',                 desc: 'no goal, no judgment',                   cats: ['creative'],         modes: ['any','fried'] },
  { tier: 'snack', text: 'Drink a glass of water slowly',                      desc: 'pay attention to it',                    cats: ['rest'],             modes: ['any','morning','fried','bedtime'] },
  { tier: 'snack', text: 'Open a window, listen for one minute',               desc: 'whatever is out there',                  cats: ['rest'],             modes: ['any','morning','bedtime'] },
  { tier: 'snack', text: 'Tidy one surface',                                   desc: 'desk, nightstand, anything',             cats: ['hands'],            modes: ['any','fried'] },
  { tier: 'snack', text: 'Stretch arms overhead, roll shoulders',              desc: 'release the commute',                    cats: ['movement'],         modes: ['any','morning','fried'] },
  { tier: 'snack', text: 'Write down one thing you noticed today',             desc: 'a single sentence is enough',            cats: ['creative'],         modes: ['any','bedtime'] },
  { tier: 'snack', text: 'Splash cold water on your face',                     desc: 'reset',                                  cats: ['rest'],             modes: ['any','morning','fried'] },
  { tier: 'snack', text: 'Stand by a window for the length of one song',       desc: 'no scrolling, just looking',             cats: ['rest'],             modes: ['any','fried'] },

  // SMALL (10–20 min)
  { tier: 'small', text: 'Walk around the block',                              desc: 'no podcast, no audiobook',               cats: ['movement'],         modes: ['any','morning','fried'] },
  { tier: 'small', text: 'Read ten pages of a paper book',                     desc: 'fiction counts, especially fiction',     cats: ['reading'],          modes: ['any','bedtime'] },
  { tier: 'small', text: 'Sketch something in front of you',                   desc: 'a mug, your hand, the window',           cats: ['creative'],         modes: ['any','fried'] },
  { tier: 'small', text: 'Lie on the floor, listen to one full album',         desc: 'no other input',                         cats: ['rest'],             modes: ['any','fried','bedtime'] },
  { tier: 'small', text: 'Make a real snack from real food',                   desc: 'fruit, toast, anything assembled',       cats: ['hands'],            modes: ['any','fried'] },
  { tier: 'small', text: 'Stretch routine on the floor',                       desc: 'fifteen minutes is enough',              cats: ['movement','rest'],  modes: ['any','morning','bedtime'] },
  { tier: 'small', text: 'Sit on the porch with no phone',                     desc: 'bring water, sit, wait',                 cats: ['rest'],             modes: ['any','fried'] },
  { tier: 'small', text: 'Write a paragraph in a journal',                     desc: 'about anything, even nothing',           cats: ['creative'],         modes: ['any','bedtime'] },
  { tier: 'small', text: 'Organize one drawer or shelf',                       desc: 'small win, real satisfaction',           cats: ['hands'],            modes: ['any','fried'] },
  { tier: 'small', text: 'Call a grandparent or relative',                     desc: 'they will love it',                      cats: ['social'],           modes: ['any'] },
  { tier: 'small', text: 'Watch the sun set without filming it',               desc: 'this one is harder than it sounds',      cats: ['rest'],             modes: ['any','bedtime'] },

  // MEDIUM (30–60 min)
  { tier: 'medium', text: 'Long walk with no destination',                     desc: 'wander, get a little lost',              cats: ['movement'],         modes: ['any'] },
  { tier: 'medium', text: 'Cook a real meal from scratch',                     desc: 'something with actual chopping',         cats: ['hands'],            modes: ['any'] },
  { tier: 'medium', text: 'Read a book for forty-five minutes',                desc: 'paper, not a screen',                    cats: ['reading'],          modes: ['any','bedtime'] },
  { tier: 'medium', text: 'Draw or paint something for the joy of it',         desc: 'no posting, no sharing',                 cats: ['creative'],         modes: ['any'] },
  { tier: 'medium', text: 'Bake something',                                    desc: 'cookies, banana bread, anything',        cats: ['hands'],            modes: ['any'] },
  { tier: 'medium', text: 'Real conversation with a family member',            desc: 'sit down, no phone in sight',            cats: ['social'],           modes: ['any'] },
  { tier: 'medium', text: 'Workout or yoga session',                           desc: 'move until your brain quiets',           cats: ['movement'],         modes: ['any','morning'] },
  { tier: 'medium', text: 'Write a letter to a friend',                        desc: 'pen and paper, mail it',                 cats: ['creative','social'], modes: ['any'] },
  { tier: 'medium', text: 'Walk in a park with a notebook',                    desc: 'note three things you see',              cats: ['movement','creative'], modes: ['any'] },
  { tier: 'medium', text: 'Try a new recipe',                                  desc: 'something you have never made',          cats: ['hands'],            modes: ['any'] },
  { tier: 'medium', text: 'Listen to a record, lying down',                    desc: 'eyes closed, no other inputs',           cats: ['rest'],             modes: ['any','bedtime'] },

  // FEAST (1+ hours)
  { tier: 'feast', text: 'Hike somewhere with elevation',                      desc: 'view, sweat, time outside',              cats: ['movement'],         modes: ['any'] },
  { tier: 'feast', text: 'Hang out with a friend in person',                   desc: 'leave both phones in pockets',           cats: ['social'],           modes: ['any'] },
  { tier: 'feast', text: 'Big creative project session',                       desc: 'paint, write, build, three hours',       cats: ['creative'],         modes: ['any'] },
  { tier: 'feast', text: 'Cook an elaborate meal for the family',              desc: 'something that takes real time',         cats: ['hands','social'],   modes: ['any'] },
  { tier: 'feast', text: 'Day trip somewhere new',                             desc: 'museum, town, trail, anywhere',          cats: ['movement','social'], modes: ['any'] },
  { tier: 'feast', text: 'Read a whole short book in one sitting',             desc: 'novella, poetry, essays',                cats: ['reading'],          modes: ['any'] },
  { tier: 'feast', text: 'Movie night with family, no second screen',          desc: 'phones in the kitchen',                  cats: ['social','rest'],    modes: ['any'] },
  { tier: 'feast', text: 'Big organizing project',                             desc: 'closet, room, bookshelf',                cats: ['hands'],            modes: ['any'] },
];
