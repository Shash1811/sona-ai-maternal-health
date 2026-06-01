import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Heart, 
  Smile, 
  Frown, 
  Meh, 
  AlertCircle,
  Calendar,
  TrendingUp,
  BookOpen,
  Music,
  Wind,
  Sparkles,
  Plus,
  X,
  Send
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MoodEntry {
  id: number;
  date: string;
  mood: number;
  feelings: string[];
  note: string;
  triggers?: string;
}

const moodOptions = [
  { value: 1, emoji: '😢', label: 'Very Low', color: 'bg-red-100 text-red-700' },
  { value: 2, emoji: '😔', label: 'Low', color: 'bg-orange-100 text-orange-700' },
  { value: 3, emoji: '😐', label: 'Okay', color: 'bg-yellow-100 text-yellow-700' },
  { value: 4, emoji: '🙂', label: 'Good', color: 'bg-green-100 text-green-700' },
  { value: 5, emoji: '😊', label: 'Great', color: 'bg-emerald-100 text-emerald-700' },
];

const feelingOptions = [
  'Anxious', 'Stressed', 'Tired', 'Overwhelmed', 'Lonely',
  'Hopeful', 'Grateful', 'Excited', 'Peaceful', 'Energetic',
  'Nauseous', 'Achy', 'Restless', 'Content', 'Worried'
];

const copingStrategies = [
  { icon: Wind, title: 'Deep Breathing', desc: '5 minutes of calming breaths', action: '/activities/breathing' },
  { icon: Music, title: 'Calming Music', desc: 'Listen to soothing melodies', action: '/music' },
  { icon: BookOpen, title: 'Journaling', desc: 'Write down your thoughts', action: null },
  { icon: Heart, title: 'Self-Compassion', desc: 'Practice self-kindness', action: null },
];

