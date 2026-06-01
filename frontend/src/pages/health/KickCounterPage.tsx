import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Baby, Clock, History, RotateCcw, Info, Play, Pause } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface KickSession {
  id: number;
  date: string;
  duration: number;
  kicks: number;
  note?: string;
}

export const KickCounterPage: React.FC = () => {
  const navigate = useNavigate();
  const [kicks, setKicks] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [sessions, setSessions] = useState<KickSession[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load sessions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('kick_sessions');
    if (saved) {
      setSessions(JSON.parse(saved));
    }
  }, []);

  // Timer
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleKick = () => {
    if (!isActive) {
      setIsActive(true);
    }
    setKicks(prev => prev + 1);
  };

  const handleReset = () => {
    if (kicks > 0) {
      const newSession: KickSession = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        duration: elapsedTime,
        kicks: kicks,
        note: kicks >= 10 ? 'Good activity!' : kicks >= 6 ? 'Normal activity' : 'Monitor closely'
      };
      const updatedSessions = [newSession, ...sessions].slice(0, 20);
      setSessions(updatedSessions);
      localStorage.setItem('kick_sessions', JSON.stringify(updatedSessions));
    }
    setKicks(0);
    setElapsedTime(0);
    setIsActive(false);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

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
                <h1 className="text-2xl font-bold text-gray-900">Kick Counter</h1>
                <p className="text-sm text-gray-500">Track your baby's movements</p>
              </div>
            </div>
            <button 
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 rounded-full hover:bg-purple-100 transition-colors"
            >
              <Info className="w-6 h-6 text-purple-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Info Banner */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-4xl mx-auto px-4 mt-4"
          >
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <h3 className="font-semibold text-blue-900 mb-2">About Kick Counting</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Start counting after 28 weeks of pregnancy</li>
                <li>• Count kicks for 1-2 hours daily</li>
                <li>• You should feel 6-10 kicks in 2 hours</li>
                <li>• Contact doctor if kicks decrease significantly</li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Counter */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100"
        >
          {/* Timer */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 text-gray-500 mb-2">
              <Clock className="w-5 h-5" />
              <span className="text-lg">Duration</span>
            </div>
            <div className="text-5xl font-bold text-gray-800 font-mono">
              {formatTime(elapsedTime)}
            </div>
            <button
              onClick={toggleTimer}
              className="mt-3 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
          </div>

          {/* Kick Count Display */}
          <div className="text-center mb-8">
            <motion.div 
              key={kicks}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500"
            >
              {kicks}
            </motion.div>
            <p className="text-xl text-gray-600 mt-2">Kicks</p>
          </div>

          {/* Status Indicator */}
          <div className="text-center mb-8">
            {kicks === 0 && (
              <p className="text-gray-500">Tap the button when you feel a kick</p>
            )}
            {kicks > 0 && kicks < 6 && (
              <p className="text-yellow-600 bg-yellow-50 px-4 py-2 rounded-full inline-block">
                Continue counting... (Need 6+ kicks in 2 hours)
              </p>
            )}
            {kicks >= 6 && kicks < 10 && (
              <p className="text-green-600 bg-green-50 px-4 py-2 rounded-full inline-block">
                Good! Normal activity level
              </p>
            )}
            {kicks >= 10 && (
              <p className="text-purple-600 bg-purple-50 px-4 py-2 rounded-full inline-block">
                Excellent! Baby is very active! 🎉
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleKick}
              className="w-full py-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl font-semibold text-xl shadow-lg shadow-purple-200"
            >
              <div className="flex items-center justify-center gap-3">
                <Baby className="w-8 h-8" />
                I Felt a Kick!
              </div>
            </motion.button>
            
            <div className="flex gap-3">
              <Button
                onClick={() => setShowHistory(!showHistory)}
                variant="outline"
                className="flex-1 rounded-xl border-purple-200"
              >
                <History className="w-4 h-4 mr-2" />
                {showHistory ? 'Hide' : 'Show'} History
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex-1 rounded-xl border-red-200 text-red-600 hover:bg-red-50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Save & Reset
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* History */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="max-w-4xl mx-auto px-4 mt-6 pb-20"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Sessions</h3>
            {sessions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No sessions recorded yet</p>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-xl p-4 shadow-md border border-purple-100"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{session.kicks} kicks</p>
                        <p className="text-sm text-gray-500">{session.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-purple-600">{formatTime(session.duration)}</p>
                        {session.note && (
                          <p className="text-xs text-gray-500">{session.note}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KickCounterPage;
