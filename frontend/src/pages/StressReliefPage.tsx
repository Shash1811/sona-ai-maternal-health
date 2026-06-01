import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wind,
  ChevronLeft,
  Heart,
  Moon,
  Play,
  Pause,
  Volume2,
  VolumeX,
  CheckCircle2,
  Flame,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ======================================================
// STORAGE HELPERS
// ======================================================

const getStoredValue = (key: string, defaultValue: number): number => {
  if (typeof window === 'undefined') return defaultValue;
  const saved = localStorage.getItem(key);
  return saved ? Number(saved) : defaultValue;
};

// ======================================================
// DATA & QUOTES
// ======================================================

const quotes = [
  "Breathe in calm, breathe out stress.",
  "You deserve moments of peace.",
  "Small pauses create big healing.",
  "Relaxation is productive too.",
  "Your mind deserves kindness.",
];

const activities = [
  {
    id: 'breathing',
    name: 'Breathing',
    icon: Wind,
    desc: 'Calm rhythmic breathing',
  },
  {
    id: 'visualization',
    name: 'Visualization',
    icon: Moon,
    desc: 'Guided peaceful imagery',
  },
];

// ======================================================
// BREATHING EXERCISE COMPONENT
// ======================================================

const BreathingExercise = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [isActive, setIsActive] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const phases: { type: 'inhale' | 'hold' | 'exhale'; duration: number }[] = [
      { type: 'inhale', duration: 4000 },
      { type: 'hold', duration: 4000 },
      { type: 'exhale', duration: 4000 },
    ];

    let currentIndex = 0;

    const runPhase = () => {
      const current = phases[currentIndex];
      setPhase(current.type);

      timeoutId = setTimeout(() => {
        if (currentIndex === phases.length - 1) {
          setCycleCount((prev) => {
            const updated = prev + 1;
            if (updated >= 5) {
              setIsActive(false);
              onComplete();
              return 5;
            }
            return updated;
          });
          currentIndex = 0;
        } else {
          currentIndex++;
        }
        runPhase();
      }, current.duration);
    };

    let timeoutId = setTimeout(runPhase, 0);

    return () => clearTimeout(timeoutId);
  }, [isActive, onComplete]);

  const getText = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      default: return 'Ready?';
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 min-h-[450px] flex flex-col justify-center items-center">
      <div className="text-center">
        <motion.div
          animate={{
            scale: isActive ? (phase === 'inhale' || phase === 'hold' ? 1.4 : 1) : 1,
          }}
          transition={{ duration: 4, ease: "easeInOut" }}
          className="w-52 h-52 mx-auto rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-2xl relative"
        >
           {/* Decorative pulse ring */}
           {isActive && (
            <motion.div 
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute inset-0 rounded-full bg-teal-300 -z-10"
            />
          )}
          <div className="text-white text-center">
            <p className="text-2xl font-bold">{getText()}</p>
          </div>
        </motion.div>

        <div className="mt-12">
          <div className="flex justify-center gap-3 mb-8">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={false}
                animate={{ scale: i < cycleCount ? 1.2 : 1 }}
                className={cn(
                  "w-4 h-4 rounded-full transition-colors duration-500",
                  i < cycleCount ? "bg-teal-500" : "bg-slate-200"
                )}
              />
            ))}
          </div>

          <Button
            onClick={() => {
              if (cycleCount >= 5) setCycleCount(0);
              setIsActive(!isActive);
            }}
            className="rounded-full px-12 py-7 text-xl shadow-lg hover:shadow-teal-200 transition-all"
            variant={isActive ? "outline" : "default"}
          >
            {isActive ? <><Pause className="mr-2" /> Pause</> : <><Play className="mr-2" /> Start</>}
          </Button>
        </div>
      </div>
    </div>
  );
};

// ======================================================
// VISUALIZATION COMPONENT
// ======================================================

const Visualization = ({ onComplete }: { onComplete: () => void }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsPlaying(false);
          onComplete();
          return 100;
        }
        return prev + 0.5; // Slower progress for visualization
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, onComplete]);

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      <div className="h-72 rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center text-8xl shadow-inner relative overflow-hidden">
        <motion.div 
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.1, 1] }} 
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"
        />
        <span className="relative z-10">🌌</span>
      </div>

      <div className="mt-8">
        <div className="flex justify-between text-sm mb-2 text-slate-500 font-medium">
          <span>Mindfulness Journey</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
          <motion.div
            className="h-full bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600"
            style={{ width: `${progress}%` }}
          />
        </div>

        <Button
          onClick={() => setIsPlaying(!isPlaying)}
          className="mt-8 rounded-full px-10 py-6 text-lg w-full md:w-auto"
        >
          {isPlaying ? (
            <><Pause className="w-5 h-5 mr-2" /> Pause Journey</>
          ) : (
            <><Play className="w-5 h-5 mr-2" /> Start Visualization</>
          )}
        </Button>
      </div>
    </div>
  );
};

