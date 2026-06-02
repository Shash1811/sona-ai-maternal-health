import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, Baby, Heart, Activity, Utensils, Sparkles, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useAuth } from '../../contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

interface QuestionnaireData {
  pregnancy_status: string;
  due_date?: string;
  baby_birth_date?: string;
  delivery_method?: string;
  number_of_children: number;
  current_weeks_pregnant?: number;
  weeks_postpartum?: number;
  feeding_method?: string;
  is_high_risk?: boolean;
  high_risk_factors?: string[];
  has_postpartum_complications?: boolean;
  postpartum_complications?: string[];
  pre_existing_conditions?: string[];
  medications?: string[];
  allergies?: string[];
  previous_pregnancies: number;
  has_anxiety?: boolean;
  has_depression?: boolean;
  has_postpartum_depression?: boolean;
  stress_level: number;
  sleep_hours_per_night: number;
  exercise_frequency: string;
  smoking_status: string;
  alcohol_consumption: string;
  dietary_preferences?: string[];
  food_allergies?: string;
  food_restrictions?: string[];
  takes_prenatal_vitamins?: boolean;
  has_partner_support?: boolean;
  has_family_support?: boolean;
  has_friends_support?: boolean;
  has_professional_support?: boolean;
  support_person_name?: string;
  primary_health_goals?: string[];
  main_concerns?: string[];
  areas_needing_support?: string[];
  interested_in_diet_planning?: boolean;
  interested_in_exercise_guidance?: boolean;
  interested_in_mental_health_support?: boolean;
  interested_in_medical_tracking?: boolean;
  interested_in_community_support?: boolean;
}

interface QuestionnaireTemplate {
  sections: Array<{
    id: string;
    title: string;
    conditional?: string;
    fields: Array<{
      name: string;
      type: string;
      required: boolean;
      label?: string;
      options?: string;
      min?: number;
      max?: number;
      step?: number;
    }>;
  }>;
}

// Local fallback template in case backend is unavailable
const localTemplate: QuestionnaireTemplate = {
  sections: [
    {
      id: 'basic-info',
      title: 'Basic Information',
      fields: [
        { name: 'pregnancy_status', type: 'select', required: true, label: 'Current Status', options: 'pregnant,postpartum,planning,other' },
        { name: 'number_of_children', type: 'number', required: true, label: 'Number of Children', min: 0, max: 20 },
        { name: 'previous_pregnancies', type: 'number', required: true, label: 'Previous Pregnancies', min: 0, max: 20 },
      ]
    },
    {
      id: 'pregnancy-details',
      title: 'Pregnancy Details',
      conditional: "pregnancy_status == 'pregnant'",
      fields: [
        { name: 'due_date', type: 'date', required: false, label: 'Due Date' },
        { name: 'current_weeks_pregnant', type: 'number', required: false, label: 'Current Week of Pregnancy', min: 1, max: 42 },
      ]
    },
    {
      id: 'postpartum-details',
      title: 'Postpartum Details',
      conditional: "pregnancy_status == 'postpartum'",
      fields: [
        { name: 'baby_birth_date', type: 'date', required: false, label: 'Baby Birth Date' },
        { name: 'weeks_postpartum', type: 'number', required: false, label: 'Weeks Postpartum', min: 0, max: 52 },
        { name: 'delivery_method', type: 'select', required: false, label: 'Delivery Method', options: 'vaginal,cesarean,vbac' },
      ]
    },
    {
      id: 'health-lifestyle',
      title: 'Health & Lifestyle',
      fields: [
        { name: 'stress_level', type: 'range', required: true, label: 'Stress Level (1-10)', min: 1, max: 10 },
        { name: 'sleep_hours_per_night', type: 'number', required: true, label: 'Sleep Hours per Night', min: 0, max: 24 },
        { name: 'exercise_frequency', type: 'select', required: true, label: 'Exercise Frequency', options: 'none,1-2 times per week,3-4 times per week,5+ times per week' },
        { name: 'smoking_status', type: 'select', required: true, label: 'Smoking Status', options: 'never,former,current' },
        { name: 'alcohol_consumption', type: 'select', required: true, label: 'Alcohol Consumption', options: 'none,occasional,regular' },
      ]
    },
    {
      id: 'medical-history',
      title: 'Medical History',
      fields: [
        { name: 'is_high_risk', type: 'boolean', required: false, label: 'High Risk Pregnancy' },
        { name: 'has_anxiety', type: 'boolean', required: false, label: 'Experiencing Anxiety' },
        { name: 'has_depression', type: 'boolean', required: false, label: 'Experiencing Depression' },
        { name: 'takes_prenatal_vitamins', type: 'boolean', required: false, label: 'Taking Prenatal Vitamins' },
      ]
    },
    {
      id: 'support-goals',
      title: 'Support & Goals',
      fields: [
        { name: 'has_partner_support', type: 'boolean', required: false, label: 'Have Partner Support' },
        { name: 'has_family_support', type: 'boolean', required: false, label: 'Have Family Support' },
        { name: 'interested_in_diet_planning', type: 'boolean', required: false, label: 'Interested in Diet Planning' },
        { name: 'interested_in_exercise_guidance', type: 'boolean', required: false, label: 'Interested in Exercise Guidance' },
        { name: 'interested_in_mental_health_support', type: 'boolean', required: false, label: 'Interested in Mental Health Support' },
      ]
    }
  ]
};