export const MentalWellnessPage: React.FC = () => {
  const navigate = useNavigate();
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [triggers, setTriggers] = useState('');

  // Load entries from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mood_entries');
    if (saved) {
      setMoodEntries(JSON.parse(saved));
    }
  }, []);

  // Save entries to localStorage
  useEffect(() => {
    localStorage.setItem('mood_entries', JSON.stringify(moodEntries));
  }, [moodEntries]);

  const addEntry = () => {
    if (!selectedMood) return;

    const entry: MoodEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      mood: selectedMood,
      feelings: selectedFeelings,
      note,
      triggers
    };

    setMoodEntries([entry, ...moodEntries]);
    setShowAddModal(false);
    setSelectedMood(null);
    setSelectedFeelings([]);
    setNote('');
    setTriggers('');
  };

  const toggleFeeling = (feeling: string) => {
    setSelectedFeelings(prev => 
      prev.includes(feeling) 
        ? prev.filter(f => f !== feeling)
        : [...prev, feeling]
    );
  };

  // Get today's mood
  const todayEntry = moodEntries.find(e => 
    new Date(e.date).toDateString() === new Date().toDateString()
  );

  // Calculate average mood
  const averageMood = moodEntries.length > 0
    ? moodEntries.reduce((acc, e) => acc + e.mood, 0) / moodEntries.length
    : 0;

  // Prepare chart data (last 14 days)
  const chartData = [...moodEntries]
    .slice(0, 14)
    .reverse()
    .map(e => ({
      date: new Date(e.date).toLocaleDateString('en-US', { weekday: 'short' }),
      mood: e.mood,
    }));

  // Get mood trend
  const getTrend = () => {
    if (moodEntries.length < 3) return 'neutral';
    const recent = moodEntries.slice(0, 3).reduce((acc, e) => acc + e.mood, 0) / 3;
    const previous = moodEntries.slice(3, 6).reduce((acc, e) => acc + e.mood, 0) / 3 || recent;
    if (recent > previous + 0.5) return 'improving';
    if (recent < previous - 0.5) return 'declining';
    return 'stable';
  };

  const trend = getTrend();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-purple-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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
                <h1 className="text-2xl font-bold text-gray-900">Mental Wellness</h1>
                <p className="text-sm text-gray-500">Mood tracking & self-care</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white shadow-lg"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Today's Mood Card */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-6 text-white shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-1">How are you feeling today?</h2>
              <p className="text-purple-100 text-sm">
                {todayEntry 
                  ? `You rated today as ${moodOptions.find(m => m.value === todayEntry.mood)?.label.toLowerCase()}`
                  : "Track your mood to see patterns over time"}
              </p>
            </div>
            <div className="text-4xl">
              {todayEntry 
                ? moodOptions.find(m => m.value === todayEntry.mood)?.emoji 
                : '🤔'}
            </div>
          </div>
          {!todayEntry && (
            <Button
              onClick={() => setShowAddModal(true)}
              className="mt-4 bg-white text-purple-600 hover:bg-purple-50 rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Log Today's Mood
            </Button>
          )}
        </motion.div>
      </div>

      {/* Stats */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-pink-500" />
              <span className="text-sm text-gray-600">Average Mood</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {averageMood > 0 ? averageMood.toFixed(1) : '-'}
            </p>
            <p className="text-xs text-gray-500">/ 5.0 (Last 30 days)</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-5 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <span className="text-sm text-gray-600">Trend</span>
            </div>
            <p className="text-lg font-bold text-gray-900 capitalize">
              {trend === 'improving' ? '📈 Improving' : trend === 'declining' ? '📉 Declining' : '➡️ Stable'}
            </p>
            <p className="text-xs text-gray-500">
              {trend === 'improving' ? 'Great progress!' : trend === 'declining' ? 'Take some self-care time' : 'Consistent mood'}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mood Chart */}
      {chartData.length > 1 && (
        <div className="max-w-4xl mx-auto px-4 mt-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mood History</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={10} />
                  <YAxis domain={[1, 5]} fontSize={10} tickFormatter={(v) => moodOptions.find(m => m.value === v)?.emoji || v} />
                  <Tooltip formatter={(v: number) => [moodOptions.find(m => m.value === v)?.label, 'Mood']} />
                  <Line 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="#9333ea" 
                    strokeWidth={3} 
                    dot={{ fill: '#9333ea', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Coping Strategies */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Self-Care Strategies</h3>
        <div className="grid grid-cols-2 gap-4">
          {copingStrategies.map((strategy, index) => (
            <motion.div
              key={strategy.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => strategy.action && navigate(strategy.action)}
              className={`bg-white rounded-2xl p-4 shadow-lg border-2 border-purple-100 ${
                strategy.action ? 'cursor-pointer hover:border-purple-300' : ''
              }`}
            >
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
                <strategy.icon className="w-5 h-5 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 text-sm">{strategy.title}</h4>
              <p className="text-xs text-gray-500 mt-1">{strategy.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Entries */}
      <div className="max-w-4xl mx-auto px-4 mt-6 pb-20">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Entries</h3>
        {moodEntries.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <Smile className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No mood entries yet</p>
            <Button 
              onClick={() => setShowAddModal(true)}
              className="mt-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500"
            >
              Log Your First Mood
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {moodEntries.slice(0, 10).map((entry) => {
              const moodOption = moodOptions.find(m => m.value === entry.mood);
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`rounded-2xl p-4 border-2 ${moodOption?.color.replace('text', 'border').replace('700', '200').replace('bg-', 'bg-')}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{moodOption?.emoji}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{moodOption?.label}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                      </div>
                      {entry.feelings.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {entry.feelings.map(feeling => (
                            <span key={feeling} className="text-xs bg-white/50 px-2 py-0.5 rounded-full">
                              {feeling}
                            </span>
                          ))}
                        </div>
                      )}
                      {entry.note && (
                        <p className="text-sm text-gray-600 mt-2 italic">"{entry.note}"</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Mood Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">How are you feeling?</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mood Selector */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-3 block">Select your mood</label>
                <div className="grid grid-cols-5 gap-2">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood.value}
                      onClick={() => setSelectedMood(mood.value)}
                      className={`p-3 rounded-xl transition-all ${
                        selectedMood === mood.value 
                          ? 'bg-purple-500 text-white scale-110 shadow-lg' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <div className="text-2xl">{mood.emoji}</div>
                      <div className="text-xs mt-1">{mood.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Feelings */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-3 block">What are you feeling?</label>
                <div className="flex flex-wrap gap-2">
                  {feelingOptions.map((feeling) => (
                    <button
                      key={feeling}
                      onClick={() => toggleFeeling(feeling)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        selectedFeelings.includes(feeling)
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {feeling}
                    </button>
                  ))}
                </div>
              </div>

              {/* Triggers */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Any triggers or stressors?
                </label>
                <Input
                  value={triggers}
                  onChange={(e) => setTriggers(e.target.value)}
                  placeholder="e.g., work stress, lack of sleep..."
                  className="rounded-xl"
                />
              </div>

              {/* Note */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Journal entry (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Write about your day..."
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 outline-none resize-none h-24"
                />
              </div>

              <Button
                onClick={addEntry}
                disabled={!selectedMood}
                className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-6 disabled:opacity-50"
              >
                <Send className="w-4 h-4 mr-2" />
                Save Entry
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MentalWellnessPage;
