import React, { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Home,
  BookOpen,
  ListChecks,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  X,
  User,
} from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'My Quizzes', href: '/my-quizzes', icon: BookOpen },
    { name: 'Take Quiz', href: '/quizzes', icon: ListChecks },
    { name: 'Analytics', href: '/analytics', icon: BarChart2 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center">
        <button
          onClick={toggleMobileMenu}
          className="text-gray-500 hover:text-gray-600 focus:outline-none"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1 className="text-xl font-bold text-indigo-600">QuizMaster</h1>
        <div className="w-6"></div> {/* Spacer for alignment */}
      </div>

      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-20 bg-gray-800 bg-opacity-50"
          onClick={toggleMobileMenu}
        ></div>
      )}

      <div
        className={`lg:hidden fixed z-30 inset-y-0 left-0 w-64 bg-white transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-5 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                {currentUser?.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <User size={20} className="text-indigo-600" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">{currentUser?.name}</p>
                <p className="text-xs text-gray-500">{currentUser?.email}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.href);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Icon className="mr-3 h-5 w-5 text-gray-400" />
                  {item.name}
                </a>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 w-full"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Log out
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow border-r border-gray-200 bg-white overflow-y-auto">
          <div className="flex items-center justify-center h-16 flex-shrink-0 px-4 bg-indigo-600">
            <h1 className="text-xl font-bold text-white">QuizMaster</h1>
          </div>
          <div className="flex-grow flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  {currentUser?.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <User size={20} className="text-indigo-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{currentUser?.name}</p>
                  <p className="text-xs text-gray-500">{currentUser?.email}</p>
                </div>
              </div>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.href);
                    }}
                  >
                    <Icon className="mr-3 h-5 w-5 text-gray-400" />
                    {item.name}
                  </a>
                );
              })}
            </nav>
          </div>
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 w-full"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Log out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <main className="flex-1">
          <div className="py-6 sm:px-6 lg:px-8 mt-12 lg:mt-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;