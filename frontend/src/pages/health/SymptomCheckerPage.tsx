import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Stethoscope, AlertTriangle, CheckCircle, ArrowRight, RotateCcw, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface Symptom {
  id: string;
  text: string;
  category: 'urgent' | 'normal' | 'watch';
  severity: number;
}

const symptoms: Symptom[] = [
  { id: 'bleeding', text: 'Vaginal bleeding or spotting', category: 'urgent', severity: 5 },
  { id: 'severe_pain', text: 'Severe abdominal or pelvic pain', category: 'urgent', severity: 5 },
  { id: 'fever', text: 'High fever (above 100.4°F / 38°C)', category: 'urgent', severity: 4 },
  { id: 'headache', text: 'Severe headache with vision changes', category: 'urgent', severity: 5 },
  { id: 'swelling', text: 'Sudden swelling in face, hands, or feet', category: 'urgent', severity: 4 },
  { id: 'fluid', text: 'Leaking fluid (possible water breaking)', category: 'urgent', severity: 5 },
  { id: 'nausea', text: 'Severe nausea and vomiting', category: 'watch', severity: 3 },
  { id: 'reduced_kicks', text: 'Reduced baby movements after 28 weeks', category: 'urgent', severity: 4 },
  { id: 'burning', text: 'Burning sensation while urinating', category: 'normal', severity: 2 },
  { id: 'back_pain', text: 'Lower back pain', category: 'normal', severity: 1 },
  { id: 'constipation', text: 'Constipation', category: 'normal', severity: 1 },
  { id: 'heartburn', text: 'Heartburn or acid reflux', category: 'normal', severity: 1 },
  { id: 'fatigue', text: 'Fatigue or tiredness', category: 'normal', severity: 1 },
  { id: 'mood', text: 'Mood swings or anxiety', category: 'watch', severity: 2 },
  { id: 'leg_cramps', text: 'Leg cramps', category: 'normal', severity: 1 },
  { id: 'insomnia', text: 'Difficulty sleeping', category: 'normal', severity: 1 },
];

interface Result {
  level: 'emergency' | 'consult' | 'normal';
  title: string;
  message: string;
  action: string;
}

