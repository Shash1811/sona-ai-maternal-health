import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Flame, 
  Heart,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Trophy,
  Target,
  Calendar,
  Dumbbell,
  Wind,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface Exercise {
  id: number;
  title: string;
  category: 'yoga' | 'cardio' | 'strength' | 'stretching' | 'breathing';
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  calories: number;
  description: string;
  benefits: string[];
  safetyTips: string[];
  steps: { title: string; description: string; duration: number }[];
  image: string;
  completed?: boolean;
}

const exercises: Exercise[] = [
  {
    id: 1,
    title: "Prenatal Morning Yoga Flow",
    category: 'yoga',
    duration: 15,
    difficulty: 'beginner',
    calories: 80,
    description: "A gentle yoga sequence to start your day with energy and positivity.",
    benefits: ["Reduces morning stiffness", "Improves circulation", "Boosts mood", "Relieves tension"],
    safetyTips: ["Listen to your body", "Avoid lying flat on your back after 20 weeks", "Use props for support", "Stay hydrated"],
    steps: [
      { title: "Centering Breath", description: "Sit comfortably, close your eyes, take 5 deep breaths", duration: 60 },
      { title: "Neck Rolls", description: "Gently roll your head in circles, 3 times each direction", duration: 60 },
      { title: "Shoulder Shrugs", description: "Lift shoulders to ears, hold, release - repeat 5 times", duration: 60 },
      { title: "Cat-Cow Stretch", description: "On hands and knees, arch and round your spine 8 times", duration: 120 },
      { title: "Child's Pose", description: "Rest in child's pose with knees wide for 3 deep breaths", duration: 60 },
      { title: "Seated Forward Fold", description: "Sit with legs extended, gently fold forward", duration: 60 },
      { title: "Butterfly Pose", description: "Sit with feet together, knees out, gently flap legs", duration: 60 },
      { title: "Standing Side Stretch", description: "Reach arms up, stretch to each side", duration: 60 },
      { title: "Tree Pose", description: "Balance on one leg, foot on inner thigh or calf", duration: 60 },
      { title: "Final Relaxation", description: "Lie on your left side, rest and breathe", duration: 120 }
    ],
    image: "🧘‍♀️"
  },
  {
    id: 2,
    title: "Pelvic Floor Strengthening",
    category: 'strength',
    duration: 10,
    difficulty: 'beginner',
    calories: 40,
    description: "Essential exercises to strengthen your pelvic floor muscles for labor and recovery.",
    benefits: ["Prevents incontinence", "Prepares for labor", "Faster postpartum recovery", "Better core stability"],
    safetyTips: ["Don't hold your breath", "Avoid clenching buttocks", "Empty bladder first", "Start slowly"],
    steps: [
      { title: "Kegel Warm-up", description: "Identify pelvic muscles by stopping urine flow", duration: 60 },
      { title: "Basic Kegels", description: "Contract and hold for 5 seconds, release for 5 seconds - 10 reps", duration: 120 },
      { title: "Quick Kegels", description: "Contract and release quickly - 10 fast reps", duration: 60 },
      { title: "Elevator Kegels", description: "Gradually tighten in 3 stages, then release in stages", duration: 120 },
      { title: "Bridge Pose", description: "Lie on back, knees bent, lift hips while engaging pelvic floor", duration: 120 },
      { title: "Squats with Kegels", description: "Do 5 squats, holding kegel at bottom of each", duration: 120 },
      { title: "Cool Down", description: "Deep breathing while lying on left side", duration: 120 }
    ],
    image: "💪"
  },
  {
    id: 3,
    title: "Low-Impact Cardio Walk",
    category: 'cardio',
    duration: 20,
    difficulty: 'beginner',
    calories: 120,
    description: "A safe cardio routine you can do at home to maintain fitness without high impact.",
    benefits: ["Maintains cardiovascular health", "Controls weight gain", "Reduces swelling", "Increases stamina"],
    safetyTips: ["Wear supportive shoes", "Stay hydrated", "Keep heart rate moderate", "Stop if dizzy"],
    steps: [
      { title: "March in Place", description: "Warm up with gentle marching for 2 minutes", duration: 120 },
      { title: "Side Steps", description: "Step side to side, arms pumping - 2 minutes", duration: 120 },
      { title: "Knee Lifts", description: "March with high knees, gentle and controlled", duration: 120 },
      { title: "Step Touch", description: "Step together, step touch - 2 minutes", duration: 120 },
      { title: "Heel Digs", description: "Alternate digging heels forward - 2 minutes", duration: 120 },
      { title: "Arm Circles Walk", description: "Walk in place with big arm circles", duration: 120 },
      { title: "Grapevine Steps", description: "Side step, cross behind, step, cross front", duration: 180 },
      { title: "Cool Down Walk", description: "Slow walking, deep breathing - 2 minutes", duration: 120 },
      { title: "Gentle Stretching", description: "Stretch calves, hamstrings, and shoulders", duration: 120 }
    ],
    image: "🚶‍♀️"
  },
  {
    id: 4,
    title: "Prenatal Stretching Routine",
    category: 'stretching',
    duration: 12,
    difficulty: 'beginner',
    calories: 50,
    description: "Gentle stretches to relieve common pregnancy aches and improve flexibility.",
    benefits: ["Relieves back pain", "Reduces leg cramps", "Improves posture", "Promotes relaxation"],
    safetyTips: ["Don't bounce", "Hold each stretch gently", "Breathe normally", "Stop if painful"],
    steps: [
      { title: "Upper Body Shake", description: "Shake out arms and hands to release tension", duration: 30 },
      { title: "Shoulder Stretch", description: "Bring arm across chest, gentle press - both sides", duration: 120 },
      { title: "Chest Opener", description: "Clasp hands behind back, open chest", duration: 60 },
      { title: "Side Stretch", description: "Reach one arm overhead, stretch to side - both sides", duration: 120 },
      { title: "Hip Flexor Stretch", description: "Low lunge, gentle stretch on front of hip", duration: 120 },
      { title: "Hamstring Stretch", description: "Seated or standing, stretch back of legs", duration: 120 },
      { title: "Calf Stretch", description: "Hands on wall, stretch each calf", duration: 120 },
      { title: "Inner Thigh Stretch", description: "Wide stance, gentle side lunge stretch", duration: 120 },
      { title: "Lower Back Stretch", description: "Cat-cow or child's pose for lower back", duration: 120 },
      { title: "Final Relaxation", description: "Lie on left side with pillow support", duration: 120 }
    ],
    image: "🤸‍♀️"
  },
  {
    id: 5,
    title: "Labor Preparation Breathing",
    category: 'breathing',
    duration: 10,
    difficulty: 'beginner',
    calories: 20,
    description: "Learn essential breathing techniques to help you through labor and delivery.",
    benefits: ["Manages pain naturally", "Reduces anxiety", "Increases oxygen for baby", "Builds confidence"],
    safetyTips: ["Practice daily", "Sit comfortably or lie on side", "Don't force breathing", "Stay relaxed"],
    steps: [
      { title: "Settle In", description: "Sit comfortably or lie on left side, close eyes", duration: 60 },
      { title: "Cleansing Breath", description: "Deep inhale through nose, long exhale through mouth", duration: 120 },
      { title: "Slow Breathing", description: "Inhale 4 counts, exhale 6 counts - 10 breaths", duration: 120 },
      { title: "Light Accelerated Breathing", description: "Shallow rapid breaths, like panting gently", duration: 60 },
      { title: "Transition Breathing", description: "Hee-hee-hoo pattern - practice rhythm", duration: 120 },
      { title: "Expulsion Breathing", description: "Deep breath, then bear down with open mouth", duration: 120 },
      { title: "Visualization", description: "Imagine waves washing over you with each breath", duration: 120 },
      { title: "Cool Down", description: "Return to normal breathing, notice calmness", duration: 120 }
    ],
    image: "🌬️"
  },
  {
    id: 6,
    title: "Third Trimester Preparation",
    category: 'yoga',
    duration: 18,
    difficulty: 'intermediate',
    calories: 100,
    description: "Gentle exercises specifically designed for late pregnancy to prepare for labor.",
    benefits: ["Optimal fetal positioning", "Relieves pelvic pressure", "Prepares for labor", "Improves sleep"],
    safetyTips: ["Avoid lying flat", "Use support props", "Stay near a wall for balance", "Listen to your body"],
    steps: [
      { title: "Wall Supported Squats", description: "Back against wall, lower into squat, hold", duration: 120 },
      { title: "Pelvic Tilts", description: "Standing or sitting, rock pelvis back and forth", duration: 120 },
      { title: "Hip Circles", description: "Hands on hips, make big circles with hips", duration: 120 },
      { title: "Deep Squat Hold", description: "Hold deep squat with support, open pelvis", duration: 60 },
      { title: "Cat-Cow on All Fours", description: "Take pressure off spine, move freely", duration: 180 },
      { title: "Resting Child's Pose", description: "Wide knee child's pose, rest forehead", duration: 120 },
      { title: "Side-Lying Leg Lifts", description: "Lie on left side, lift and lower right leg", duration: 120 },
      { title: "Birth Ball Bounce", description: "Sit on birth ball, gentle bouncing/rocking", duration: 180 },
      { title: "Forward Leaning", description: "Lean on birth ball or chair, release lower back", duration: 120 },
      { title: "Final Rest", description: "Lie on left side with pillows between knees", duration: 180 }
    ],
    image: "🤰"
  },
  {
    id: 7,
    title: "Postpartum Recovery - Week 1",
    category: 'strength',
    duration: 8,
    difficulty: 'beginner',
    calories: 30,
    description: "Gentle recovery exercises for the first week after delivery.",
    benefits: ["Promotes healing", "Restores circulation", "Prevents blood clots", "Boosts mood"],
    safetyTips: ["Wait for doctor approval", "Start very gently", "Stop if bleeding increases", "Rest is priority"],
    steps: [
      { title: "Deep Breathing", description: "Lie down, focus on deep belly breathing", duration: 120 },
      { title: "Ankle Pumps", description: "Point and flex feet to improve circulation", duration: 60 },
      { title: "Gentle Pelvic Tilts", description: "Small tilts while lying down", duration: 120 },
      { title: "Shoulder Rolls", description: "Roll shoulders back and forward while sitting", duration: 60 },
      { title: "Neck Stretches", description: "Gentle neck stretches, very careful", duration: 60 },
      { title: "Gentle Kegels", description: "Begin gentle pelvic floor contractions", duration: 120 },
      { title: "Short Walk", description: "If approved, gentle 5-minute walk", duration: 180 }
    ],
    image: "🍼"
  },
  {
    id: 8,
    title: "Pregnancy Back Pain Relief",
    category: 'stretching',
    duration: 14,
    difficulty: 'beginner',
    calories: 60,
    description: "Targeted exercises to relieve pregnancy-related back pain and discomfort.",
    benefits: ["Relieves lower back pain", "Strengthens core", "Improves posture", "Better sleep"],
    safetyTips: ["Move slowly", "Stop if pain increases", "Use pillows for support", "Stay on left side when lying down"],
    steps: [
      { title: "Warm Up", description: "Gentle walking in place", duration: 60 },
      { title: "Pelvic Tilts - Standing", description: "Hands on hips, tilt pelvis forward and back", duration: 120 },
      { title: "Wall Slide", description: "Back against wall, slide down and up", duration: 120 },
      { title: "Cat-Cow", description: "On hands and knees, arch and round spine", duration: 180 },
      { title: "Bird Dog", description: "Extend opposite arm and leg, hold briefly", duration: 180 },
      { title: "Modified Side Plank", description: "From knees, lift hips gently", duration: 120 },
      { title: "Pigeon Pose Prep", description: "Gentle hip opener on back", duration: 120 },
      { title: "Figure-4 Stretch", description: "Lie on back, cross ankle over knee", duration: 120 },
      { title: "Happy Baby Pose", description: "Lie on back, grab feet, gentle rock", duration: 120 },
      { title: "Final Rest", description: "Lie on left side, knees bent with pillow", duration: 120 }
    ],
    image: "🙆‍♀️"
  }
];

