import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Sparkles, Calendar, BookOpen, Users, 
  Moon, Droplet, Brain, Activity, Smile, 
  Plus, Clock, MapPin, X, Search, ThumbsUp, MessageSquare, Tag, Download, PlayCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

type SubTab = 'tracker' | 'calendar' | 'resources' | 'forums';

// --- MOCK DATA ---
const initialResources = [
  { id: 1, title: "Optimal Prenatal Nutrition Guide", category: "Nutrition", length: "5 min read", desc: "A clinical guide on baseline vitamins, proteins, and safety items to eat weekly.", premium: false },
  { id: 2, title: "Third Trimester Safe Exercises", category: "Fitness", length: "10 min video", desc: "Low impact yoga, pelvic tilts, and safe breathing cycles to stay active.", premium: true },
  { id: 3, title: "Mitigating Gestational Anxiety", category: "Mental Health", length: "7 min read", desc: "Mindful practices and stress evaluation baselines supported by clinical therapists.", premium: false },
  { id: 4, title: "Postpartum Care: Golden Rules", category: "Mental Health", length: "12 min read", desc: "A comprehensive guide on emotional recovery, family support, and resting milestones.", premium: false },
  { id: 5, title: "Iron and Folic Acid Superfoods", category: "Nutrition", length: "6 min read", desc: "Delicious recipes and dietary guidelines to support blood synthesis.", premium: true }
];

const initialForums = [
  { id: 1, author: "Jessica M.", avatar: "👩‍🍼", time: "2 hours ago", tag: "Grateful", title: "Feeling the first kicks!", content: "Absolutely magical morning. Little one is active at week 20! Anyone else tracking movement schedules?", likes: 14, liked: false, comments: ["Simply stunning!", "A beautiful milestone!"] },
  { id: 2, author: "Sarah L.", avatar: "🤰", time: "4 hours ago", tag: "Struggling", title: "Dealing with third-trimester sleep drops", content: "My sleep duration drops under 5 hours due to back soreness. Any specific support pillows or breathing cues?", likes: 8, liked: false, comments: ["Try side-sleeping with a firm bolster!", "Warm chamomile tea before bed works wonders."] }
];

