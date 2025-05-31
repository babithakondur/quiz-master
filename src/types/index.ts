export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  avatarUrl?: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false';
  options: Option[];
  correctOptionId: string;
  explanation?: string;
}

export interface Option {
  id: string;
  text: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  timeLimit: number; // in minutes
  questions: Question[];
  createdBy: string; // user id
  createdAt: string;
  isPublished: boolean;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  startedAt: string;
  completedAt?: string;
  score?: number;
  answers: {
    questionId: string;
    selectedOptionId: string;
    isCorrect: boolean;
  }[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  iconName: string;
}