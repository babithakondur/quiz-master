import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { QuizProvider } from './contexts/QuizContext';
import { initializeData } from './utils/storage';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import QuizzesPage from './pages/QuizzesPage';
import MyQuizzesPage from './pages/MyQuizzesPage';
import CreateQuizPage from './pages/CreateQuizPage';
import EditQuizPage from './pages/EditQuizPage';
import QuizPage from './pages/QuizPage';
import QuizDetailsPage from './pages/QuizDetailsPage';

// Initialize sample data
initializeData();

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function AppRoutes() {
  const { currentUser } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={currentUser ? <Navigate to="/dashboard\" replace /> : <LoginPage />} />
      <Route path="/register" element={currentUser ? <Navigate to="/dashboard\" replace /> : <RegisterPage />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
      
      <Route path="/quizzes" element={
        <ProtectedRoute>
          <QuizzesPage />
        </ProtectedRoute>
      } />
      
      <Route path="/my-quizzes" element={
        <ProtectedRoute>
          <MyQuizzesPage />
        </ProtectedRoute>
      } />
      
      <Route path="/quiz/create" element={
        <ProtectedRoute>
          <CreateQuizPage />
        </ProtectedRoute>
      } />
      
      <Route path="/quiz/:quizId/edit" element={
        <ProtectedRoute>
          <EditQuizPage />
        </ProtectedRoute>
      } />
      
      <Route path="/quiz/:quizId" element={
        <ProtectedRoute>
          <QuizPage />
        </ProtectedRoute>
      } />
      
      <Route path="/quiz/:quizId/details" element={
        <ProtectedRoute>
          <QuizDetailsPage />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<Navigate to={currentUser ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <QuizProvider>
          <AppRoutes />
        </QuizProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;