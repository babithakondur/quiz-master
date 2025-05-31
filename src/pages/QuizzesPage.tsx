import React from 'react';
import AppLayout from '../components/layouts/AppLayout';
import QuizList from '../components/quiz/QuizList';
import { useQuiz } from '../contexts/QuizContext';

const QuizzesPage: React.FC = () => {
  const { quizzes } = useQuiz();
  
  // Only show published quizzes
  const publishedQuizzes = quizzes.filter(quiz => quiz.isPublished);
  
  return (
    <AppLayout>
      <QuizList 
        title="Available Quizzes" 
        quizzes={publishedQuizzes}
        emptyMessage="No quizzes available. Check back later!" 
      />
    </AppLayout>
  );
};

export default QuizzesPage;