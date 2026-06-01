import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading, requiresOnboarding } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    console.log('ProtectedRoute: No user found, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }

  // If mom requires onboarding and not already on questionnaire page, redirect to questionnaire
  const isQuestionnairePage = location.pathname === '/questionnaire';
  if (requiresOnboarding && user.role === UserRole.MOM && !isQuestionnairePage) {
    console.log('ProtectedRoute: Mom requires onboarding, redirecting to /questionnaire');
    return <Navigate to="/questionnaire" replace />;
  }

  // If user is on questionnaire page but has completed onboarding, redirect to dashboard
  if (isQuestionnairePage && !requiresOnboarding) {
    console.log('ProtectedRoute: Onboarding already completed, redirecting to /dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated, show the protected content
  console.log('ProtectedRoute: User authenticated, showing protected content');
  return <>{children}</>;
};