export const MaternalQuestionnaire: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData>({
    pregnancy_status: '',
    number_of_children: 0,
    previous_pregnancies: 0,
    stress_level: 5,
    sleep_hours_per_night: 7,
    exercise_frequency: 'none',
    smoking_status: 'never',
    alcohol_consumption: 'none',
  });
  const [template, setTemplate] = useState<QuestionnaireTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { token, completeOnboarding } = useAuth();

  useEffect(() => {
    fetchQuestionnaireTemplate();
  }, []);

  const fetchQuestionnaireTemplate = async () => {
    try {
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      const response = await fetch(`${API_BASE_URL}/questionnaire/questionnaire-template`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error('Failed to fetch template');
      }
      
      const data = await response.json();
      setTemplate(data);
    } catch (err) {
      console.warn('Backend template fetch failed, using local template:', err);
      // Use local template as fallback
      setTemplate(localTemplate);
    }
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    setQuestionnaireData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleMultiSelectChange = (fieldName: string, value: string) => {
    setQuestionnaireData(prev => {
      const currentArray = prev[fieldName as keyof QuestionnaireData] as string[] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return {
        ...prev,
        [fieldName]: newArray
      };
    });
  };

  const isSectionVisible = (section: any) => {
    if (!section.conditional) return true;
    
    // Simple conditional logic evaluation
    const condition = section.conditional;
    if (condition.includes('pregnancy_status == ')) {
      const expectedStatus = condition.split(' == ')[1].replace(/'/g, '');
      return questionnaireData.pregnancy_status === expectedStatus;
    }
    return true;
  };

  const visibleSections = template?.sections.filter(isSectionVisible) || [];
  const currentSectionData = visibleSections[currentSection];
  const isLastSection = currentSection === visibleSections.length - 1;

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      if (!token) {
        throw new Error('You must be signed in to save the questionnaire');
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${API_BASE_URL}/questionnaire/maternal-health`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(questionnaireData),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        if (result && result.detail) {
          if (Array.isArray(result.detail)) {
            const errorMsg = result.detail.map((err: any) => {
              const fieldName = err.loc ? err.loc[err.loc.length - 1] : '';
              const cleanField = typeof fieldName === 'string' 
                ? fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) 
                : '';
              return `${cleanField ? cleanField + ': ' : ''}${err.msg}`;
            }).join(', ');
            throw new Error(errorMsg);
          } else if (typeof result.detail === 'object') {
            throw new Error(JSON.stringify(result.detail));
          } else {
            throw new Error(result.detail);
          }
        }
        throw new Error('Failed to save questionnaire to the database');
      }

      await completeOnboarding(questionnaireData);

      // Call onComplete callback if provided
      if (onComplete) {
        onComplete();
      }

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save questionnaire');
    } finally {
      setIsLoading(false);
    }
  };

  const renderField = (field: any) => {
    const value = questionnaireData[field.name as keyof QuestionnaireData];
    const getFieldOptions = () => {
      const namedOptions: Record<string, string[]> = {
        pregnancy_status: ['planning', 'pregnant', 'postpartum', 'not_applicable'],
        delivery_method: ['vaginal', 'c_section', 'planning', 'unknown'],
        feeding_method: ['breastfeeding', 'formula', 'combination', 'not_applicable'],
      };

      if (Array.isArray(field.options)) return field.options;
      if (typeof field.options === 'string') {
        if (namedOptions[field.options]) return namedOptions[field.options];
        return field.options.split(',').map((opt: string) => opt.trim()).filter(Boolean);
      }

      return [];
    };
    const formatOptionLabel = (option: string) =>
      option.replace(/_/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase());
    
    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <Input
            value={value as string || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={`${field.label || field.name.replace(/_/g, ' ')} 💬`}
            className="rounded-xl border-2 border-purple-200 focus:border-purple-400 transition-colors"
            required={field.required}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value as number || ''}
            onChange={(e) => handleFieldChange(field.name, parseInt(e.target.value) || 0)}
            min={field.min}
            max={field.max}
            step={field.step}
            placeholder={`${field.label || field.name.replace(/_/g, ' ')} 🔢`}
            className="rounded-xl border-2 border-purple-200 focus:border-purple-400 transition-colors"
            required={field.required}
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value as string || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={`${field.label || field.name.replace(/_/g, ' ')} 📅`}
            className="rounded-xl border-2 border-purple-200 focus:border-purple-400 transition-colors"
            required={field.required}
          />
        );

      case 'select':
        const selectOptions = getFieldOptions();
        return (
          <select
            value={value as string || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className="w-full p-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
            required={field.required}
          >
            <option value="">Select... 💭</option>
            {selectOptions.map((option: string) => (
              <option key={option} value={option.toLowerCase().replace(/\s+/g, '_')}>
                {option} 💕
              </option>
            ))}
          </select>
        );

      case 'checkbox':
      case 'boolean':
        return (
          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-xl border-2 border-purple-200">
            <input
              type="checkbox"
              checked={value as boolean || false}
              onChange={(e) => handleFieldChange(field.name, e.target.checked)}
              className="w-5 h-5 text-purple-600 border-purple-300 rounded focus:ring-purple-500"
            />
            <label className="text-sm text-gray-700 flex items-center">
              {field.label || field.name.replace(/_/g, ' ')} 💕
            </label>
          </div>
        );

      case 'multiselect':
        const options = getFieldOptions();
        return (
          <div className="space-y-2 p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
            {options.map((option: string) => (
              <div key={option} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={(value as string[] || []).includes(option)}
                  onChange={() => handleMultiSelectChange(field.name, option)}
                  className="w-5 h-5 text-purple-600 border-purple-300 rounded focus:ring-purple-500"
                />
                <label className="text-sm text-gray-700 flex items-center">
                  {option} 💕
                </label>
              </div>
            ))}
          </div>
        );

      case 'scale':
      case 'range':
        return (
          <div className="space-y-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{field.label || 'How are you feeling?'} 💭</span>
              <span className="text-lg font-bold text-purple-600">{value as number || field.min || 5}</span>
            </div>
            <input
              type="range"
              min={field.min || 1}
              max={field.max || 10}
              value={value as number || field.min || 5}
              onChange={(e) => handleFieldChange(field.name, parseInt(e.target.value))}
              className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>😢</span>
              <span>😐</span>
              <span>😊</span>
            </div>
          </div>
        );

      default:
        // Fallback for unknown field types - render as text input
        return (
          <Input
            value={value as string || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={`${field.label || field.name.replace(/_/g, ' ')} 💬`}
            className="rounded-xl border-2 border-purple-200 focus:border-purple-400 transition-colors"
            required={field.required}
          />
        );
    }
  };

  if (!template) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading questionnaire...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative overflow-hidden">
      {/* Decorative Hearts Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-pink-200/20 animate-pulse">
          <Heart className="w-24 h-24" fill="currentColor" />
        </div>
        <div className="absolute top-40 right-20 text-purple-200/20 animate-pulse" style={{ animationDelay: '1s' }}>
          <Heart className="w-20 h-20" fill="currentColor" />
        </div>
        <div className="absolute bottom-20 left-32 text-blue-200/20 animate-pulse" style={{ animationDelay: '2s' }}>
          <Heart className="w-28 h-28" fill="currentColor" />
        </div>
        <div className="absolute top-60 right-40 text-pink-300/20 animate-pulse" style={{ animationDelay: '1.5s' }}>
          <Sparkles className="w-16 h-16" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-lg p-6 mb-6 border border-pink-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg">
                <Baby className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  Maternal Health Questionnaire 💕
                </h1>
                <p className="text-gray-600">Help us personalize your experience 💗</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Section {currentSection + 1} of {visibleSections.length}</p>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentSection + 1) / visibleSections.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Questionnaire Form */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            className="bg-white/95 backdrop-blur-md rounded-3xl shadow-lg p-8 border border-purple-200"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              {currentSectionData.title.includes('Basic') && '🌟 Basic Information'}
              {currentSectionData.title.includes('Pregnancy') && '🤰 Pregnancy Details'}
              {currentSectionData.title.includes('Postpartum') && '🤱 Postpartum Information'}
              {currentSectionData.title.includes('Medical') && '🏥 Medical History'}
              {currentSectionData.title.includes('Mental') && '💭 Mental Health'}
              {currentSectionData.title.includes('Lifestyle') && '🌿 Lifestyle'}
              {currentSectionData.title.includes('Dietary') && '🥗 Dietary Preferences'}
              {currentSectionData.title.includes('Support') && '💝 Support System'}
              {currentSectionData.title.includes('Goals') && '🎯 Goals and Concerns'}
              {currentSectionData.title.includes('App') && '📱 App Preferences'}
              {!currentSectionData.title.includes('Basic') && !currentSectionData.title.includes('Pregnancy') && 
               !currentSectionData.title.includes('Postpartum') && !currentSectionData.title.includes('Medical') &&
               !currentSectionData.title.includes('Mental') && !currentSectionData.title.includes('Lifestyle') &&
               !currentSectionData.title.includes('Dietary') && !currentSectionData.title.includes('Support') &&
               !currentSectionData.title.includes('Goals') && !currentSectionData.title.includes('App') && currentSectionData.title}
            </h2>
            
            <div className="space-y-6">
              {currentSectionData.fields.map((field: any) => (
                <div key={field.name} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center">
                    {field.label || field.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    {field.required && <span className="text-red-500 ml-1">💕</span>}
                  </label>
                  {renderField(field)}
                </div>
              ))}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-600 text-sm flex items-center"
              >
                <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                disabled={currentSection === 0}
                className="flex items-center space-x-2 rounded-xl border-2 border-purple-200 hover:bg-purple-50 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous 💕</span>
              </Button>

              <Button
                onClick={isLastSection ? handleSubmit : () => setCurrentSection(currentSection + 1)}
                disabled={isLoading}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {isLoading ? (
                  <div className="flex items-center space-x-2 relative z-10">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving... 💕</span>
                  </div>
                ) : isLastSection ? (
                  <>
                    <CheckCircle className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">Complete 💗</span>
                  </>
                ) : (
                  <>
                    <span className="relative z-10">Next</span>
                    <ArrowRight className="w-4 h-4 relative z-10" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
