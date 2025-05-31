import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import AppLayout from '../components/layouts/AppLayout';
import Button from '../components/ui/Button';
import QuizList from '../components/quiz/QuizList';
import { useAuth } from '../contexts/AuthContext';
import { useQuiz } from '../contexts/QuizContext';

const MyQuizzesPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { quizzes } = useQuiz();
  const navigate = useNavigate();
  
  // Filter quizzes created by the current user
  const myQuizzes = quizzes.filter(quiz => quiz.createdBy === currentUser?.id);
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Quizzes</h1>
          <Button onClick={() => navigate('/quiz/create')}>
            <Plus size={16} className="mr-2" /> Create Quiz
          </Button>
        </div>
        
        <QuizList 
          quizzes={myQuizzes}
          emptyMessage="You haven't created any quizzes yet."
          showCategory={true}
        />
      </div>
    </AppLayout>
  );
};

export default MyQuizzesPage;