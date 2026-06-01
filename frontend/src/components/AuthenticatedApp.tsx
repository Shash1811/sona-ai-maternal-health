import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/auth';
import { MaternalQuestionnaire } from './questionnaire/MaternalQuestionnaire';
import Index from '../pages/Index';

export const AuthenticatedApp: React.FC = () => {
  const { user, isLoading, requiresOnboarding, setRequiresOnboarding } = useAuth();
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  useEffect(() => {
    if (user && user.role === UserRole.MOM && requiresOnboarding) {
      setShowQuestionnaire(true);
    }
  }, [user, requiresOnboarding]);

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

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (showQuestionnaire) {
    const handleQuestionnaireComplete = () => {
      setShowQuestionnaire(false);
      setRequiresOnboarding(false);
    };

    return <MaternalQuestionnaire onComplete={handleQuestionnaireComplete} />;
  }

  return <Index />;
};
