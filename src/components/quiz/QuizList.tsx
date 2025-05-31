import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import QuizCard from './QuizCard';
import { Quiz } from '../../types';
import { useQuiz } from '../../contexts/QuizContext';

interface QuizListProps {
  title?: string;
  quizzes?: Quiz[];
  emptyMessage?: string;
  showCategory?: boolean;
}

const QuizList: React.FC<QuizListProps> = ({
  title = 'Available Quizzes',
  quizzes: propQuizzes,
  emptyMessage = 'No quizzes available.',
  showCategory = true,
}) => {
  const { quizzes: contextQuizzes, categories } = useQuiz();
  const allQuizzes = propQuizzes || contextQuizzes;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>(allQuizzes);
  
  useEffect(() => {
    let filtered = [...allQuizzes];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(quiz => 
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(quiz => quiz.category === selectedCategory);
    }
    
    setFilteredQuizzes(filtered);
  }, [searchTerm, selectedCategory, allQuizzes]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        
        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
          {showCategory && categories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
          
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 px-3 py-2 w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>
      
      {filteredQuizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
};

export default QuizList;