const categories = [
  { id: 'all', label: 'All', icon: Sparkles },
  { id: 'yoga', label: 'Yoga', icon: Wind },
  { id: 'cardio', label: 'Cardio', icon: Heart },
  { id: 'strength', label: 'Strength', icon: Dumbbell },
  { id: 'stretching', label: 'Stretching', icon: Target },
  { id: 'breathing', label: 'Breathing', icon: Wind },
];

export const ExercisePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepTimeRemaining, setStepTimeRemaining] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('exercise_progress');
    if (saved) {
      const data = JSON.parse(saved);
      setCompletedExercises(data.completed || []);
      setTotalWorkouts(data.totalWorkouts || 0);
      setTotalMinutes(data.totalMinutes || 0);
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('exercise_progress', JSON.stringify({
      completed: completedExercises,
      totalWorkouts,
      totalMinutes
    }));
  }, [completedExercises, totalWorkouts, totalMinutes]);

  const filteredExercises = selectedCategory === 'all' 
    ? exercises 
    : exercises.filter(e => e.category === selectedCategory);

  const startExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setCurrentStep(0);
    setStepTimeRemaining(exercise.steps[0].duration);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const resetExercise = () => {
    setCurrentStep(0);
    setStepTimeRemaining(selectedExercise?.steps[0].duration || 0);
    setIsPlaying(false);
  };

  const completeExercise = () => {
    if (selectedExercise && !completedExercises.includes(selectedExercise.id)) {
      setCompletedExercises([...completedExercises, selectedExercise.id]);
      setTotalWorkouts(prev => prev + 1);
      setTotalMinutes(prev => prev + selectedExercise.duration);
    }
    setSelectedExercise(null);
    setIsPlaying(false);
    setCurrentStep(0);
  };

  // Timer logic
  useEffect(() => {
    if (isPlaying && stepTimeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setStepTimeRemaining(prev => {
          if (prev <= 1) {
            // Move to next step
            if (selectedExercise && currentStep < selectedExercise.steps.length - 1) {
              setCurrentStep(c => c + 1);
              return selectedExercise.steps[currentStep + 1].duration;
            } else {
              // Exercise complete
              setIsPlaying(false);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, stepTimeRemaining, currentStep, selectedExercise]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (selectedExercise) {
    const step = selectedExercise.steps[currentStep];
    const progress = ((currentStep + 1) / selectedExercise.steps.length) * 100;
    const isLastStep = currentStep === selectedExercise.steps.length - 1;

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-purple-100">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={() => setSelectedExercise(null)}
                  className="p-2 rounded-full hover:bg-purple-100 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft className="w-6 h-6 text-purple-700" />
                </motion.button>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{selectedExercise.title}</h1>
                  <p className="text-sm text-gray-500">Step {currentStep + 1} of {selectedExercise.steps.length}</p>
                </div>
              </div>
              <div className="w-12 h-12 text-4xl">{selectedExercise.image}</div>
            </div>
            {/* Progress Bar */}
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <motion.div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </header>

        {/* Exercise Content */}
        <div className="max-w-4xl mx-auto px-4 mt-8">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100"
          >
            {/* Step Title */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{selectedExercise.image}</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h2>
              <p className="text-gray-600">{step.description}</p>
            </div>

            {/* Timer Display */}
            <div className="text-center mb-8">
              <motion.div 
                className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 font-mono"
                animate={isPlaying ? { scale: [1, 1.05, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                {formatTime(stepTimeRemaining)}
              </motion.div>
              <p className="text-gray-500 mt-2">
                {isPlaying ? 'Keep going!' : 'Paused'}
              </p>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={togglePlay}
                className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={resetExercise}
                className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-600"
              >
                <RotateCcw className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={() => {
                  if (currentStep > 0) {
                    setCurrentStep(c => c - 1);
                    setStepTimeRemaining(selectedExercise.steps[currentStep - 1].duration);
                    setIsPlaying(false);
                  }
                }}
                disabled={currentStep === 0}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 disabled:opacity-50"
              >
                Previous
              </button>
              
              {isLastStep ? (
                <button
                  onClick={completeExercise}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Complete Workout
                </button>
              ) : (
                <button
                  onClick={() => {
                    setCurrentStep(c => c + 1);
                    setStepTimeRemaining(selectedExercise.steps[currentStep + 1].duration);
                    setIsPlaying(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-100 text-purple-700 flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Safety Tips */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-800 text-sm">Safety Tips</p>
                <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                  {selectedExercise.safetyTips.map((tip, i) => (
                    <li key={i}>• {tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                <h1 className="text-2xl font-bold text-gray-900">Yoga & Exercise</h1>
                <p className="text-sm text-gray-500">Safe workouts for every trimester</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Workouts Completed</p>
              <p className="text-lg font-bold text-purple-600">{totalWorkouts}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Card */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-3 gap-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-4 shadow-lg text-center"
          >
            <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-gray-900">{completedExercises.length}</p>
            <p className="text-xs text-gray-500">Exercises Done</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-4 shadow-lg text-center"
          >
            <Clock className="w-6 h-6 text-purple-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-gray-900">{totalMinutes}</p>
            <p className="text-xs text-gray-500">Minutes Active</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-4 shadow-lg text-center"
          >
            <Flame className="w-6 h-6 text-orange-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-gray-900">{completedExercises.length * 50}</p>
            <p className="text-xs text-gray-500">Est. Calories</p>
          </motion.div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                  : 'bg-white text-gray-600 hover:bg-purple-50'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Grid */}
      <div className="max-w-4xl mx-auto px-4 mt-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredExercises.map((exercise, index) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => startExercise(exercise)}
              className={`bg-white rounded-2xl p-5 shadow-lg border-2 cursor-pointer hover:shadow-xl transition-all ${
                completedExercises.includes(exercise.id) 
                  ? 'border-green-300 bg-green-50/30' 
                  : 'border-purple-100'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{exercise.image}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{exercise.title}</h3>
                    {completedExercises.includes(exercise.id) && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{exercise.description}</p>
                  
                  <div className="flex items-center gap-3 mt-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                      {exercise.difficulty}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {exercise.duration} min
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      {exercise.calories} cal
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {exercise.benefits.slice(0, 2).map((benefit, i) => (
                      <span key={i} className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">
                        {benefit}
                      </span>
                    ))}
                    {exercise.benefits.length > 2 && (
                      <span className="text-xs text-gray-400">+{exercise.benefits.length - 2} more</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExercisePage;