export const EcosystemTab: React.FC = () => {
  const { t } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('tracker');

  // --- HEALTH TRACKER STATE ---
  const [sleep, setSleep] = useState<number>(7);
  const [water, setWater] = useState<number>(6); // cups
  const [stress, setStress] = useState<number>(4); // 1-10
  const [mood, setMood] = useState<string>("happy");
  const [exercise, setExercise] = useState<number>(20); // mins
  const [aiAnalysis, setAiAnalysis] = useState<any | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // --- CALENDAR STATE ---
  const [appointments, setAppointments] = useState<any[]>([
    { id: 1, title: "Therapy Session: Stress Management", type: "Therapy", time: "10:30 AM", date: "May 28", note: "Virtual check-in with Dr. Carter" },
    { id: 2, title: "Workout: Pelvic Tilts & Yoga", type: "Fitness", time: "2:00 PM", date: "May 30", note: "Safe home breathing routine" }
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', type: 'Therapy', time: '', date: 'May 28', note: '' });

  // --- RESOURCES STATE ---
  const [resourceSearch, setResourceSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // --- FORUMS STATE ---
  const [posts, setPosts] = useState<any[]>(initialForums);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTag, setNewPostTag] = useState('Grateful');
  const [commentInputs, setCommentInputs] = useState<{[key: number]: string}>({});

  // --- DYNAMIC AI GENERATION ENGINE ---
  const handleAnalyzeHealth = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      let badge = 'excellent';
      let textColor = 'text-emerald-700 bg-emerald-100 border-emerald-200';
      let tips: string[] = [];
      let redflags = false;

      if (sleep < 6) {
        tips.push("We noticed a drop in your resting duration. Try utilizing a maternal bolster and sleeping strictly on your left side to support blood flow.");
      }
      if (stress > 6) {
        tips.push("Your stress levels are elevated. Sona recommends practicing our 5-minute deep diaphragmatic breathing guide located in the Activities panel.");
        badge = 'attention';
        textColor = 'text-amber-700 bg-amber-100 border-amber-200';
      }
      if (water < 8) {
        tips.push("Hydration levels are sub-optimal. Maternal cardiovascular synthesis requires at least 8-10 glasses daily. Keep a dedicated flask near your rest area.");
      }
      if (sleep < 5 && stress > 7) {
        redflags = true;
        badge = 'warning';
        textColor = 'text-red-700 bg-red-100 border-red-200';
      }

      if (tips.length === 0) {
        tips.push("Your vitals look healthy! Continue maintaining this high-fidelity rest cycle and proper hydration balance.");
      }

      setAiAnalysis({
        badge,
        textColor,
        tips,
        redflags,
        summary: `Vitals analysis based on ${sleep}h sleep, ${water} cups of hydration, and stress index of ${stress}/10.`
      });
      setIsAnalyzing(false);
      toast.success("AI Insights generated successfully!");
    }, 8000);
  };

  // --- CALENDAR HANDLERS ---
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.time) {
      toast.error("Please enter a title and time.");
      return;
    }
    const created = {
      id: Date.now(),
      ...newEvent
    };
    setAppointments([...appointments, created]);
    setShowAddModal(false);
    setNewEvent({ title: '', type: 'Therapy', time: '', date: 'May 28', note: '' });
    toast.success("Session scheduled successfully!");
  };

  const handleCancelSession = (id: number) => {
    setAppointments(appointments.filter(a => a.id !== id));
    toast.success("Session cancelled.");
  };

  // --- RESOURCE FILTERING ---
  const filteredResources = initialResources.filter(res => {
    const matchSearch = res.title.toLowerCase().includes(resourceSearch.toLowerCase()) || 
                        res.desc.toLowerCase().includes(resourceSearch.toLowerCase());
    const matchCat = selectedCategory === 'All' || res.category === selectedCategory;
    return matchSearch && matchCat;
  });

  // --- FORUM ACTIONS ---
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle || !newPostContent) {
      toast.error("Please specify a post title and content.");
      return;
    }
    const created = {
      id: Date.now(),
      author: "Jessica M.",
      avatar: "👩‍🍼",
      time: "Just now",
      tag: newPostTag,
      title: newPostTitle,
      content: newPostContent,
      likes: 0,
      liked: false,
      comments: []
    };
    setPosts([created, ...posts]);
    setNewPostTitle('');
    setNewPostContent('');
    toast.success("Post published successfully!");
  };

  const handleLikePost = (id: number) => {
    setPosts(posts.map(p => {
      if (p.id === id) {
        return {
          ...p,
          likes: p.liked ? p.likes - 1 : p.likes + 1,
          liked: !p.liked
        };
      }
      return p;
    }));
  };

  const handleAddComment = (postId: number) => {
    const text = commentInputs[postId];
    if (!text) return;
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, text]
        };
      }
      return p;
    }));
    setCommentInputs({ ...commentInputs, [postId]: '' });
    toast.success("Comment added!");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Module Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-serif text-gray-900 flex items-center gap-2">
              {t("eco.title", "Holistic Ecosystem 🌿")}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {t("eco.subtitle", "Personalized trackers, clinical scheduling, peer support forums, and vetted resources.")}
            </p>
          </div>

          {/* Sub Navigation Menus */}
          <div className="flex items-center gap-1.5 bg-purple-50 p-1.5 rounded-2xl border border-purple-100 overflow-x-auto">
            <button
              onClick={() => setActiveSubTab('tracker')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeSubTab === 'tracker' 
                  ? 'bg-white text-purple-700 shadow-md scale-105' 
                  : 'text-gray-500 hover:text-purple-600'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              {t("eco.vitals_form", "Daily Tracker")}
            </button>
            <button
              onClick={() => setActiveSubTab('calendar')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeSubTab === 'calendar' 
                  ? 'bg-white text-purple-700 shadow-md scale-105' 
                  : 'text-gray-500 hover:text-purple-600'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              {t("health.calendar", "Calendar")}
            </button>
            <button
              onClick={() => setActiveSubTab('resources')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeSubTab === 'resources' 
                  ? 'bg-white text-purple-700 shadow-md scale-105' 
                  : 'text-gray-500 hover:text-purple-600'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              {t("nav.activities", "Resources")}
            </button>
            <button
              onClick={() => setActiveSubTab('forums')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeSubTab === 'forums' 
                  ? 'bg-white text-purple-700 shadow-md scale-105' 
                  : 'text-gray-500 hover:text-purple-600'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Forums
            </button>
          </div>
        </div>

        {/* --- MAIN MODULES PANELS --- */}
        <AnimatePresence mode="wait">
          
          {/* 1. DAILY TRACKER PANEL */}
          {activeSubTab === 'tracker' && (
            <motion.div
              key="tracker"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Daily check-in form */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-200 shadow-lg space-y-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500 animate-pulse" />
                  Log Daily Health Metrics
                </h2>

                <div className="space-y-6">
                  {/* Sleep Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs text-gray-600 font-medium">
                      <span className="flex items-center gap-1"><Moon className="w-4 h-4 text-purple-500" /> Sleep Duration</span>
                      <span className="bg-purple-50 px-2.5 py-1 rounded-md text-purple-700 font-bold">{sleep} hours</span>
                    </div>
                    <input 
                      type="range" min="3" max="12" step="0.5" value={sleep}
                      onChange={(e) => setSleep(parseFloat(e.target.value))}
                      className="w-full accent-purple-600"
                    />
                  </div>

                  {/* Water Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs text-gray-600 font-medium">
                      <span className="flex items-center gap-1"><Droplet className="w-4 h-4 text-blue-500" /> Hydration</span>
                      <span className="bg-blue-50 px-2.5 py-1 rounded-md text-blue-700 font-bold">{water} cups</span>
                    </div>
                    <input 
                      type="range" min="2" max="16" step="1" value={water}
                      onChange={(e) => setWater(parseInt(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>

                  {/* Stress Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs text-gray-600 font-medium">
                      <span className="flex items-center gap-1"><Brain className="w-4 h-4 text-pink-500" /> Stress Level</span>
                      <span className="bg-pink-50 px-2.5 py-1 rounded-md text-pink-700 font-bold">{stress} / 10</span>
                    </div>
                    <input 
                      type="range" min="1" max="10" step="1" value={stress}
                      onChange={(e) => setStress(parseInt(e.target.value))}
                      className="w-full accent-pink-600"
                    />
                  </div>

                  {/* Exercise Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs text-gray-600 font-medium">
                      <span className="flex items-center gap-1"><Activity className="w-4 h-4 text-emerald-500" /> Active Movement</span>
                      <span className="bg-emerald-50 px-2.5 py-1 rounded-md text-emerald-700 font-bold">{exercise} mins</span>
                    </div>
                    <input 
                      type="range" min="0" max="90" step="5" value={exercise}
                      onChange={(e) => setExercise(parseInt(e.target.value))}
                      className="w-full accent-emerald-600"
                    />
                  </div>

                  {/* Mood Selector */}
                  <div className="space-y-2">
                    <label className="text-xs text-gray-600 font-semibold flex items-center gap-1">
                      <Smile className="w-4 h-4 text-amber-500" /> Mood Status
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['anxious', 'happy', 'struggling'].map((m) => (
                        <button
                          key={m}
                          onClick={() => setMood(m)}
                          className={`py-3 rounded-2xl font-bold text-xs uppercase border transition-all cursor-pointer ${
                            mood === m 
                              ? 'bg-purple-100 border-purple-400 text-purple-700 scale-102' 
                              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    onClick={handleAnalyzeHealth}
                    disabled={isAnalyzing}
                    className="w-full rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-6 text-sm flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin" />
                        AI Consulting local guideline checklists...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate AI Insights
                      </>
                    )}
                  </Button>
                </div>

                {/* Progress Indicators */}
                <div className="space-y-3 pt-4">
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Weekly Tracking Consistency</h3>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                      <div 
                        key={day} 
                        className={`flex-1 h-3 rounded-full ${
                          day <= 5 ? 'bg-gradient-to-r from-purple-400 to-pink-400' : 'bg-gray-100'
                        }`} 
                        title={`Day ${day}: Logged`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">You logged your vitals 5 out of the last 7 days. Exceptional consistency!</p>
                </div>
              </div>

              {/* AI Insights Card */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-lg flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    Your AI Insights
                  </h2>

                  {!aiAnalysis ? (
                    <div className="p-8 text-center text-gray-400 text-sm leading-relaxed border border-dashed border-gray-200 rounded-2xl space-y-3">
                      <Sparkles className="w-8 h-8 text-purple-300 mx-auto animate-pulse" />
                      <p>Adjust your check-in sliders and click <strong>Generate AI Insights</strong> to trigger a personalized clinical analysis.</p>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 font-semibold uppercase">Status Check</span>
                        <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border ${aiAnalysis.textColor}`}>
                          {aiAnalysis.badge}
                        </span>
                      </div>

                      <p className="text-xs text-gray-700 italic border-l-2 border-purple-500 pl-3 leading-relaxed">
                        {aiAnalysis.summary}
                      </p>

                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Comfort Adaptations</h4>
                        <ul className="space-y-3">
                          {aiAnalysis.tips.map((tip: string, idx: number) => (
                            <li key={idx} className="text-xs text-gray-600 leading-relaxed flex items-start gap-2.5">
                              <span className="text-purple-600 mt-0.5">🌟</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {aiAnalysis.redflags && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs leading-relaxed flex gap-2">
                          <span className="text-sm">⚠️</span>
                          <div>
                            <span className="font-bold">Clinical Red Flag:</span> Sleeplessness and chronic anxiety present risk factors. Consider utilizing our calendar scheduler to book an urgent consult slot.
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-8 p-3 bg-purple-50 rounded-2xl border border-purple-100 text-center text-[10px] text-purple-800 leading-relaxed flex items-start gap-2">
                  <span>💡</span>
                  <span className="text-left">Recommendations are derived from WHO Guidelines and patient intake summaries.</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. CALENDAR SCHEDULER PANEL */}
          {activeSubTab === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Monthly grid */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-200 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    May 2026
                  </h2>
                  <Button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold gap-1"
                  >
                    <Plus className="w-4 h-4" /> Book Session
                  </Button>
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-gray-600 border-b pb-3 mb-3">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => <div key={day}>{day}</div>)}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 31 }, (_, idx) => {
                    const day = idx + 1;
                    const isBooked = appointments.some(a => a.date === `May ${day}`);
                    return (
                      <button
                        key={day}
                        className={`aspect-square rounded-xl text-xs font-bold flex flex-col items-center justify-center relative transition-all ${
                          isBooked 
                            ? 'bg-purple-600 text-white shadow-md' 
                            : 'hover:bg-purple-50 text-gray-800'
                        }`}
                      >
                        <span>{day}</span>
                        {isBooked && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white absolute bottom-1.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Booked Sessions */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-lg space-y-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-pink-500 animate-pulse" />
                  Upcoming Sessions
                </h2>

                {appointments.length === 0 ? (
                  <p className="text-center text-gray-400 text-xs py-8">No scheduled sessions. Click Book Session to schedule a workout or coaching block.</p>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appt) => (
                      <div key={appt.id} className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-2 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-purple-100 text-purple-800 rounded-md">
                              {appt.type}
                            </span>
                            <span className="text-xs text-gray-500 font-medium">{appt.date} • {appt.time}</span>
                          </div>
                          <h3 className="font-bold text-xs text-gray-900 mt-2">{appt.title}</h3>
                          <p className="text-[11px] text-gray-600 mt-1">{appt.note}</p>
                        </div>
                        <button 
                          onClick={() => handleCancelSession(appt.id)}
                          className="text-[10px] text-red-500 hover:text-red-700 font-bold self-start mt-2 border-b border-red-200"
                        >
                          Cancel Booking
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* 3. PROFESSIONAL RESOURCES PANEL */}
          {activeSubTab === 'resources' && (
            <motion.div
              key="resources"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Category tags & Search */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-md grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input 
                    value={resourceSearch}
                    onChange={(e) => setResourceSearch(e.target.value)}
                    placeholder="Search clinical guides, exercises, nutrition..."
                    className="pl-10 rounded-xl"
                  />
                </div>

                <div className="flex flex-wrap gap-2 justify-end">
                  {['All', 'Nutrition', 'Fitness', 'Mental Health'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedCategory === cat 
                          ? 'bg-purple-600 text-white shadow-sm' 
                          : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resource Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((res) => (
                  <div key={res.id} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-lg flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-purple-700 uppercase bg-purple-100 px-2 py-0.5 rounded-md">
                          {res.category}
                        </span>
                        <span className="text-xs text-gray-400">{res.length}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm">{res.title}</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">{res.desc}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      {res.premium ? (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-md">⭐ Premium Guide</span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">🔓 Free Access</span>
                      )}
                      <button 
                        onClick={() => toast.success(`Starting: ${res.title}`)}
                        className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                      >
                        {res.length.includes("video") ? <PlayCircle className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                        Open
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 4. COMMUNITY FORUMS PANEL */}
          {activeSubTab === 'forums' && (
            <motion.div
              key="forums"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Timeline feed */}
              <div className="lg:col-span-2 space-y-6">
                {posts.map((post) => (
                  <div key={post.id} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{post.avatar}</span>
                        <div>
                          <p className="text-xs font-bold text-gray-900">{post.author}</p>
                          <p className="text-[10px] text-gray-400">{post.time}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full uppercase">
                        {post.tag}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-bold text-gray-900 text-sm">{post.title}</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">{post.content}</p>
                    </div>

                    {/* Social Stats */}
                    <div className="flex items-center gap-6 pt-3 border-t border-gray-100 text-xs">
                      <button 
                        onClick={() => handleLikePost(post.id)}
                        className={`flex items-center gap-1.5 transition-colors font-bold ${
                          post.liked ? 'text-pink-600' : 'text-gray-500 hover:text-pink-600'
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" fill={post.liked ? "currentColor" : "none"} />
                        {post.likes} Likes
                      </button>
                      <span className="flex items-center gap-1.5 text-gray-500">
                        <MessageSquare className="w-4 h-4" />
                        {post.comments.length} Comments
                      </span>
                    </div>

                    {/* Comments section */}
                    <div className="space-y-2 pt-2 bg-gray-50 p-4 rounded-2xl border">
                      {post.comments.map((c: string, cIdx: number) => (
                        <div key={cIdx} className="text-xs text-gray-700 leading-relaxed flex gap-2">
                          <span className="font-bold text-purple-700">🌸</span>
                          <span>{c}</span>
                        </div>
                      ))}

                      {/* Comment Input */}
                      <div className="flex gap-2 mt-3">
                        <Input
                          value={commentInputs[post.id] || ''}
                          onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                          placeholder="Write a support message..."
                          className="bg-white rounded-xl text-xs h-9"
                        />
                        <Button 
                          onClick={() => handleAddComment(post.id)}
                          className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs h-9 px-4"
                        >
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Author new thread panel */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-lg h-fit space-y-4">
                <h2 className="text-xl font-bold text-gray-900">Create New Thread</h2>
                
                <form onSubmit={handleCreatePost} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Discussion Tag</label>
                    <select
                      value={newPostTag}
                      onChange={(e) => setNewPostTag(e.target.value)}
                      className="w-full mt-1 p-2 border rounded-xl bg-white h-10 text-xs focus:outline-none focus:ring-1 focus:ring-purple-400"
                    >
                      {['Grateful', 'Anxious', 'Hopeful', 'Struggling'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Topic Title</label>
                    <Input 
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                      placeholder="e.g., First movements felt today!"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Content Description</label>
                    <textarea
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="Share your experience or ask other moms for support..."
                      className="w-full mt-1 p-3 bg-white border rounded-xl text-xs min-h-[100px] focus:outline-none focus:ring-1 focus:ring-purple-400 resize-none transition-all"
                    />
                  </div>

                  <Button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl py-5 font-bold text-xs"
                  >
                    Publish Post
                  </Button>
                </form>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* --- ADD EVENT MODAL (CALENDAR) --- */}
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
              className="bg-white rounded-3xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Book Wellness Event</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 rounded-full hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddEvent} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600">Event Title</label>
                  <Input 
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="e.g., Virtual Stress Management"
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600">Session Type</label>
                    <select
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                      className="w-full mt-1 p-2 border rounded-xl bg-white h-10 text-xs focus:outline-none focus:ring-1 focus:ring-purple-400"
                    >
                      {['Therapy', 'Fitness', 'Coaching'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600">Session Day</label>
                    <select
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="w-full mt-1 p-2 border rounded-xl bg-white h-10 text-xs focus:outline-none focus:ring-1 focus:ring-purple-400"
                    >
                      {[26, 27, 28, 29, 30, 31].map(day => (
                        <option key={day} value={`May ${day}`}>May {day}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600">Time</label>
                  <Input 
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    placeholder="e.g., 10:30 AM"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600">Session Notes</label>
                  <Input 
                    value={newEvent.note}
                    onChange={(e) => setNewEvent({ ...newEvent, note: e.target.value })}
                    placeholder="Any details you wish to specify..."
                    className="mt-1"
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl py-6 font-bold text-xs"
                >
                  Schedule Event
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default EcosystemTab;
