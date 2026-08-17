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
    question: 'The guy who created Linux (the operating system running most of the internet) also created Git and GitHub to help developers collaborate. Who is he?',
    options: [
      'Bill Gates',
      'Linus Torvalds',
      'Steve Jobs',
      'Mark Zuckerberg'
    ],
    correctAnswerIndex: 1
  },
  {
    id: 2,
    type: 'mcq',
    question: 'You are pulling an all-nighter to finish an assignment. The classic developer fuel is coffee. Which programming language is famously named after an island known for its coffee?',
    options: ['Mocha', 'Python', 'Java', 'Espresso'],
    correctAnswerIndex: 2
  },
  {
    id: 3,
    type: 'mcq',
    question: 'When the college WiFi unexpectedly drops 5 minutes before your submission deadline, which 8-bit hero usually appears on your Chrome browser to save you from boredom?',
    options: ['Mario', 'Sonic', 'T-Rex', 'Pac-Man'],
    correctAnswerIndex: 2
  },
  {
    id: 4,
    type: 'mcq',
    question: 'In July 2024, a massive global IT outage caused millions of Windows computers to show a "Blue Screen of Death", grounding flights and stopping banks. Which cybersecurity company\'s update was responsible?',
    options: ['Norton', 'McAfee', 'CrowdStrike', 'Kaspersky'],
    correctAnswerIndex: 2
  },
  {
    id: 5,
    type: 'mcq',
    question: 'The term "Computer Bug" was popularized when a real insect was found stuck inside an early electromechanical computer (the Harvard Mark II) in 1947. Which insect was it?',
    options: ['A spider', 'A moth', 'A cockroach', 'A beetle'],
    correctAnswerIndex: 1
  },
  {
    id: 6,
    type: 'mcq',
    question: 'Two famous tech billionaires recently made headlines by agreeing to a literal physical "cage match" (though it hasn\'t happened yet). Who were they?',
    options: ['Jeff Bezos & Bill Gates', 'Elon Musk & Mark Zuckerberg', 'Tim Cook & Sundar Pichai', 'Sam Altman & Elon Musk'],
    correctAnswerIndex: 1
  },
  {
    id: 7,
    type: 'mcq',
    question: 'You finally write a piece of code that works, push it to GitHub, and your senior replies with "LGTM". What does this stand for in developer culture?',
    options: ['Let\'s Go To Meetings', 'Looks Good To Me', 'Little Glitches, Too Many', 'Leave GitHub To Me'],
    correctAnswerIndex: 1
  },
  {
    id: 8,
    type: 'mcq',
    question: 'Which of these is the most used password in the world (and definitely the one you shouldn\'t use for your college portal)?',
    options: ['password', '123456', 'qwerty', 'admin123'],
    correctAnswerIndex: 1
  },
  {
    id: 9,
    type: 'mcq',
    question: 'Which AI tool, launched in late 2022 by OpenAI, became the fastest-growing consumer application in history and every college student\'s best friend?',
    options: ['Midjourney', 'GitHub Copilot', 'ChatGPT', 'Claude'],
    correctAnswerIndex: 2
  },
  {
    id: 10,
    type: 'text',
    question: 'If you had an unlimited budget to build a tech startup or app specifically to help freshers survive their first year of college, what would it do? (Explain briefly in 1-2 sentences).',
    options: []
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
