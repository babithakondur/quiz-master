import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, BookOpen, CheckCircle, Clock, Plus, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useQuiz } from '../contexts/QuizContext';
import AppLayout from '../components/layouts/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import QuizList from '../components/quiz/QuizList';

const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { quizzes, quizAttempts, getQuizAttemptsByUser } = useQuiz();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalAttempts: 0,
    completedQuizzes: 0,
    averageScore: 0,
    quizzesCreated: 0,
  });
  
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [myQuizzes, setMyQuizzes] = useState([]);
  
  useEffect(() => {
    if (currentUser) {
      const userAttempts = getQuizAttemptsByUser(currentUser.id);
      const completedAttempts = userAttempts.filter(a => a.completedAt);
      const totalScore = completedAttempts.reduce((sum, a) => sum + (a.score || 0), 0);
      const averageScore = completedAttempts.length > 0 
        ? Math.round(totalScore / completedAttempts.length) 
        : 0;
        
      const createdQuizzes = quizzes.filter(q => q.createdBy === currentUser.id);
      
      setStats({
        totalAttempts: userAttempts.length,
        completedQuizzes: completedAttempts.length,
        averageScore,
        quizzesCreated: createdQuizzes.length,
      });
      
      // Get recent quizzes (limit to 3)
      const sortedQuizzes = [...quizzes]
        .filter(q => q.isPublished)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3);
      
      setRecentQuizzes(sortedQuizzes);
      
      // Get user's quizzes (limit to 3)
      const userQuizzes = createdQuizzes.slice(0, 3);
      setMyQuizzes(userQuizzes);
    }
  }, [currentUser, quizzes, quizAttempts]);
  
  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <Button onClick={() => navigate('/quiz/create')}>
            <Plus size={16} className="mr-2" /> Create Quiz
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Attempts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-indigo-500 mr-3" />
                <span className="text-3xl font-bold">{stats.totalAttempts}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Completed Quizzes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-teal-500 mr-3" />
                <span className="text-3xl font-bold">{stats.completedQuizzes}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Award className="h-8 w-8 text-amber-500 mr-3" />
                <span className="text-3xl font-bold">{stats.averageScore}%</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Quizzes Created</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-indigo-500 mr-3" />
                <span className="text-3xl font-bold">{stats.quizzesCreated}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Quizzes</h2>
              <Button variant="link" onClick={() => navigate('/quizzes')}>
                View All
              </Button>
            </div>
            
            {recentQuizzes.length > 0 ? (
              <div className="space-y-4">
                {recentQuizzes.map(quiz => (
                  <Card key={quiz.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="p-4">
                      <div className="flex justify-between">
                        <div>
                          <CardTitle className="text-lg">{quiz.title}</CardTitle>
                          <p className="text-sm text-gray-500 mt-1">{quiz.description}</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => navigate(`/quiz/${quiz.id}`)}
                        >
                          Take Quiz
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-6">
                  <p className="text-gray-500">No quizzes available yet.</p>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">My Quizzes</h2>
              <Button variant="link" onClick={() => navigate('/my-quizzes')}>
                View All
              </Button>
            </div>
            
            {myQuizzes.length > 0 ? (
              <div className="space-y-4">
                {myQuizzes.map(quiz => (
                  <Card key={quiz.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="p-4">
                      <div className="flex justify-between">
                        <div>
                          <CardTitle className="text-lg">{quiz.title}</CardTitle>
                          <p className="text-sm text-gray-500 mt-1">
                            {quiz.isPublished ? 'Published' : 'Draft'}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/quiz/${quiz.id}/edit`)}
                        >
                          Edit
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-6">
                  <p className="text-gray-500">You haven't created any quizzes yet.</p>
                  <Button
                    className="mt-4"
                    onClick={() => navigate('/quiz/create')}
                  >
                    Create Your First Quiz
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;