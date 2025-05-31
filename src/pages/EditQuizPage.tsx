import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../components/layouts/AppLayout';
import QuizForm from '../components/quiz/QuizForm';
import { Quiz } from '../types';
import { useQuiz } from '../contexts/QuizContext';
import { useAuth } from '../contexts/AuthContext';

const EditQuizPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const { getQuizById, updateQuiz } = useQuiz();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (quizId) {
      const foundQuiz = getQuizById(quizId);
      
      if (!foundQuiz) {
        setError('Quiz not found');
        return;
      }
      
      if (foundQuiz.createdBy !== currentUser?.id) {
        setError('You do not have permission to edit this quiz');
        return;
      }
      
      setQuiz(foundQuiz);
    }
  }, [quizId, currentUser]);
  
  const handlePublishQuiz = () => {
    if (quiz) {
      const updatedQuiz = { ...quiz, isPublished: true };
      updateQuiz(updatedQuiz);
      navigate('/my-quizzes');
    }
  };
  
  if (error) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{error}</h1>
          <button
            onClick={() => navigate('/my-quizzes')}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Back to My Quizzes
          </button>
        </div>
      </AppLayout>
    );
  }
  
  if (!quiz) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <p>Loading quiz...</p>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Edit Quiz</h1>
          {!quiz.isPublished && (
            <button
              onClick={handlePublishQuiz}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Publish Quiz
            </button>
          )}
        </div>
        
        <QuizForm initialQuiz={quiz} />
      </div>
    </AppLayout>
  );
};

export default EditQuizPage;