export const SymptomCheckerPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [weeksPregnant, setWeeksPregnant] = useState<string>('');

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const analyzeSymptoms = (): Result => {
    const selected = symptoms.filter(s => selectedSymptoms.includes(s.id));
    const hasUrgent = selected.some(s => s.category === 'urgent');
    const hasWatch = selected.some(s => s.category === 'watch');
    const maxSeverity = Math.max(...selected.map(s => s.severity), 0);

    if (hasUrgent || maxSeverity >= 4) {
      return {
        level: 'emergency',
        title: 'Seek Immediate Medical Attention',
        message: 'You have symptoms that require urgent medical care. Please contact your doctor immediately or visit the nearest emergency room.',
        action: 'Call Emergency Services'
      };
    } else if (hasWatch || selected.length >= 3) {
      return {
        level: 'consult',
        title: 'Consult Your Doctor',
        message: 'While not an emergency, you should discuss these symptoms with your healthcare provider at your earliest convenience.',
        action: 'Contact Doctor'
      };
    } else {
      return {
        level: 'normal',
        title: 'Common Pregnancy Symptoms',
        message: 'These are typical pregnancy discomforts. Rest, stay hydrated, and monitor. If symptoms worsen, consult your doctor.',
        action: 'Get Self-Care Tips'
      };
    }
  };

  const handleCheck = () => {
    if (selectedSymptoms.length > 0) {
      setShowResult(true);
    }
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setShowResult(false);
  };

  const result = showResult ? analyzeSymptoms() : null;

  const getSymptomColor = (category: string) => {
    switch (category) {
      case 'urgent': return 'border-red-300 bg-red-50 text-red-900';
      case 'watch': return 'border-yellow-300 bg-yellow-50 text-yellow-900';
      default: return 'border-green-300 bg-green-50 text-green-900';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-purple-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-purple-100 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-6 h-6 text-purple-700" />
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Symptom Checker</h1>
              <p className="text-sm text-gray-500">Quick health assessment</p>
            </div>
          </div>
        </div>
      </header>

      {/* Disclaimer */}
      <div className="max-w-4xl mx-auto px-4 mt-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-700">
            This is not a medical diagnosis. Always consult your healthcare provider for professional medical advice.
          </p>
        </div>
      </div>

      {/* Pregnancy Week Input */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            How many weeks pregnant are you? (Optional)
          </label>
          <input
            type="number"
            value={weeksPregnant}
            onChange={(e) => setWeeksPregnant(e.target.value)}
            placeholder="e.g., 24"
            className="w-full p-3 border-2 border-purple-200 rounded-xl focus:border-purple-400 outline-none"
            min="1"
            max="42"
          />
        </div>
      </div>

      {/* Symptoms Grid */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Select your symptoms
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({selectedSymptoms.length} selected)
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {symptoms.map((symptom) => (
            <motion.button
              key={symptom.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleSymptom(symptom.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                selectedSymptoms.includes(symptom.id)
                  ? 'border-purple-500 bg-purple-100 shadow-md'
                  : `border-gray-200 hover:border-purple-300 ${getSymptomColor(symptom.category)}`
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedSymptoms.includes(symptom.id)
                    ? 'border-purple-500 bg-purple-500'
                    : 'border-gray-300'
                }`}>
                  {selectedSymptoms.includes(symptom.id) && (
                    <CheckCircle className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className={selectedSymptoms.includes(symptom.id) ? 'text-purple-900' : ''}>
                  {symptom.text}
                </span>
              </div>
              {symptom.category === 'urgent' && !selectedSymptoms.includes(symptom.id) && (
                <span className="text-xs text-red-600 font-medium ml-8 mt-1 block">⚠️ Urgent</span>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="max-w-4xl mx-auto px-4 mt-8 pb-20">
        <div className="flex gap-4">
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex-1 rounded-xl border-gray-300"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={handleCheck}
            disabled={selectedSymptoms.length === 0}
            className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-6 disabled:opacity-50"
          >
            Check Symptoms
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Result Modal */}
      <AnimatePresence>
        {showResult && result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowResult(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`bg-white rounded-3xl p-8 w-full max-w-md text-center ${
                result.level === 'emergency' ? 'border-4 border-red-200' : 
                result.level === 'consult' ? 'border-4 border-yellow-200' : 
                'border-4 border-green-200'
              }`}
            >
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
                result.level === 'emergency' ? 'bg-red-100' : 
                result.level === 'consult' ? 'bg-yellow-100' : 
                'bg-green-100'
              }`}>
                {result.level === 'emergency' ? (
                  <AlertTriangle className="w-10 h-10 text-red-600" />
                ) : result.level === 'consult' ? (
                  <Stethoscope className="w-10 h-10 text-yellow-600" />
                ) : (
                  <CheckCircle className="w-10 h-10 text-green-600" />
                )}
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">{result.title}</h3>
              <p className="text-gray-600 mb-6">{result.message}</p>

              <div className="space-y-3">
                {result.level === 'emergency' && (
                  <Button
                    onClick={() => window.location.href = 'tel:108'}
                    className="w-full rounded-xl bg-red-600 hover:bg-red-700 text-white py-6"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Call Emergency (108)
                  </Button>
                )}
                {result.level === 'consult' && (
                  <Button
                    onClick={() => navigate('/contact-doctors')}
                    className="w-full rounded-xl bg-yellow-600 hover:bg-yellow-700 text-white py-6"
                  >
                    <Stethoscope className="w-5 h-5 mr-2" />
                    Contact Doctor
                  </Button>
                )}
                <Button
                  onClick={() => setShowResult(false)}
                  variant="outline"
                  className="w-full rounded-xl"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SymptomCheckerPage;
