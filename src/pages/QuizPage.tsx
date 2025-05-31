import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useQuiz } from '../contexts/QuizContext';
import { Quiz, Question } from '../types';
import AppLayout from '../components/layouts/AppLayout';
import QuizQuestion from '../components/quiz/QuizQuestion';
import Button from '../components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';

const QuizPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const { currentUser } = useAuth();
  const { getQuizById, startQuizAttempt, submitQuizAttempt } = useQuiz();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  
  // Load quiz
  useEffect(() => {
    if (quizId) {
      const foundQuiz = getQuizById(quizId);
      if (foundQuiz) {
        setQuiz(foundQuiz);
      } else {
        navigate('/quizzes');
      }
    }
  }, [quizId]);
  
  // Start quiz
  const handleStartQuiz = () => {
    if (!quiz || !currentUser) return;
    
    const attempt = startQuizAttempt(quiz.id, currentUser.id);
    setAttemptId(attempt.id);
    setQuizStarted(true);
    setTimeLeft(quiz.timeLimit * 60); // Convert minutes to seconds
  };
  
  // Timer
  useEffect(() => {
    if (!quizStarted || quizCompleted) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [quizStarted, quizCompleted]);
  
  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Handle option selection
  const handleSelectOption = (questionId: string, optionId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };
  
  // Navigation
  const goToNextQuestion = () => {
    if (!quiz) return;
    
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  // Complete quiz
  const handleFinishQuiz = () => {
    if (!quiz || !attemptId || !currentUser) return;
    
    // Calculate score
    let correctAnswers = 0;
    const answers = Object.keys(selectedOptions).map(questionId => {
      const question = quiz.questions.find(q => q.id === questionId);
      const optionId = selectedOptions[questionId];
      const isCorrect = question?.correctOptionId === optionId;
      
      if (isCorrect) correctAnswers++;
      
      return {
        questionId,
        selectedOptionId: optionId,
        isCorrect,
      };
    });
    
    const finalScore = Math.round((correctAnswers / quiz.questions.length) * 100);
    setScore(finalScore);
    
    // Submit attempt
    submitQuizAttempt({
      id: attemptId,
      quizId: quiz.id,
      userId: currentUser.id,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      score: finalScore,
      answers,
    });
    
    setQuizCompleted(true);
  };
  
  if (!quiz) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <p>Loading quiz...</p>
        </div>
      </AppLayout>
    );
  }
  
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const allQuestionsAnswered = quiz.questions.every(q => selectedOptions[q.id]);
  
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        {!quizStarted && !quizCompleted && (
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl">{quiz.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">{quiz.description}</p>
              
              <div className="border-t border-b border-gray-200 py-4 my-4">
                <div className="flex justify-center space-x-8">
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">Questions</p>
                    <p className="text-2xl font-bold">{quiz.questions.length}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">Time Limit</p>
                    <p className="text-2xl font-bold">{quiz.timeLimit} min</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <h3 className="font-medium text-amber-800">Before you start</h3>
                  <p className="text-sm text-amber-700">
                    Make sure you have enough time to complete the quiz. Once started, the timer cannot be paused.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-center">
              <Button
                onClick={handleStartQuiz}
                size="lg"
                className="px-8"
              >
                Start Quiz
              </Button>
            </CardFooter>
          </Card>
        )}
        
        {quizStarted && !quizCompleted && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm sticky top-0 z-10">
              <h1 className="text-xl font-bold text-gray-900">{quiz.title}</h1>
              
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-500 mr-2" />
                <span className={`font-mono font-medium ${timeLeft < 60 ? 'text-red-600' : 'text-gray-700'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
            
            <div className="space-y-6">
              <QuizQuestion
                question={currentQuestion}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={quiz.questions.length}
                selectedOptionId={selectedOptions[currentQuestion.id] || null}
                onSelectOption={(optionId) => handleSelectOption(currentQuestion.id, optionId)}
              />
              
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={goToPreviousQuestion}
                  disabled={isFirstQuestion}
                >
                  Previous
                </Button>
                
                <div className="flex space-x-2">
                  {isLastQuestion ? (
                    <Button
                      onClick={handleFinishQuiz}
                      disabled={!allQuestionsAnswered}
                    >
                      Finish Quiz
                    </Button>
                  ) : (
                    <Button onClick={goToNextQuestion}>
                      Next
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center mt-6">
                {quiz.questions.map((q, index) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-sm ${
                      index === currentQuestionIndex
                        ? 'bg-indigo-600 text-white'
                        : selectedOptions[q.id]
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {quizCompleted && (
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-indigo-100 mb-4">
                  <span className="text-3xl font-bold text-indigo-600">{score}%</span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900">
                  {score >= 70 ? 'Great job!' : score >= 50 ? 'Good effort!' : 'Keep practicing!'}
                </h3>
                
                <p className="text-gray-600 mt-2">
                  You scored {score}% on {quiz.title}
                </p>
              </div>
              
              <div className="space-y-4 mt-8">
                <h3 className="text-lg font-semibold text-gray-900">Review Your Answers</h3>
                
                {quiz.questions.map((question, index) => (
                  <QuizQuestion
                    key={question.id}
                    question={question}
                    questionNumber={index + 1}
                    totalQuestions={quiz.questions.length}
                    selectedOptionId={selectedOptions[question.id] || null}
                    onSelectOption={() => {}}
                    showAnswer
                  />
                ))}
              </div>
            </CardContent>
            <CardFooter className="justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
              </Button>
              <Button
                onClick={() => navigate('/quizzes')}
              >
                Take Another Quiz
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default QuizPage;