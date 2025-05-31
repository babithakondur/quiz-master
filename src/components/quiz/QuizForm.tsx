import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { Quiz, Question, Option } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useQuiz } from '../../contexts/QuizContext';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface QuizFormProps {
  initialQuiz?: Quiz;
  onSave?: (quiz: Quiz) => void;
}

const QuizForm: React.FC<QuizFormProps> = ({ initialQuiz, onSave }) => {
  const { currentUser } = useAuth();
  const { createQuiz, updateQuiz, categories } = useQuiz();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState(initialQuiz?.title || '');
  const [description, setDescription] = useState(initialQuiz?.description || '');
  const [category, setCategory] = useState(initialQuiz?.category || categories[0]?.id || '');
  const [timeLimit, setTimeLimit] = useState(initialQuiz?.timeLimit.toString() || '10');
  const [questions, setQuestions] = useState<Question[]>(initialQuiz?.questions || []);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      text: '',
      type: 'multiple-choice',
      options: [
        { id: `${Date.now()}-1`, text: '' },
        { id: `${Date.now()}-2`, text: '' },
        { id: `${Date.now()}-3`, text: '' },
        { id: `${Date.now()}-4`, text: '' }
      ],
      correctOptionId: `${Date.now()}-1`
    };
    setQuestions([...questions, newQuestion]);
  };

  const addTrueFalseQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      text: '',
      type: 'true-false',
      options: [
        { id: `${Date.now()}-1`, text: 'True' },
        { id: `${Date.now()}-2`, text: 'False' }
      ],
      correctOptionId: `${Date.now()}-1`
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const updateQuestion = (questionId: string, field: keyof Question, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return { ...q, [field]: value };
      }
      return q;
    }));
  };

  const updateOption = (questionId: string, optionId: string, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          options: q.options.map(o => {
            if (o.id === optionId) {
              return { ...o, text: value };
            }
            return o;
          })
        };
      }
      return q;
    }));
  };

  const updateCorrectOption = (questionId: string, optionId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return { ...q, correctOptionId: optionId };
      }
      return q;
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!category) newErrors.category = 'Category is required';
    if (!timeLimit || parseInt(timeLimit) <= 0) newErrors.timeLimit = 'Valid time limit is required';
    
    if (questions.length === 0) {
      newErrors.questions = 'At least one question is required';
    } else {
      questions.forEach((q, index) => {
        if (!q.text.trim()) {
          newErrors[`question-${index}`] = 'Question text is required';
        }
        
        q.options.forEach((o, oIndex) => {
          if (!o.text.trim() && q.type === 'multiple-choice') {
            newErrors[`option-${index}-${oIndex}`] = 'Option text is required';
          }
        });
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (!currentUser) {
      alert('You must be logged in to create a quiz');
      return;
    }
    
    const quizData: Omit<Quiz, 'id' | 'createdAt'> = {
      title,
      description,
      category,
      timeLimit: parseInt(timeLimit),
      questions,
      createdBy: currentUser.id,
      isPublished: false
    };
    
    let savedQuiz: Quiz;
    
    if (initialQuiz) {
      savedQuiz = {
        ...initialQuiz,
        ...quizData
      };
      updateQuiz(savedQuiz);
    } else {
      savedQuiz = createQuiz(quizData);
    }
    
    if (onSave) {
      onSave(savedQuiz);
    } else {
      navigate('/my-quizzes');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Quiz Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Quiz Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
            fullWidth
            placeholder="Enter quiz title"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="" disabled>Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={errors.description}
            fullWidth
            placeholder="Enter quiz description"
          />
          
          <Input
            label="Time Limit (minutes)"
            type="number"
            min="1"
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
            error={errors.timeLimit}
            fullWidth
            placeholder="Enter time limit in minutes"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
          <div className="space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={addTrueFalseQuestion}
              size="sm"
            >
              <Plus size={16} className="mr-1" /> True/False
            </Button>
            <Button
              type="button"
              onClick={addQuestion}
              size="sm"
            >
              <Plus size={16} className="mr-1" /> Multiple Choice
            </Button>
          </div>
        </div>
        
        {errors.questions && (
          <p className="text-sm text-red-600">{errors.questions}</p>
        )}
        
        {questions.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No questions added yet. Click "Add Question" to get started.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {questions.map((question, qIndex) => (
              <Card key={question.id}>
                <CardHeader className="flex flex-row items-start justify-between">
                  <CardTitle className="text-lg">Question {qIndex + 1}</CardTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeQuestion(question.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="Question Text"
                    value={question.text}
                    onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                    error={errors[`question-${qIndex}`]}
                    fullWidth
                    placeholder="Enter your question"
                  />
                  
                  <div>
                    <p className="block text-sm font-medium text-gray-700 mb-2">
                      Options {question.type === 'true-false' && '(True/False)'}
                    </p>
                    
                    <div className="space-y-3">
                      {question.options.map((option, oIndex) => (
                        <div key={option.id} className="flex items-center space-x-3">
                          <input
                            type="radio"
                            id={`option-${question.id}-${option.id}`}
                            name={`correct-${question.id}`}
                            checked={question.correctOptionId === option.id}
                            onChange={() => updateCorrectOption(question.id, option.id)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                          />
                          
                          <div className="flex-1">
                            <Input
                              value={option.text}
                              onChange={(e) => updateOption(question.id, option.id, e.target.value)}
                              error={errors[`option-${qIndex}-${oIndex}`]}
                              fullWidth
                              placeholder={`Option ${oIndex + 1}`}
                              disabled={question.type === 'true-false'}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/my-quizzes')}
        >
          Cancel
        </Button>
        <Button type="submit">
          {initialQuiz ? 'Update Quiz' : 'Create Quiz'}
        </Button>
      </div>
    </form>
  );
};

export default QuizForm;