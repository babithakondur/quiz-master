import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Quiz, QuizAttempt, Question, Option, Category } from '../types';
import { getQuizzes, saveQuizzes, getQuizAttempts, saveQuizAttempts, getCategories } from '../utils/storage';

interface QuizContextType {
  quizzes: Quiz[];
  quizAttempts: QuizAttempt[];
  categories: Category[];
  getQuizById: (id: string) => Quiz | undefined;
  getQuizzesByCategory: (categoryId: string) => Quiz[];
  getQuizAttemptsByUser: (userId: string) => QuizAttempt[];
  getQuizAttemptsByQuiz: (quizId: string) => QuizAttempt[];
  createQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt'>) => Quiz;
  updateQuiz: (quiz: Quiz) => void;
  deleteQuiz: (id: string) => void;
  startQuizAttempt: (quizId: string, userId: string) => QuizAttempt;
  submitQuizAttempt: (attempt: QuizAttempt) => void;
  getCategoryById: (id: string) => Category | undefined;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setQuizzes(getQuizzes());
    setQuizAttempts(getQuizAttempts());
    setCategories(getCategories());
  }, []);

  const getQuizById = (id: string) => {
    return quizzes.find(quiz => quiz.id === id);
  };

  const getQuizzesByCategory = (categoryId: string) => {
    return quizzes.filter(quiz => quiz.category === categoryId);
  };

  const getQuizAttemptsByUser = (userId: string) => {
    return quizAttempts.filter(attempt => attempt.userId === userId);
  };

  const getQuizAttemptsByQuiz = (quizId: string) => {
    return quizAttempts.filter(attempt => attempt.quizId === quizId);
  };

  const createQuiz = (quizData: Omit<Quiz, 'id' | 'createdAt'>) => {
    const newQuiz: Quiz = {
      ...quizData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const updatedQuizzes = [...quizzes, newQuiz];
    setQuizzes(updatedQuizzes);
    saveQuizzes(updatedQuizzes);
    
    return newQuiz;
  };

  const updateQuiz = (updatedQuiz: Quiz) => {
    const updatedQuizzes = quizzes.map(quiz => 
      quiz.id === updatedQuiz.id ? updatedQuiz : quiz
    );
    
    setQuizzes(updatedQuizzes);
    saveQuizzes(updatedQuizzes);
  };

  const deleteQuiz = (id: string) => {
    const updatedQuizzes = quizzes.filter(quiz => quiz.id !== id);
    setQuizzes(updatedQuizzes);
    saveQuizzes(updatedQuizzes);
  };

  const startQuizAttempt = (quizId: string, userId: string) => {
    const newAttempt: QuizAttempt = {
      id: Date.now().toString(),
      quizId,
      userId,
      startedAt: new Date().toISOString(),
      answers: []
    };

    const updatedAttempts = [...quizAttempts, newAttempt];
    setQuizAttempts(updatedAttempts);
    saveQuizAttempts(updatedAttempts);
    
    return newAttempt;
  };

  const submitQuizAttempt = (attempt: QuizAttempt) => {
    const updatedAttempts = quizAttempts.map(a => 
      a.id === attempt.id ? attempt : a
    );
    
    setQuizAttempts(updatedAttempts);
    saveQuizAttempts(updatedAttempts);
  };

  const getCategoryById = (id: string) => {
    return categories.find(category => category.id === id);
  };

  return (
    <QuizContext.Provider value={{
      quizzes,
      quizAttempts,
      categories,
      getQuizById,
      getQuizzesByCategory,
      getQuizAttemptsByUser,
      getQuizAttemptsByQuiz,
      createQuiz,
      updateQuiz,
      deleteQuiz,
      startQuizAttempt,
      submitQuizAttempt,
      getCategoryById
    }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  
  return context;
};