import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, ChevronLeft, Trophy, Clock, RotateCcw,
  Star, Zap, Target, Sparkles, CheckCircle2,
  Lightbulb, Puzzle, Gamepad2, TrendingUp,
  Wind, Music, BookOpen, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ============================================================================
// GAME 1: MEMORY MATCH
// ============================================================================

interface MemoryCard {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const memoryEmojis = ['🧠', '❤️', '🍼', '🌟', '🦋', '🌸', '🧸', '🎨'];

const MemoryGame = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [timer, setTimer] = useState(0);
  const [gameKey, setGameKey] = useState(0);

  // Initialize game
  useEffect(() => {
    const shuffled = [...memoryEmojis, ...memoryEmojis]
      .map((emoji, id) => ({ id, emoji, isFlipped: false, isMatched: false }))
      .sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedIndices([]);
    setMoves(0);
    setIsWon(false);
    setTimer(0);
  }, [gameKey]);

  // Timer
  useEffect(() => {
    if (!isWon) {
      const interval = setInterval(() => setTimer(t => t + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [isWon]);

  // Check matches
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

  // Check win
  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.isMatched) && !isWon) {
      setIsWon(true);
      const score = Math.max(1000 - moves * 20 - timer * 2, 100);
      onComplete(score);
    }
  }, [cards, isWon, moves, timer, onComplete]);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;
    
