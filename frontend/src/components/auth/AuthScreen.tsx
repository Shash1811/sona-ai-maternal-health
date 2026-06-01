import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../../types/auth';
import { Baby, Stethoscope, Heart, Mail, Lock, User as UserIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useAuth } from '../../contexts/AuthContext';

export const AuthScreen: React.FC = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'role-selection' | 'login' | 'signup'>('role-selection');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    licenseNumber: '',
    licenseDocumentUrl: '',
    professionalTitle: '',
    specialization: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, signup } = useAuth();

  const handleRoleSelectForSignup = (role: UserRole) => {
    setSelectedRole(role);
    setAuthMode('signup');
    setCurrentView('signup');
  };

  const handleRoleSelectForSignin = (role: UserRole) => {
    setSelectedRole(role);
    setAuthMode('signin');
    setCurrentView('login');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (!selectedRole) {
      setError('Please select a role');
      setIsLoading(false);
      return;
    }

    if (selectedRole === UserRole.MEDICAL_PROFESSIONAL && (!formData.licenseNumber || !formData.licenseDocumentUrl)) {
      setError('Please submit your medical license number and license document link');
      setIsLoading(false);
      return;
    }

    try {
      const result = await signup({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        role: selectedRole,
        license_number: formData.licenseNumber,
        license_document_url: formData.licenseDocumentUrl,
        professional_title: formData.professionalTitle,
        specialization: formData.specialization
      });
      
      // If mom requires onboarding, redirect to questionnaire
      if (result.requiresOnboarding && selectedRole === UserRole.MOM) {
        navigate('/questionnaire');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      licenseNumber: '',
      licenseDocumentUrl: '',
      professionalTitle: '',
      specialization: ''
    });
    setError('');
  };

  const handleBack = () => {
    resetForm();
    setCurrentView('role-selection');
    setSelectedRole(null);
    setAuthMode('signup');
  };

  const handleSwitchToLogin = () => {
    resetForm();
    setAuthMode('signin');
    setCurrentView('role-selection');
    setSelectedRole(null);
  };

  const handleSwitchToSignup = () => {
    resetForm();
    setAuthMode('signup');
    setCurrentView('role-selection');
    setSelectedRole(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {currentView === 'role-selection' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" fill="currentColor" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Sona</h1>
              <p className="text-gray-600">Choose your role to begin your journey</p>
            </div>

            <div className="space-y-4">
              {authMode === 'signup' ? (
                <>
                  <button
                    onClick={() => handleRoleSelectForSignup(UserRole.MOM)}
                    className="w-full p-6 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-xl flex items-center space-x-4 hover:shadow-lg transition-all"
                  >
                    <Baby className="w-8 h-8" />
                    <div className="text-left">
                      <h3 className="font-semibold text-lg">Mom</h3>
                      <p className="text-sm opacity-90">Get personalized maternal support</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleRoleSelectForSignup(UserRole.MEDICAL_PROFESSIONAL)}
                    className="w-full p-6 bg-gradient-to-r from-blue-400 to-teal-500 text-white rounded-xl flex items-center space-x-4 hover:shadow-lg transition-all"
                  >
                    <Stethoscope className="w-8 h-8" />
                    <div className="text-left">
                      <h3 className="font-semibold text-lg">Medical Professional</h3>
                      <p className="text-sm opacity-90">Support and guide mothers</p>
                    </div>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleRoleSelectForSignin(UserRole.MOM)}
                    className="w-full p-6 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-xl flex items-center space-x-4 hover:shadow-lg transition-all"
                  >
                    <Baby className="w-8 h-8" />
                    <div className="text-left">
                      <h3 className="font-semibold text-lg">Mom</h3>
                      <p className="text-sm opacity-90">Continue as Mom</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleRoleSelectForSignin(UserRole.MEDICAL_PROFESSIONAL)}
                    className="w-full p-6 bg-gradient-to-r from-blue-400 to-teal-500 text-white rounded-xl flex items-center space-x-4 hover:shadow-lg transition-all"
                  >
                    <Stethoscope className="w-8 h-8" />
                    <div className="text-left">
                      <h3 className="font-semibold text-lg">Medical Professional</h3>
                      <p className="text-sm opacity-90">Continue as Medical Professional</p>
                    </div>
                  </button>
                </>
              )}
            </div>

            <div className="mt-8 text-center">
              {authMode === 'signup' ? (
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    onClick={handleSwitchToLogin}
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Sign in
                  </button>
                </p>
              ) : (
                <p className="text-sm text-gray-600">
                  Want to create an account?{' '}
                  <button
                    onClick={handleSwitchToSignup}
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Sign up
                  </button>
                </p>
              )}
            </div>
          </div>
        )}

        {(currentView === 'login' || currentView === 'signup') && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ←
              </button>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentView === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-sm text-gray-600">
                  {selectedRole === UserRole.MOM ? '👩 Mom Account' : '👨‍⚕️ Medical Professional Account'}
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={currentView === 'login' ? handleLogin : handleSignup} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full"
                  required
                />
              </div>

              {currentView === 'signup' && (
                <div>
                  <Input
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full"
                    required
                  />
                </div>
              )}

              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full"
                  required
                />
              </div>

              {currentView === 'signup' && (
                <div>
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full"
                    required
                  />
                </div>
              )}

              {currentView === 'signup' && selectedRole === UserRole.MEDICAL_PROFESSIONAL && (
                <div className="space-y-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <p className="text-sm font-medium text-blue-900">Medical license verification</p>
                  <Input
                    type="text"
                    placeholder="Professional title, e.g. OB-GYN"
                    value={formData.professionalTitle}
                    onChange={(e) => setFormData({ ...formData, professionalTitle: e.target.value })}
                    className="w-full"
                  />
                  <Input
                    type="text"
                    placeholder="Specialization"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full"
                  />
                  <Input
                    type="text"
                    placeholder="Medical license number"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    className="w-full"
                    required
                  />
                  <Input
                    type="url"
                    placeholder="License document URL"
                    value={formData.licenseDocumentUrl}
                    onChange={(e) => setFormData({ ...formData, licenseDocumentUrl: e.target.value })}
                    className="w-full"
                    required
                  />
                  <p className="text-xs text-blue-700">
                    Your account will be marked pending until the submitted license is reviewed.
                  </p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-xl font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {currentView === 'login' ? 'Signing in...' : 'Creating account...'}
                  </div>
                ) : (
                  currentView === 'login' ? 'Sign In' : 'Create Account'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {currentView === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                <button
                  onClick={currentView === 'login' ? handleSwitchToSignup : handleSwitchToLogin}
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  {currentView === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
