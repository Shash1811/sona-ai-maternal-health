import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, 
  Brain, Sparkles, Wind, ChevronLeft, ChevronRight,
  RotateCcw, CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

type SlideType = 'music' | 'games' | 'breathing';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.95
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.95
  })
};

// ============================================================================
// SLIDE 1: SOOTHING MUSIC
// ============================================================================

const MusicSlide = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35);
  const [volume, setVolume] = useState(75);
  
  // Simulate progress when playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => (p >= 100 ? 0 : p + 0.5));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-4xl mx-auto px-8">
      {/* Ambient Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-12 relative z-10"
      >
        <h2 className="text-4xl font-light text-slate-800 mb-2">Ocean Waves</h2>
        <p className="text-slate-500 text-lg">Calm your mind with soothing sounds</p>
      </motion.div>

      {/* Animated Visualizer */}
      <motion.div 
        className="relative mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
      >
        <div className="w-64 h-64 rounded-full bg-gradient-to-br from-slate-50 to-slate-100 shadow-2xl flex items-center justify-center relative overflow-hidden">
          {/* Pulsing Rings */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border-2 border-blue-200/50"
              animate={isPlaying ? {
                scale: [1, 1.5 + i * 0.3, 1],
                opacity: [0.6, 0, 0.6]
              } : {}}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                delay: i * 0.8,
                ease: "easeOut"
              }}
              style={{ width: '60%', height: '60%' }}
            />
          ))}
          
          {/* Center Orb */}
          <motion.div
            className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 via-purple-400 to-indigo-500 shadow-lg flex items-center justify-center"
            animate={isPlaying ? {
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0]
            } : {}}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Wind className="w-12 h-12 text-white/90" />
          </motion.div>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div 
        className="w-full max-w-md space-y-6 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-500">
            <span>{Math.floor((progress / 100) * 3)}:{String(Math.floor((progress % 100) / 100 * 60)).padStart(2, '0')}</span>
            <span>3:45</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
              style={{ width: `${progress}%` }}
              layoutId="progress"
            />
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-6">
          <button className="p-3 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
            <SkipBack className="w-6 h-6" />
          </button>
          
          <motion.button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl flex items-center justify-center hover:shadow-2xl transition-shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
          </motion.button>
          
          <button className="p-3 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3 px-4">
          <Volume2 className="w-5 h-5 text-slate-400" />
          <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
              style={{ width: `${volume}%` }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ============================================================================
// SLIDE 2: BRAIN GAMES (Memory Match)
// ============================================================================

const BrainGamesSlide = () => {
  const emojis = ['🌸', '🌙', '🦋', '🌿', '🌸', '🌙', '🦋', '🌿'];
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [gameKey, setGameKey] = useState(0);

  // Initialize game
  useEffect(() => {
    const shuffled = emojis
      .map((emoji, id) => ({ id, emoji, isFlipped: false, isMatched: false }))
      .sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedIndices([]);
    setMoves(0);
    setIsWon(false);
  }, [gameKey]);

  // Check for matches
  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [first, second] = flippedIndices;
      if (cards[first]?.emoji === cards[second]?.emoji) {
        setTimeout(() => {
          setCards(prev => prev.map((card, idx) => 
            idx === first || idx === second ? { ...card, isMatched: true } : card
          ));
          setFlippedIndices([]);
        }, 600);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map((card, idx) => 
            idx === first || idx === second ? { ...card, isFlipped: false } : card
          ));
          setFlippedIndices([]);
        }, 1000);
      }
    }
  }, [flippedIndices, cards]);

  // Check win condition
  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.isMatched)) {
      setIsWon(true);
    }
  }, [cards]);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;
    
    setCards(prev => prev.map((card, idx) => 
      idx === index ? { ...card, isFlipped: true } : card
    ));
    setFlippedIndices(prev => [...prev, index]);
    if (flippedIndices.length === 0) setMoves(m => m + 1);
  };

  const resetGame = () => setGameKey(k => k + 1);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-4xl mx-auto px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 mb-4">
          <Brain className="w-5 h-5" />
          <span className="text-sm font-medium">Memory Match</span>
        </div>
        <h2 className="text-4xl font-light text-slate-800 mb-2">Train Your Brain</h2>
        <p className="text-slate-500">Match the pairs to improve focus and memory</p>
      </motion.div>

      {/* Game Stats */}
      <motion.div 
        className="flex items-center gap-8 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
      >
        <div className="text-center">
          <p className="text-3xl font-light text-slate-800">{moves}</p>
          <p className="text-sm text-slate-400">Moves</p>
        </div>
        <div className="w-px h-12 bg-slate-200" />
        <div className="text-center">
          <p className="text-3xl font-light text-slate-800">{cards.filter(c => c.isMatched).length / 2}</p>
          <p className="text-sm text-slate-400">Pairs Found</p>
        </div>
        <div className="w-px h-12 bg-slate-200" />
        <button 
          onClick={resetGame}
          className="p-3 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </motion.div>

      {/* Game Grid */}
      <motion.div 
        className="grid grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        {cards.map((card, index) => (
          <motion.button
            key={`${gameKey}-${index}`}
            onClick={() => handleCardClick(index)}
            className={cn(
              "relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl transition-all duration-300",
              card.isMatched 
                ? "bg-emerald-50 border-2 border-emerald-200" 
                : "bg-white border-2 border-slate-100 hover:border-indigo-200 shadow-sm hover:shadow-md"
            )}
            whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
            whileTap={{ scale: card.isMatched ? 1 : 0.95 }}
          >
            <AnimatePresence mode="wait">
              {(card.isFlipped || card.isMatched) ? (
                <motion.span
                  key="front"
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: -90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-3xl sm:text-4xl absolute inset-0 flex items-center justify-center"
                >
                  {card.emoji}
                </motion.span>
              ) : (
                <motion.div
                  key="back"
                  initial={{ rotateY: -90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: 90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Sparkles className="w-8 h-8 text-slate-300" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </motion.div>

      {/* Win Message */}
      <AnimatePresence>
        {isWon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mt-8 flex items-center gap-3 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-full"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-medium">Congratulations! You matched all pairs!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// SLIDE 3: STRESS RELIEVER (Breathing Exercise)
// ============================================================================

const BreathingSlide = () => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [isActive, setIsActive] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const phases: Array<{ phase: 'inhale' | 'hold' | 'exhale'; duration: number }> = [
      { phase: 'inhale', duration: 4 },
      { phase: 'hold', duration: 4 },
      { phase: 'exhale', duration: 4 }
    ];
    
    let currentPhaseIndex = 0;
    let currentTimer = 0;
    
    const interval = setInterval(() => {
      currentTimer++;
      setTimer(currentTimer);
      
      const currentPhase = phases[currentPhaseIndex];
      
      if (currentTimer >= currentPhase.duration) {
        currentTimer = 0;
        currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
        setPhase(phases[currentPhaseIndex].phase);
        
        if (currentPhaseIndex === 0) {
          setCycleCount(c => c + 1);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Inhale...';
      case 'hold': return 'Hold...';
      case 'exhale': return 'Exhale...';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'from-teal-400 to-cyan-400';
      case 'hold': return 'from-cyan-400 to-blue-400';
      case 'exhale': return 'from-blue-400 to-indigo-400';
    }
  };

  const getScale = () => {
    switch (phase) {
      case 'inhale': return 1.5;
      case 'hold': return 1.5;
      case 'exhale': return 1;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-4xl mx-auto px-8">
      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-gradient-to-br from-teal-200/30 to-cyan-200/30 rounded-full blur-3xl"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-12 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-teal-600 mb-4">
          <Wind className="w-5 h-5" />
          <span className="text-sm font-medium">Box Breathing</span>
        </div>
        <h2 className="text-4xl font-light text-slate-800 mb-2">Find Your Calm</h2>
        <p className="text-slate-500">Breathe with the orb to reduce stress</p>
      </motion.div>

      {/* Breathing Orb */}
      <motion.div 
        className="relative mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
      >
        {/* Outer Glow Rings */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-200/20 to-cyan-200/20"
          animate={isActive ? { scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] } : {}}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: '120%', height: '120%', left: '-10%', top: '-10%' }}
        />
        
        {/* Main Orb */}
        <motion.div
          className={cn(
            "w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br shadow-2xl flex items-center justify-center relative",
            getPhaseColor()
          )}
          animate={isActive ? {
            scale: getScale(),
            boxShadow: phase === 'inhale' 
              ? '0 0 60px rgba(45, 212, 191, 0.5)' 
              : phase === 'hold'
              ? '0 0 60px rgba(45, 212, 191, 0.5)'
              : '0 0 30px rgba(99, 102, 241, 0.3)'
          } : { scale: 1 }}
          transition={{ duration: 4, ease: "easeInOut" }}
        >
          {/* Inner Glow */}
          <div className="absolute inset-4 rounded-full bg-white/20 backdrop-blur-sm" />
          
          {/* Center Text */}
          <div className="relative z-10 text-center">
            <motion.p 
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-2xl font-light text-white drop-shadow-lg"
            >
              {isActive ? getPhaseText() : 'Ready?'}
            </motion.p>
            {isActive && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white/80 text-sm mt-1"
              >
                {4 - (timer % 4)}s
              </motion.p>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Controls */}
      <motion.div 
        className="flex flex-col items-center gap-6 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        <motion.button
          onClick={() => {
            if (isActive) {
              setIsActive(false);
              setPhase('inhale');
              setTimer(0);
            } else {
              setIsActive(true);
              setCycleCount(0);
            }
          }}
          className={cn(
            "px-8 py-4 rounded-full font-medium text-lg transition-all shadow-lg hover:shadow-xl",
            isActive 
              ? "bg-white text-slate-700 border-2 border-slate-200 hover:bg-slate-50"
              : "bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isActive ? 'Stop Exercise' : 'Start Breathing'}
        </motion.button>

        {cycleCount > 0 && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-slate-500 text-sm"
          >
            Completed {cycleCount} breathing cycle{cycleCount !== 1 ? 's' : ''}
          </motion.p>
        )}

        {/* Breathing Guide */}
        <div className="flex gap-4 mt-4">
          {['Inhale', 'Hold', 'Exhale'].map((step, i) => (
            <div 
              key={step}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors",
                phase === step.toLowerCase() && isActive
                  ? "bg-teal-100 text-teal-700"
                  : "bg-slate-100 text-slate-500"
              )}
            >
              <span className={cn(
                "w-2 h-2 rounded-full",
                phase === step.toLowerCase() && isActive ? "bg-teal-500" : "bg-slate-300"
              )} />
              {step}
              <span className="text-xs opacity-60">4s</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const slides: { id: SlideType; title: string; component: React.FC }[] = [
  { id: 'music', title: 'Soothing Music', component: MusicSlide },
  { id: 'games', title: 'Brain Games', component: BrainGamesSlide },
  { id: 'breathing', title: 'Stress Reliever', component: BreathingSlide }
];

const MindfulSlides = () => {
  const [[currentIndex, direction], setCurrentIndex] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    const newIndex = currentIndex + newDirection;
    if (newIndex >= 0 && newIndex < slides.length) {
      setCurrentIndex([newIndex, newDirection]);
    } else if (newIndex < 0) {
      setCurrentIndex([slides.length - 1, newDirection]);
    } else {
      setCurrentIndex([0, newDirection]);
    }
  };

  const CurrentSlide = slides[currentIndex].component;

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 overflow-hidden">
      {/* Subtle Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      {/* Main Content Area */}
      <div className="relative w-full h-full flex items-center justify-center px-16">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 }
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <CurrentSlide />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 
        =========================================================
        NEW: Side Navigation Arrows 
        =========================================================
      */}
      <motion.button
        onClick={() => paginate(-1)}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/50 backdrop-blur-md border border-white/50 shadow-lg flex items-center justify-center text-slate-700 hover:bg-white/90 hover:scale-110 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronLeft className="w-8 h-8 ml-[-2px]" />
      </motion.button>

      <motion.button
        onClick={() => paginate(1)}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/50 backdrop-blur-md border border-white/50 shadow-lg flex items-center justify-center text-slate-700 hover:bg-white/90 hover:scale-110 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronRight className="w-8 h-8 mr-[-2px]" />
      </motion.button>

      {/* Bottom Glassmorphism Navigation (Kept as pagination indicator) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50">
        {/* Slide Indicators */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => setCurrentIndex([index, index > currentIndex ? 1 : -1])}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                index === currentIndex 
                  ? "w-8 bg-gradient-to-r from-indigo-500 to-purple-500" 
                  : "bg-slate-300 hover:bg-slate-400"
              )}
            />
          ))}
        </div>
      </div>

      {/* Progress Dots - Top Right */}
      <div className="absolute top-8 right-8 flex items-center gap-2 z-50">
        <span className="text-sm text-slate-400 font-medium bg-white/50 px-3 py-1 rounded-full backdrop-blur-md shadow-sm">
          {currentIndex + 1} / {slides.length}
        </span>
      </div>

      {/* Slide Title - Top Left */}
      <div className="absolute top-8 left-8 z-50">
        <motion.h1 
          key={currentIndex}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-light text-slate-800"
        >
          <span className="font-medium">Mindful</span> Moments
        </motion.h1>
        <motion.p
          key={`subtitle-${currentIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-slate-500 mt-1 font-medium"
        >
          {slides[currentIndex].title}
        </motion.p>
      </div>
    </div>
  );
};

export default MindfulSlides;