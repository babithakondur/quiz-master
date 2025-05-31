import React, { useState } from 'react';
import { Question } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface QuizQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedOptionId: string | null;
  onSelectOption: (optionId: string) => void;
  showAnswer?: boolean;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  questionNumber,
  totalQuestions,
  selectedOptionId,
  onSelectOption,
  showAnswer = false,
}) => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">
            Question {questionNumber} of {totalQuestions}
          </CardTitle>
          <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-800">
            {question.type === 'multiple-choice' ? 'Multiple Choice' : 'True/False'}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-gray-800 font-medium text-lg">{question.text}</p>
        
        <div className="space-y-3">
          {question.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            const isCorrect = showAnswer && option.id === question.correctOptionId;
            const isIncorrect = showAnswer && isSelected && option.id !== question.correctOptionId;
            
            let borderColor = 'border-gray-200';
            let bgColor = 'bg-white';
            
            if (isSelected && !showAnswer) {
              borderColor = 'border-indigo-500';
              bgColor = 'bg-indigo-50';
            } else if (isCorrect) {
              borderColor = 'border-green-500';
              bgColor = 'bg-green-50';
            } else if (isIncorrect) {
              borderColor = 'border-red-500';
              bgColor = 'bg-red-50';
            }
            
            return (
              <div
                key={option.id}
                className={`p-4 border rounded-md cursor-pointer transition-all ${borderColor} ${bgColor} hover:border-indigo-200 hover:bg-indigo-50`}
                onClick={() => !showAnswer && onSelectOption(option.id)}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center mr-3 ${
                    isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
                  }`}>
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="text-gray-800">{option.text}</span>
                  
                  {showAnswer && (
                    <div className="ml-auto">
                      {isCorrect && (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                          Correct
                        </span>
                      )}
                      {isIncorrect && (
                        <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                          Incorrect
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {showAnswer && question.explanation && (
          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <p className="text-sm font-medium text-blue-800">Explanation:</p>
            <p className="text-sm text-blue-700">{question.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuizQuestion;