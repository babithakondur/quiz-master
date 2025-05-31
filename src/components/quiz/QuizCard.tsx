import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, CalendarDays } from 'lucide-react';
import { Quiz } from '../../types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import Button from '../ui/Button';
import { useQuiz } from '../../contexts/QuizContext';

interface QuizCardProps {
  quiz: Quiz;
  showTakeQuizButton?: boolean;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, showTakeQuizButton = true }) => {
  const navigate = useNavigate();
  const { getCategoryById } = useQuiz();
  
  const category = getCategoryById(quiz.category);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="h-full transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{quiz.title}</CardTitle>
            <CardDescription className="mt-1">{quiz.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-500">
            <Clock size={16} className="mr-2" />
            <span>{quiz.timeLimit} minutes</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Users size={16} className="mr-2" />
            <span>{quiz.questions.length} questions</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <CalendarDays size={16} className="mr-2" />
            <span>Created on {formatDate(quiz.createdAt)}</span>
          </div>
          
          {category && (
            <div className="mt-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {category.name}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline"
          onClick={() => navigate(`/quiz/${quiz.id}/details`)}
        >
          View Details
        </Button>
        
        {showTakeQuizButton && (
          <Button
            onClick={() => navigate(`/quiz/${quiz.id}`)}
          >
            Take Quiz
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default QuizCard;