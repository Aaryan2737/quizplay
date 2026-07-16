export type QuestionType = 'mcq' | 'text';

export type Question = {
  id: number;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswerIndex?: number;
};

export const questions: Question[] = [
  // 5 IEEE trivia questions
  {
    id: 1,
    type: 'mcq',
    question: 'What does IEEE stand for?',
    options: [
      'Institute of Electrical and Electronics Engineers',
      'International Electrical and Electronic Enterprises',
      'Institute of Electronic and Electrical Engineers',
      'International Engineering and Electronic Engineers'
    ],
    correctAnswerIndex: 0
  },
  {
    id: 2,
    type: 'mcq',
    question: 'In what year was IEEE originally founded?',
    options: ['1884', '1912', '1947', '1963'],
    correctAnswerIndex: 3 // AIEE in 1884, IRE in 1912, merged in 1963 to form IEEE
  },
  {
    id: 3,
    type: 'mcq',
    question: 'Which of the following is NOT an IEEE standard?',
    options: ['802.11 (Wi-Fi)', '802.3 (Ethernet)', '1394 (FireWire)', 'HTML5'],
    correctAnswerIndex: 3
  },
  {
    id: 4,
    type: 'mcq',
    question: 'Where is the IEEE corporate headquarters located?',
    options: [
      'New York City, New York',
      'Piscataway, New Jersey',
      'San Jose, California',
      'Boston, Massachusetts'
    ],
    correctAnswerIndex: 0
  },
  {
    id: 5,
    type: 'mcq',
    question: 'What is the highest grade of IEEE membership?',
    options: ['Senior Member', 'Fellow', 'Life Member', 'Honorary Member'],
    correctAnswerIndex: 1
  },
  // 4 FIFA World Cup 2026 trivia questions
  {
    id: 6,
    type: 'mcq',
    question: 'Modern FIFA World Cup stadiums rely on high-speed wireless networks so tens of thousands of fans can share photos and videos at the exact same time. Which famous wireless technology, built on the IEEE 802.11 standard, makes this possible?',
    options: ['Bluetooth', 'Wi-Fi', 'GPS', 'NFC'],
    correctAnswerIndex: 1
  },
  {
    id: 7,
    type: 'mcq',
    question: 'Recent World Cups use a high-tech "connected ball" containing a smart sensor to help referees make precise offside decisions. Which global engineering organization creates the technical standards that allow these sensors to transmit data reliably?',
    options: ['NASA', 'WHO', 'IEEE', 'IMF'],
    correctAnswerIndex: 2
  },
  {
    id: 8,
    type: 'mcq',
    question: 'Which of these cities is NOT hosting a 2026 World Cup match?',
    options: ['Toronto', 'Monterrey', 'Chicago', 'Los Angeles'],
    correctAnswerIndex: 2
  },
  {
    id: 9,
    type: 'mcq',
    question: 'Where is the 2026 FIFA World Cup final scheduled to be played?',
    options: [
      'MetLife Stadium, New Jersey',
      'Estadio Azteca, Mexico City',
      'SoFi Stadium, Los Angeles',
      'AT&T Stadium, Dallas'
    ],
    correctAnswerIndex: 0
  },
  // 1 Subjective Text Question
  {
    id: 10,
    type: 'text',
    question: 'If you get a chance to publish an IEEE conference paper in the domain of SDG (Sustainable Development Goals), what technical solution or topic would you propose? (Briefly explain in 1-2 sentences).',
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
