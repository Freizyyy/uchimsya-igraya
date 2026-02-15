
export enum Section {
  THEORY = 'theory',
  MNEMONICS = 'mnemonics',
  PRACTICE = 'practice',
  ARENA = 'arena',
  FINAL_TEST = 'final_test',
  HOME = 'home'
}

export interface MiniQuiz {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface CheckingWordExercise {
  word: string;
  answer: string;
  hint: string;
}

export interface Orphogram {
  id: string;
  title: string;
  content: string;
  examples: string[];
  miniQuiz?: MiniQuiz;
  checkingWordExercises?: CheckingWordExercise[];
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Mnemonic {
  id: string;
  title: string;
  poem: string;
  quiz?: MiniQuiz;
}

export interface ArenaTask {
  id: string;
  sentence: string;
  errorWord: string;
  correctWord: string;
  hint: string;
}