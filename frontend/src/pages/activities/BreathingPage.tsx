import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';

const BreathingPage = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [phaseTime, setPhaseTime] = useState(4);

  // Timer effect
  useEffect(() => {
    let interval = null;

    if (isActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsActive(false);
            setIsPaused(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, timeLeft]);

  // Breathing phase effect
  useEffect(() => {
    if (!isActive || isPaused) return;

    const phaseInterval = setInterval(() => {
      setPhaseTime((prev) => {
        if (prev <= 1) {
          setBreathingPhase((currentPhase) => {
            if (currentPhase === 'inhale') return 'hold';
            if (currentPhase === 'hold') return 'exhale';
            return 'inhale';
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(phaseInterval);
  }, [isActive, isPaused]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    if (timeLeft === 0) {
      setTimeLeft(60);
      setBreathingPhase('inhale');
      setPhaseTime(4);
    }
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(60);
    setBreathingPhase('inhale');
    setPhaseTime(4);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBreathingText = () => {
    switch (breathingPhase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      default:
        return 'Breathe In';
    }
  };

  const getCircleScale = () => {
    switch (breathingPhase) {
      case 'inhale':
        return 'scale-125';
      case 'hold':
        return 'scale-125';
      case 'exhale':
        return 'scale-100';
      default:
        return 'scale-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-purple-50 to-blue-50 flex flex-col">
      {/* Back Button */}
      <div className="p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Activities
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-md w-full">
          {/* Timer Display */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Breathing Exercise</h1>
            <p className="text-lg text-gray-600 mb-8">1-minute guided breathing</p>
            
            <div className="text-6xl font-bold text-purple-600 mb-2">
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-gray-500">
              {isActive && !isPaused ? getBreathingText() : 'Ready to begin'}
            </div>
          </div>

          {/* Breathing Circle */}
          <div className="relative mb-12">
            <div className="w-48 h-48 mx-auto relative">
              {/* Outer glow */}
              <div className="absolute inset-0 bg-purple-200 rounded-full opacity-30 blur-xl"></div>
              
              {/* Main breathing circle */}
              <div
                className={`absolute inset-0 bg-gradient-to-br from-purple-400 to-teal-400 rounded-full shadow-lg transition-all duration-1000 ease-in-out ${getCircleScale()}`}
              >
                <div className="w-full h-full rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-2xl font-bold mb-1">
                      {isActive && !isPaused ? getBreathingText() : 'Ready'}
                    </div>
                    <div className="text-sm opacity-80">
                      {isActive && !isPaused ? `${phaseTime}s` : 'Click Start'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Animated particles when active */}
              {isActive && !isPaused && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                </div>
              )}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center gap-4">
            {!isActive || isPaused ? (
              <button
                onClick={handleStart}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-teal-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl"
              >
                <Play className="w-5 h-5" />
                {!isActive ? 'Start' : 'Resume'}
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl"
              >
                <Pause className="w-5 h-5" />
                Pause
              </button>
            )}

            <button
              onClick={handleReset}
              className="flex items-center gap-2 bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          </div>

          {/* Instructions */}
          {!isActive && (
            <div className="mt-12 p-6 bg-white/50 backdrop-blur-sm rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How to use:</h3>
              <div className="text-left space-y-2 text-sm text-gray-600">
                <p>• Click <strong>Start</strong> to begin the 1-minute breathing exercise</p>
                <p>• Follow the circle: <strong>Breathe In</strong> (4s) → <strong>Hold</strong> (4s) → <strong>Breathe Out</strong> (4s)</p>
                <p>• Use <strong>Pause</strong> if you need a break</p>
                <p>• Click <strong>Reset</strong> to start over</p>
              </div>
            </div>
          )}

          {/* Completion Message */}
          {timeLeft === 0 && !isActive && (
            <div className="mt-12 p-6 bg-gradient-to-r from-green-100 to-teal-100 rounded-xl">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Great job! 🎉</h3>
              <p className="text-green-700">You've completed your 1-minute breathing exercise.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BreathingPage;
