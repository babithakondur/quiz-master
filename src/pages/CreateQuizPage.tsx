import React from 'react';
import AppLayout from '../components/layouts/AppLayout';
import QuizForm from '../components/quiz/QuizForm';

const CreateQuizPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Quiz</h1>
        <QuizForm />
      </div>
    </AppLayout>
  );
};

export default CreateQuizPage;