// ======================================================
// MAIN STRESS RELIEF PAGE
// ======================================================

const StressReliefPage = () => {
  const navigate = useNavigate();
  const [activeActivity, setActiveActivity] = useState('breathing');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [calmLevel, setCalmLevel] = useState(85);

  const [sessionsCompleted, setSessionsCompleted] = useState(() =>
    getStoredValue('sessionsCompleted', 0)
  );

  const [streakDays, setStreakDays] = useState(() =>
    getStoredValue('streakDays', 3)
  );

  const [dailyQuote] = useState(
    () => quotes[Math.floor(Math.random() * quotes.length)]
  );

  useEffect(() => {
    localStorage.setItem('sessionsCompleted', sessionsCompleted.toString());
  }, [sessionsCompleted]);

  useEffect(() => {
    localStorage.setItem('streakDays', streakDays.toString());
  }, [streakDays]);

  const handleComplete = () => {
    setSessionsCompleted((prev) => prev + 1);
    setCalmLevel((prev) => Math.min(prev + 5, 100));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-100 pb-20">
      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ChevronLeft />
            </Button>

            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center shadow-md">
              <Heart className="text-white w-5 h-5" fill="currentColor" />
            </div>

            <div className="hidden sm:block">
              <h1 className="font-bold text-lg leading-none">Stress Relief</h1>
              <p className="text-xs text-slate-500 mt-1">Relax • Recharge • Heal</p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="rounded-full border-slate-200"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* HERO SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-xl p-8 mb-8 border border-white/50"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-6 tracking-tight">
                Take a Moment <br className="hidden md:block" /> 
                <span className="text-teal-500">for Yourself 🌿</span>
              </h2>

              <p className="text-slate-600 text-lg max-w-2xl leading-relaxed">
                Relax your body, calm your thoughts, and recharge your energy through
                guided stress relief activities designed to restore balance.
              </p>

              <div className="mt-8 bg-slate-50 rounded-2xl p-5 border border-slate-100 inline-block">
                <p className="italic text-slate-500 font-medium">
                  "{dailyQuote}"
                </p>
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="text-[120px] filter drop-shadow-2xl"
            >
              🧘
            </motion.div>
          </div>
        </motion.div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Sessions Completed', val: sessionsCompleted, icon: Wind, color: 'text-teal-500', bg: 'bg-teal-50' },
            { label: 'Day Streak', val: streakDays, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
            { label: 'Calm Level', val: `${calmLevel}%`, icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-5">
              <div className={cn("p-4 rounded-2xl", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <div>
                <p className="text-3xl font-black text-slate-800">{stat.val}</p>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* INTERACTIVE AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* SIDEBAR NAVIGATION */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-2">Choose Method</h3>
            {activities.map((activity) => (
              <button
                key={activity.id}
                onClick={() => setActiveActivity(activity.id)}
                className={cn(
                  "w-full bg-white rounded-3xl p-6 shadow-sm transition-all text-left border-2",
                  activeActivity === activity.id 
                    ? "border-teal-400 ring-4 ring-teal-50 shadow-md" 
                    : "border-transparent hover:border-slate-200"
                )}
              >
                <div className="flex items-center gap-5">
                  <div className={cn(
                    "p-3 rounded-2xl",
                    activeActivity === activity.id ? "bg-teal-500 text-white" : "bg-slate-100 text-slate-500"
                  )}>
                    <activity.icon className="w-6 h-6" />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">
                      {activity.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {activity.desc}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* ACTIVITY DISPLAY */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeActivity}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                {activeActivity === 'breathing' ? (
                  <BreathingExercise onComplete={handleComplete} />
                ) : (
                  <Visualization onComplete={handleComplete} />
                )}
              </motion.div>
            </AnimatePresence>

            {/* BENEFITS CARD */}
            <div className="mt-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Wind className="w-32 h-32" />
              </div>
              <h3 className="text-2xl font-bold mb-6 relative z-10">
                Benefits of Daily Relaxation
              </h3>

              <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 relative z-10">
                {[
                  "Improves focus & concentration",
                  "Reduces anxiety & heart rate",
                  "Boosts deep sleep quality",
                  "Lowers cortisol (stress) levels",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StressReliefPage;