    setCards(prev => prev.map((card, idx) => 
      idx === index ? { ...card, isFlipped: true } : card
    ));
    setFlippedIndices(prev => {
      if (prev.length === 0) {
        setMoves(m => m + 1);
        return [index];
      }
      return [...prev, index];
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-sm text-slate-500">Moves</p>
            <p className="text-2xl font-bold text-slate-800">{moves}</p>
          </div>
          <div className="w-px h-10 bg-slate-200" />
          <div>
            <p className="text-sm text-slate-500">Time</p>
            <p className="text-2xl font-bold text-slate-800">{formatTime(timer)}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setGameKey(k => k + 1)}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {cards.map((card, index) => (
          <motion.button
            key={`${gameKey}-${index}`}
            onClick={() => handleCardClick(index)}
            className={cn(
              "aspect-square rounded-xl transition-all duration-300 flex items-center justify-center text-3xl",
              card.isMatched 
                ? "bg-emerald-100 border-2 border-emerald-300" 
                : "bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-100 hover:border-indigo-300 shadow-sm"
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
                  className="text-indigo-300"
                >
                  <Sparkles className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {isWon && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center p-4 bg-emerald-50 rounded-xl"
          >
            <Trophy className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
            <p className="text-lg font-bold text-emerald-700">Congratulations!</p>
            <p className="text-emerald-600">You matched all pairs in {moves} moves!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// GAME 2: COLOR SEQUENCE (Simon Says)
// ============================================================================

const ColorSequenceGame = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const colors = [
    { name: 'green', bg: 'bg-emerald-400', active: 'bg-emerald-300', shadow: 'shadow-emerald-200' },
    { name: 'red', bg: 'bg-rose-400', active: 'bg-rose-300', shadow: 'shadow-rose-200' },
    { name: 'yellow', bg: 'bg-amber-400', active: 'bg-amber-300', shadow: 'shadow-amber-200' },
    { name: 'blue', bg: 'bg-blue-400', active: 'bg-blue-300', shadow: 'shadow-blue-200' }
  ];

  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  const startGame = () => {
    setSequence([Math.floor(Math.random() * 4)]);
    setPlayerSequence([]);
    setLevel(1);
    setGameOver(false);
    setIsPlaying(true);
  };

  const playSequence = useCallback(async () => {
    setIsPlaying(false);
    for (let i = 0; i < sequence.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 400));
      setActiveIndex(sequence[i]);
      await new Promise(resolve => setTimeout(resolve, 300));
      setActiveIndex(null);
    }
    setIsPlaying(true);
  }, [sequence]);

  useEffect(() => {
    if (sequence.length > 0 && !gameOver) {
      playSequence();
    }
  }, [sequence, playSequence, gameOver]);

  const handleColorClick = (index: number) => {
    if (!isPlaying || gameOver) return;

    const newPlayerSequence = [...playerSequence, index];
    setPlayerSequence(newPlayerSequence);

    if (sequence[newPlayerSequence.length - 1] !== index) {
      setGameOver(true);
      onComplete(level * 100);
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      setPlayerSequence([]);
      setLevel(l => l + 1);
      setTimeout(() => {
        setSequence(prev => [...prev, Math.floor(Math.random() * 4)]);
      }, 1000);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-slate-500">Level</p>
          <p className="text-3xl font-bold text-slate-800">{level}</p>
        </div>
        <Button onClick={startGame} disabled={sequence.length > 0 && !gameOver}>
          {sequence.length === 0 ? 'Start Game' : gameOver ? 'Try Again' : 'Playing...'}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
        {colors.map((color, index) => (
          <motion.button
            key={color.name}
            onClick={() => handleColorClick(index)}
            disabled={!isPlaying || gameOver}
            className={cn(
              "h-24 rounded-xl transition-all duration-150 shadow-lg",
              color.bg,
              activeIndex === index ? color.active : "",
              (!isPlaying || gameOver) && "opacity-70"
            )}
            whileTap={isPlaying && !gameOver ? { scale: 0.95 } : {}}
          />
        ))}
      </div>

      {gameOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-center p-4 bg-rose-50 rounded-xl"
        >
          <p className="text-lg font-bold text-rose-700">Game Over!</p>
          <p className="text-rose-600">You reached level {level}</p>
        </motion.div>
      )}

      {!isPlaying && sequence.length === 0 && (
        <div className="mt-6 text-center text-slate-500">
          <p>Watch the pattern, then repeat it!</p>
          <p className="text-sm mt-1">Each level adds a new step</p>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// GAME 3: WORD PUZZLE
// ============================================================================

const WordPuzzleGame = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const puzzles = [
    { scrambled: 'BYAB', answer: 'BABY', hint: 'Your little one!' },
    { scrambled: 'LOECV', answer: 'LOVE', hint: 'What you feel most' },
    { scrambled: 'MOM', answer: 'MOM', hint: 'That\'s you!' },
    { scrambled: 'RTAESH', answer: 'HEART', hint: 'Beats for two now' },
    { scrambled: 'MDREA', answer: 'DREAM', hint: 'Sweet nighttime visions' }
  ];

  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [solved, setSolved] = useState<number[]>([]);
  const [input, setInput] = useState('');
  const [showHint, setShowHint] = useState(false);

  const checkAnswer = () => {
    if (input.toUpperCase() === puzzles[currentPuzzle].answer) {
      const newSolved = [...solved, currentPuzzle];
      setSolved(newSolved);
      setInput('');
      setShowHint(false);
      
      if (newSolved.length === puzzles.length) {
        onComplete(500);
      } else {
        setCurrentPuzzle(prev => {
          let next = (prev + 1) % puzzles.length;
          while (newSolved.includes(next) && newSolved.length < puzzles.length) {
            next = (next + 1) % puzzles.length;
          }
          return next;
        });
      }
    }
  };

  const progress = (solved.length / puzzles.length) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-500">Progress</span>
          <span className="text-sm font-medium text-slate-700">{solved.length}/{puzzles.length}</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {solved.length < puzzles.length ? (
        <>
          <div className="text-center mb-6">
            <p className="text-sm text-slate-500 mb-2">Unscramble the letters:</p>
            <div className="flex justify-center gap-2 mb-4">
              {puzzles[currentPuzzle].scrambled.split('').map((letter, i) => (
                <motion.div
                  key={i}
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: 360 }}
                  transition={{ delay: i * 0.1 }}
                  className="w-12 h-14 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center text-white text-xl font-bold shadow-lg"
                >
                  {letter}
                </motion.div>
              ))}
            </div>

            {showHint && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-purple-600 mb-4"
              >
                💡 Hint: {puzzles[currentPuzzle].hint}
              </motion.p>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
              placeholder="Your answer..."
              className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-400 focus:outline-none text-center text-lg uppercase tracking-wider"
              maxLength={puzzles[currentPuzzle].answer.length}
            />
            <Button onClick={checkAnswer} className="px-6">
              <CheckCircle2 className="w-5 h-5" />
            </Button>
          </div>

          <button 
            onClick={() => setShowHint(true)}
            className="w-full mt-3 text-sm text-slate-400 hover:text-purple-500 transition-colors"
          >
            Need a hint?
          </button>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Puzzle Master!</h3>
          <p className="text-slate-600">You solved all the word puzzles!</p>
          <Button 
            onClick={() => {
              setSolved([]);
              setCurrentPuzzle(0);
              setInput('');
            }}
            className="mt-4"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
        </motion.div>
      )}
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const games = [
  { 
    id: 'memory', 
    name: 'Memory Match', 
    icon: Brain,
    description: 'Match pairs to boost memory',
    color: 'from-indigo-400 to-purple-500',
    bgColor: 'bg-indigo-50'
  },
  { 
    id: 'sequence', 
    name: 'Color Sequence', 
    icon: Target,
    description: 'Remember the pattern',
    color: 'from-emerald-400 to-teal-500',
    bgColor: 'bg-emerald-50'
  },
  { 
    id: 'puzzle', 
    name: 'Word Scramble', 
    icon: Puzzle,
    description: 'Unscramble mommy words',
    color: 'from-pink-400 to-rose-500',
    bgColor: 'bg-pink-50'
  }
];

const BrainGamesPage = () => {
  const navigate = useNavigate();
  const [activeGame, setActiveGame] = useState('memory');
  const [totalScore, setTotalScore] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [streak, setStreak] = useState(0);

  const handleGameComplete = (score: number) => {
    setTotalScore(prev => prev + score);
    setGamesPlayed(prev => prev + 1);
    setStreak(prev => prev + 1);
  };

  const renderGame = () => {
    switch (activeGame) {
      case 'memory':
        return <MemoryGame onComplete={handleGameComplete} />;
      case 'sequence':
        return <ColorSequenceGame onComplete={handleGameComplete} />;
      case 'puzzle':
        return <WordPuzzleGame onComplete={handleGameComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="rounded-full hover:bg-slate-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-lg">Brain Games</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span className="font-medium text-amber-700">{totalScore.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: Gamepad2, label: 'Games Played', value: gamesPlayed, color: 'bg-blue-50 text-blue-600' },
            { icon: Zap, label: 'Current Streak', value: streak, color: 'bg-amber-50 text-amber-600' },
            { icon: Star, label: 'Total Score', value: totalScore.toLocaleString(), color: 'bg-purple-50 text-purple-600' }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`${stat.color} rounded-2xl p-4`}
            >
              <stat.icon className="w-6 h-6 mb-2" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm opacity-80">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Game Selection */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Choose a Game
            </h3>
            {games.map((game, index) => (
              <motion.button
                key={game.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveGame(game.id)}
                className={cn(
                  "w-full p-4 rounded-2xl text-left transition-all",
                  activeGame === game.id
                    ? "bg-white shadow-lg ring-2 ring-indigo-200"
                    : "bg-white/50 hover:bg-white hover:shadow-md"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    game.bgColor
                  )}>
                    <game.icon className={cn(
                      "w-6 h-6",
                      activeGame === game.id ? "text-indigo-600" : "text-slate-500"
                    )} />
                  </div>
                  <div className="flex-1">
                    <h4 className={cn(
                      "font-semibold",
                      activeGame === game.id ? "text-slate-800" : "text-slate-600"
                    )}>
                      {game.name}
                    </h4>
                    <p className="text-sm text-slate-400">{game.description}</p>
                  </div>
                  {activeGame === game.id && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="w-2 h-2 rounded-full bg-indigo-500"
                    />
                  )}
                </div>
              </motion.button>
            ))}

            {/* Benefits Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white mt-6"
            >
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Brain Training Benefits
              </h4>
              <ul className="space-y-2 text-sm text-white/90">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Improves memory & focus
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Reduces "baby brain" fog
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Quick 5-10 min sessions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Fun & engaging gameplay
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Right Column - Active Game */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeGame}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderGame()}
              </motion.div>
            </AnimatePresence>

            {/* Tips Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 bg-white rounded-2xl shadow-lg p-6"
            >
              <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-500" />
                Daily Training Tips
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm font-medium text-slate-700 mb-1">⏰ Best Time</p>
                  <p className="text-sm text-slate-500">Play during baby's nap time for focused sessions</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm font-medium text-slate-700 mb-1">🎯 Goal</p>
                  <p className="text-sm text-slate-500">Aim for 10-15 minutes of brain training daily</p>
                </div>
              </div>
            </motion.div>

            {/* More Brain-Healthy Activities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white"
            >
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                More Brain-Boosting Activities
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button 
                  onClick={() => navigate('/music')}
                  className="flex items-center gap-3 p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors text-left"
                >
                  <Music className="w-5 h-5" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Music Therapy</p>
                    <p className="text-xs text-white/80">Calming melodies</p>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => navigate('/activities/breathing')}
                  className="flex items-center gap-3 p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors text-left"
                >
                  <Wind className="w-5 h-5" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Breathing Exercises</p>
                    <p className="text-xs text-white/80">Stress relief</p>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => navigate('/activities/meditation')}
                  className="flex items-center gap-3 p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors text-left"
                >
                  <BookOpen className="w-5 h-5" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Guided Meditation</p>
                    <p className="text-xs text-white/80">Mental clarity</p>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrainGamesPage;
