export type QuestionType = 'mcq' | 'text';

export type Question = {
  id: number;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswerIndex?: number;
};

export const questions: Question[] = [
  {
    id: 1,
    type: 'mcq',
    question: 'Level 1: "I am Iron Man" is the iconic final line spoken by Tony Stark in the 2008 film Iron Man and which 2019 film?',
    options: ['Avengers: Infinity War', 'Avengers: Endgame', 'Spider-Man: Far From Home', 'The Avengers'],
    correctAnswerIndex: 1
  },
  {
    id: 2,
    type: 'mcq',
    question: 'Level 2: What is the name of Thor\'s original enchanted hammer?',
    options: ['Stormbreaker', 'Mjolnir', 'Gungnir', 'Hofund'],
    correctAnswerIndex: 1
  },
  {
    id: 3,
    type: 'mcq',
    question: 'Level 3: In Guardians of the Galaxy (Phase 2), what is the name of the desolate planet where Peter Quill discovers the orb containing the Power Stone?',
    options: ['Xandar', 'Knowhere', 'Morag', 'Sakaar'],
    correctAnswerIndex: 2
  },
  {
    id: 4,
    type: 'mcq',
    question: 'Level 4: In Captain America: Civil War, who is revealed to be directly responsible for the assassination of Tony Stark\'s parents?',
    options: ['Helmut Zemo', 'The Winter Soldier (Bucky Barnes)', 'Crossbones', 'The Red Skull'],
    correctAnswerIndex: 1
  },
  {
    id: 5,
    type: 'mcq',
    question: 'Level 5: What specific alien species is Groot, the sentient tree-like creature?',
    options: ['Flora colossus', 'Kree', 'Korbinite', 'Sovereign'],
    correctAnswerIndex: 0
  },
  {
    id: 6,
    type: 'mcq',
    question: 'Level 6: Kicking off the Multiverse Saga (Phase 4), what does the acronym TVA stand for in the Loki series?',
    options: ['Time Variance Authority', 'Temporal Violation Agency', 'Time Vector Administration', 'Temporal Variance Authority'],
    correctAnswerIndex: 0
  },
  {
    id: 7,
    type: 'mcq',
    question: 'Level 7: In Spider-Man: No Way Home, what is the exact name of the spell Doctor Strange uses that goes wrong and cracks the multiverse?',
    options: ['The Runes of Kof-Kol', 'The Crimson Bands of Cyttorak', 'The Hoary Hosts of Hoggoth', 'The Winds of Watoomb'],
    correctAnswerIndex: 0
  },
  {
    id: 8,
    type: 'mcq',
    question: 'Level 8: In Shang-Chi and the Legend of the Ten Rings, what is the name of the mythical village Shang-Chi must protect?',
    options: ['K\'un-Lun', 'Ta Lo', 'Kamar-Taj', 'Madripoor'],
    correctAnswerIndex: 1
  },
  {
    id: 9,
    type: 'mcq',
    question: 'Level 9: In Ant-Man and the Wasp: Quantumania (Phase 5), which specific Kang variant rules the Quantum Realm after being exiled?',
    options: ['He Who Remains', 'Immortus', 'Kang the Conqueror', 'Rama-Tut'],
    correctAnswerIndex: 2
  },
  {
    id: 10,
    type: 'text',
    question: 'Level 10 (Tie-Breaker): If you could use the Time Stone to change one major event in the MCU timeline across any saga, what would it be and how would it alter the Multiverse? (Be creative!)',
  }
];

export const getClientQuestion = (index: number) => {
  const q = questions[index];
  if (!q) return null;
  return {
    id: q.id,
    type: q.type,
    question: q.question,
    options: q.options,
  };
};
