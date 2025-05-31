import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Calendar, Edit, Trash2 } from 'lucide-react';
import AppLayout from '../components/layouts/AppLayout';
import Button from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useQuiz } from '../contexts/QuizContext';
import { useAuth } from '../contexts/AuthContext';
import { Quiz } from '../types';

const QuizDetailsPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const { getQuizById, deleteQuiz, getCategoryById, getQuizAttemptsByQuiz } = useQuiz();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  
  useEffect(() => {
    if (quizId) {
      const foundQuiz = getQuizById(quizId);
      
      if (foundQuiz) {
        setQuiz(foundQuiz);
        setIsOwner(foundQuiz.createdBy === currentUser?.id);
      } else {
        navigate('/quizzes');
      }
    }
  }, [quizId, currentUser]);
  
  const handleDeleteQuiz = () => {
    if (quiz && isOwner) {
      if (confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
        deleteQuiz(quiz.id);
        navigate('/my-quizzes');
      }
    }
  };
  
  if (!quiz) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <p>Loading quiz details...</p>
        </div>
      </AppLayout>
    );
  }
  
  const category = getCategoryById(quiz.category);
  const attempts = getQuizAttemptsByQuiz(quiz.id);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} className="mr-1" /> Back
        </button>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
                <p className="text-gray-600 mt-1">{quiz.description}</p>
              </div>
              
              {isOwner && (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/quiz/${quiz.id}/edit`)}
                  >
                    <Edit size={16} className="mr-1" /> Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleDeleteQuiz}
                  >
                    <Trash2 size={16} className="mr-1" /> Delete
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center text-gray-600">
                <Clock size={16} className="mr-2" />
                <span>{quiz.timeLimit} minutes</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <Users size={16} className="mr-2" />
                <span>{quiz.questions.length} questions</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <Calendar size={16} className="mr-2" />
                <span>Created on {formatDate(quiz.createdAt)}</span>
              </div>
              
              {category && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {category.name}
                </span>
              )}
              
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                quiz.isPublished 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {quiz.isPublished ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>
          
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quiz Overview</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Total Attempts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-3xl font-bold">{attempts.length}</span>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Average Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-3xl font-bold">
                      {attempts.length > 0
                        ? Math.round(
                            attempts.reduce((sum, a) => sum + (a.score || 0), 0) / attempts.length
                          )
                        : 0}%
                    </span>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Completion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-3xl font-bold">
                      {attempts.length > 0
                        ? Math.round(
                            (attempts.filter(a => a.completedAt).length / attempts.length) * 100
                          )
                        : 0}%
                    </span>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Questions Preview</h3>
                
                <div className="space-y-4">
                  {quiz.questions.map((question, index) => (
                    <div key={question.id} className="bg-gray-50 p-4 rounded-md">
                      <p className="font-medium text-gray-900">
                        {index + 1}. {question.text}
                      </p>
                      <div className="mt-2 space-y-1">
                        {question.options.map(option => (
                          <div key={option.id} className="flex items-center">
                            <div className={`w-4 h-4 rounded-full mr-2 ${
                              option.id === question.correctOptionId 
                                ? 'bg-green-500' 
                                : 'bg-gray-300'
                            }`}></div>
                            <span className={`${
                              option.id === question.correctOptionId 
                                ? 'text-green-700 font-medium' 
                                : 'text-gray-700'
                            }`}>
                              {option.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <Button
              onClick={() => navigate(`/quiz/${quiz.id}`)}
              className="w-full sm:w-auto"
            >
              Take Quiz
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default QuizDetailsPage;