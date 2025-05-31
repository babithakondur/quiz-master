import { User, Quiz, QuizAttempt, Category } from '../types';

// Local Storage Keys
const USERS_KEY = 'quiz-app-users';
const CURRENT_USER_KEY = 'quiz-app-current-user';
const QUIZZES_KEY = 'quiz-app-quizzes';
const QUIZ_ATTEMPTS_KEY = 'quiz-app-quiz-attempts';
const CATEGORIES_KEY = 'quiz-app-categories';

// Helper Functions
const getItem = <T>(key: string, defaultValue: T): T => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
};

const setItem = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Users
export const getUsers = (): User[] => getItem<User[]>(USERS_KEY, []);
export const saveUsers = (users: User[]): void => setItem(USERS_KEY, users);
export const getCurrentUser = (): User | null => getItem<User | null>(CURRENT_USER_KEY, null);
export const saveCurrentUser = (user: User | null): void => setItem(CURRENT_USER_KEY, user);

// Quizzes
export const getQuizzes = (): Quiz[] => getItem<Quiz[]>(QUIZZES_KEY, []);
export const saveQuizzes = (quizzes: Quiz[]): void => setItem(QUIZZES_KEY, quizzes);

// Quiz Attempts
export const getQuizAttempts = (): QuizAttempt[] => getItem<QuizAttempt[]>(QUIZ_ATTEMPTS_KEY, []);
export const saveQuizAttempts = (attempts: QuizAttempt[]): void => setItem(QUIZ_ATTEMPTS_KEY, attempts);

// Categories
export const getCategories = (): Category[] => getItem<Category[]>(CATEGORIES_KEY, []);
export const saveCategories = (categories: Category[]): void => setItem(CATEGORIES_KEY, categories);

// Initialize with sample data if empty
export const initializeData = (): void => {
  if (getUsers().length === 0) {
    const users: User[] = [
      {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        isAdmin: true,
        avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      },
      {
        id: '2',
        name: 'Regular User',
        email: 'user@example.com',
        isAdmin: false,
        avatarUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      }
    ];
    saveUsers(users);
    saveCurrentUser(users[0]);
  }

  if (getCategories().length === 0) {
    const categories: Category[] = [
      { id: '1', name: 'Mathematics', description: 'Math topics from algebra to calculus', iconName: 'calculator' },
      { id: '2', name: 'Science', description: 'Physics, chemistry, and biology topics', iconName: 'flask' },
      { id: '3', name: 'History', description: 'World history and historical events', iconName: 'landmark' },
      { id: '4', name: 'Literature', description: 'Books, authors, and literary analysis', iconName: 'book-open' },
      { id: '5', name: 'Programming', description: 'Coding languages and software development', iconName: 'code' }
    ];
    saveCategories(categories);
  }

  if (getQuizzes().length === 0) {
    const quizzes: Quiz[] = [
      {
        id: '1',
        title: 'Introduction to JavaScript',
        description: 'Test your knowledge of JavaScript fundamentals',
        category: '5',
        timeLimit: 10,
        questions: [
          {
            id: '1-1',
            text: 'Which of the following is NOT a JavaScript data type?',
            type: 'multiple-choice',
            options: [
              { id: '1-1-1', text: 'String' },
              { id: '1-1-2', text: 'Boolean' },
              { id: '1-1-3', text: 'Integer' },
              { id: '1-1-4', text: 'Object' }
            ],
            correctOptionId: '1-1-3',
            explanation: 'JavaScript has Number type, not Integer type specifically.'
          },
          {
            id: '1-2',
            text: 'JavaScript is a case-sensitive language.',
            type: 'true-false',
            options: [
              { id: '1-2-1', text: 'True' },
              { id: '1-2-2', text: 'False' }
            ],
            correctOptionId: '1-2-1'
          }
        ],
        createdBy: '1',
        createdAt: new Date().toISOString(),
        isPublished: true
      },
      {
        id: '2',
        title: 'Basic Mathematics',
        description: 'Test your basic math skills',
        category: '1',
        timeLimit: 15,
        questions: [
          {
            id: '2-1',
            text: 'What is 7 × 8?',
            type: 'multiple-choice',
            options: [
              { id: '2-1-1', text: '54' },
              { id: '2-1-2', text: '56' },
              { id: '2-1-3', text: '58' },
              { id: '2-1-4', text: '62' }
            ],
            correctOptionId: '2-1-2'
          },
          {
            id: '2-2',
            text: 'The square root of 144 is 12.',
            type: 'true-false',
            options: [
              { id: '2-2-1', text: 'True' },
              { id: '2-2-2', text: 'False' }
            ],
            correctOptionId: '2-2-1'
          }
        ],
        createdBy: '1',
        createdAt: new Date().toISOString(),
        isPublished: true
      }
    ];
    saveQuizzes(quizzes);
  }

  if (getQuizAttempts().length === 0) {
    const attempts: QuizAttempt[] = [
      {
        id: '1',
        quizId: '1',
        userId: '2',
        startedAt: new Date(Date.now() - 3600000).toISOString(),
        completedAt: new Date(Date.now() - 3540000).toISOString(),
        score: 50,
        answers: [
          {
            questionId: '1-1',
            selectedOptionId: '1-1-3',
            isCorrect: true
          },
          {
            questionId: '1-2',
            selectedOptionId: '1-2-2',
            isCorrect: false
          }
        ]
      }
    ];
    saveQuizAttempts(attempts);
  }
};