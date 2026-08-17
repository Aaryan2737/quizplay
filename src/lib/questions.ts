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
    question: 'Before Tony Stark upgraded to FRIDAY, what did the acronym for his original AI, J.A.R.V.I.S., stand for?',
    options: ['Just A Rather Very Intelligent System', 'Joint Artificial Rendering Virtual Interface System', 'Just A Really Vital Information System', 'Jarvis Artificial Reasoning Vision Intelligence System'],
    correctAnswerIndex: 0
  },
  {
    id: 2,
    type: 'mcq',
    question: 'In Spider-Man: Into the Spider-Verse, what is the actual name of the spectacular hero known as "Spider-Ham"?',
    options: ['Porky Parker', 'Peter Porker', 'Hammy Osborn', 'Miles Meatballs'],
    correctAnswerIndex: 1
  },
  {
    id: 3,
    type: 'mcq',
    question: "Captain America’s shield is made of Vibranium, but what virtually indestructible metal is laced onto Wolverine's skeleton?",
    options: ['Uru', 'Carbonadium', 'Adamantium', 'Promethium'],
    correctAnswerIndex: 2
  },
  {
    id: 4,
    type: 'mcq',
    question: "In the famous post-credits scene of 2012's The Avengers, what food does the exhausted team sit in silence and eat after saving New York?",
    options: ['Tacos', 'Shawarma', 'Pizza', 'Cheeseburgers'],
    correctAnswerIndex: 1
  },
  {
    id: 5,
    type: 'mcq',
    question: 'The late, great Stan Lee made cameos in almost every Marvel movie. In which film did he make his final, posthumous MCU cameo?',
    options: ['Spider-Man: Far From Home', 'Avengers: Endgame', 'Captain Marvel', 'Black Panther'],
    correctAnswerIndex: 1
  },
  {
    id: 6,
    type: 'mcq',
    question: 'To acquire the Soul Stone, Thanos had to travel to the planet Vormir. Who was the cursed keeper of the stone on that planet?',
    options: ['The Collector', 'Hela', 'Red Skull', 'Ronan the Accuser'],
    correctAnswerIndex: 2
  },
  {
    id: 7,
    type: 'mcq',
    question: 'Before he picked up the shield to play Captain America, Chris Evans played which other hot-headed Marvel superhero?',
    options: ['Ghost Rider', 'Cyclops', 'Daredevil', 'Human Torch'],
    correctAnswerIndex: 3
  },
  {
    id: 8,
    type: 'mcq',
    question: 'Who is the archenemy of the Fantastic Four, known for his metal mask, genius intellect, and mastery of both science and magic?',
    options: ['Magneto', 'Doctor Doom', 'Kang the Conqueror', 'Galactus'],
    correctAnswerIndex: 1
  },
  {
    id: 9,
    type: 'mcq',
    question: 'What is the name of the ancient artifact that Doctor Strange wears around his neck, which originally housed the Time Stone?',
    options: ['The Eye of Agamotto', 'The Wand of Watoomb', 'The Cloak of Levitation', 'The Darkhold'],
    correctAnswerIndex: 0
  },
  {
    id: 10,
    type: 'mcq',
    question: "What is the name of the highly advanced, hidden African nation ruled by King T'Challa?",
    options: ['Sokovia', 'Genosha', 'Wakanda', 'Madripoor'],
    correctAnswerIndex: 2
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
