import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, 
  Heart, Share2, Download, ListMusic, ChevronLeft,
  Repeat, Shuffle, Mic2, Clock, Brain, Wind, Puzzle, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ============================================================================
// REAL MUSIC TRACKS (Hooked to the copied files inside public/music)
// ============================================================================

const musicTracks = [
  {
    id: 1,
    title: "Evening Improvisation",
    artist: "Ethera",
    duration: "1:54",
    category: "Meditation",
    cover: "bg-gradient-to-br from-purple-400 to-pink-300",
    src: "/music/Evening-Improvisation-with-Ethera(chosic.com).mp3",
    liked: true
  },
  {
    id: 2,
    title: "Sakuya Lullaby",
    artist: "Peritune",
    duration: "3:26",
    category: "Lullaby",
    cover: "bg-gradient-to-br from-violet-400 to-purple-300",
    src: "/music/PerituneMaterial_Sakuya2(chosic.com).mp3",
    liked: true
  },
  {
    id: 3,
    title: "A Mother's Promise",
    artist: "Chosic",
    duration: "1:49",
    category: "Comfort",
    cover: "bg-gradient-to-br from-rose-400 to-pink-300",
    src: "/music/a-promise(chosic.com).mp3",
    liked: true
  },
  {
    id: 4,
    title: "Downpour Solitude",
    artist: "Dramatic Lullabies",
    duration: "8:37",
    category: "Sleep",
    cover: "bg-gradient-to-br from-blue-400 to-cyan-300",
    src: "/music/Downpour-Sad-Dramatic-Music-chosic.com_.mp3",
    liked: false
  }
];

const categories = ["All", "Sleep", "Lullaby", "Meditation", "Comfort"];

// ============================================================================
// VISUALIZER COMPONENT
// ============================================================================

const AudioVisualizer = ({ isPlaying }: { isPlaying: boolean }) => {
  return (
    <div className="flex items-center justify-center gap-1.5 h-16">
      {[...Array(16)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1.5 bg-gradient-to-t from-pink-400 to-purple-500 rounded-full"
          animate={isPlaying ? {
            height: [16, 45 + Math.random() * 25, 16],
            opacity: [0.6, 1, 0.6]
          } : {
            height: 8,
            opacity: 0.3
          }}
          transition={{
            duration: 0.7 + Math.random() * 0.4,
            repeat: Infinity,
            delay: i * 0.05,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const MusicPage = () => {
  const navigate = useNavigate();
  const [currentTrack, setCurrentTrack] = useState(musicTracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [likedTracks, setLikedTracks] = useState<number[]>(
    musicTracks.filter(t => t.liked).map(t => t.id)
  );

  // Audio elements references
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Filter tracks by category
  const filteredTracks = selectedCategory === "All" 
    ? musicTracks 
    : musicTracks.filter(track => track.category === selectedCategory);

  // Handle Track Initialization & State Changes
  useEffect(() => {
    // Instantiate/recycle audio element
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(currentTrack.src);
    audio.loop = false;
    audio.volume = isMuted ? 0 : volume / 100;
    audioRef.current = audio;

    // Register audio updates
    const onTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
        const percent = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(isNaN(percent) ? 0 : percent);
      }
    };

    const onLoadedMetadata = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
      }
    };

    const onEnded = () => {
      // Auto play next track
      handleNextTrack();
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    // If isPlaying is active, play immediately
    if (isPlaying) {
      audio.play().catch(err => {
        console.warn("Browser audio context play blocked:", err);
        setIsPlaying(false);
      });
    }

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
    };
  }, [currentTrack]);

  // Sync play/pause commands
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(err => {
        console.warn("Play promise failed:", err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Sync volume adjustments
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume / 100;
  }, [volume, isMuted]);

  const handleNextTrack = () => {
    const currentIndex = filteredTracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex === -1) return;
    const nextTrack = filteredTracks[(currentIndex + 1) % filteredTracks.length];
    setCurrentTrack(nextTrack);
    setProgress(0);
    setCurrentTime(0);
  };

  const handlePrevTrack = () => {
    const currentIndex = filteredTracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex === -1) return;
    const prevTrack = filteredTracks[(currentIndex - 1 + filteredTracks.length) % filteredTracks.length];
    setCurrentTrack(prevTrack);
    setProgress(0);
    setCurrentTime(0);
  };

  const toggleLike = (trackId: number) => {
    setLikedTracks(prev => 
      prev.includes(trackId) 
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    );
    toast.success("Track added to your favorites!");
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickPercent = clickX / width;
    const newTime = clickPercent * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(clickPercent * 100);
  };

  const formatSeconds = (secs: number) => {
    if (isNaN(secs)) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 pb-12">
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
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" fill="currentColor" />
                </div>
                <span className="font-semibold text-lg">Sona Music Studio</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100" onClick={() => toast.info("Sharing options enabled!")}>
                <Share2 className="w-5 h-5 text-slate-600" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100" onClick={() => toast.success("Track cached offline.")}>
                <Download className="w-5 h-5 text-slate-600" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Player */}
          <div className="lg:col-span-2 space-y-6">
            {/* Now Playing Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-xl shadow-purple-100/50 p-8 border border-purple-50"
            >
              {/* Album Art */}
              <div className="flex justify-center mb-8">
                <motion.div
                  animate={isPlaying ? { scale: [1, 1.02, 1] } : {}}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className={cn(
                    "w-64 h-64 rounded-3xl shadow-2xl flex items-center justify-center relative overflow-hidden",
                    currentTrack.cover
                  )}
                >
                  <div className="text-white text-center z-10">
                    <Mic2 className="w-16 h-16 mx-auto mb-4 opacity-80" />
                    <p className="text-lg font-medium opacity-90 uppercase tracking-widest text-[10px]">{currentTrack.category}</p>
                  </div>
                  {/* Subtle pulsing background */}
                  {isPlaying && (
                    <div className="absolute inset-0 bg-white/5 animate-pulse" />
                  )}
                </motion.div>
              </div>

              {/* Track Info */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-slate-800 mb-1">{currentTrack.title}</h1>
                <p className="text-slate-500 font-medium">{currentTrack.artist}</p>
              </div>

              {/* Visualizer */}
              <div className="mb-6">
                <AudioVisualizer isPlaying={isPlaying} />
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
                  <span>{formatSeconds(currentTime)}</span>
                  <span>{formatSeconds(duration || 120)}</span>
                </div>
                <div 
                  className="h-2 bg-slate-100 rounded-full cursor-pointer relative group"
                  onClick={handleSeek}
                >
                  <motion.div 
                    className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-lg border border-purple-400 opacity-100 group-hover:scale-110 transition-transform" />
                  </motion.div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-6 mb-6">
                <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-slate-600" onClick={() => toast.info("Shuffle enabled.")}>
                  <Shuffle className="w-5 h-5" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full text-slate-600 hover:text-slate-800"
                  onClick={handlePrevTrack}
                >
                  <SkipBack className="w-6 h-6" />
                </Button>

                <motion.button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-xl flex items-center justify-center hover:shadow-2xl cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1 fill-current" />}
                </motion.button>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full text-slate-600 hover:text-slate-800"
                  onClick={handleNextTrack}
                >
                  <SkipForward className="w-6 h-6" />
                </Button>

                <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-slate-600" onClick={() => toast.info("Repeat active.")}>
                  <Repeat className="w-5 h-5" />
                </Button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center gap-3 max-w-xs mx-auto bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full text-slate-400 h-8 w-8 hover:bg-slate-200"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-purple-600" /> : <Volume2 className="w-4 h-4 text-purple-600" />}
                </Button>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseInt(e.target.value));
                    setIsMuted(false);
                  }}
                  className="flex-1 h-1.5 accent-purple-600 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </motion.div>

            {/* Benefits Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg shadow-slate-100/50 p-6 border border-slate-100"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" />
                Benefits for You & Baby
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: "🧠", title: "Brain Development", desc: "Stimulates baby's auditory cortex" },
                  { icon: "😴", title: "Better Sleep", desc: "Calming rhythms for restful nights" },
                  { icon: "💝", title: "Bonding", desc: "Creates positive associations" },
                  { icon: "🧘", title: "Reduced Stress", desc: "Lowers cortisol for both of you" }
                ].map((benefit, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-xl bg-slate-50">
                    <span className="text-2xl">{benefit.icon}</span>
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{benefit.title}</p>
                      <p className="text-xs text-slate-500 leading-normal">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Playlist */}
          <div className="space-y-4">
            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg shadow-slate-100/50 p-4 border border-slate-100"
            >
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setProgress(0);
                    }}
                    className={cn(
                      "px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer",
                      selectedCategory === category
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Track List */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg shadow-slate-100/50 overflow-hidden border border-slate-100"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-sm">
                  <ListMusic className="w-5 h-5 text-purple-600" />
                  Playlist
                </h3>
                <span className="text-xs text-slate-500">{filteredTracks.length} tracks</span>
              </div>
              
              <div className="max-h-[500px] overflow-y-auto">
                <AnimatePresence mode="popLayout">
                  {filteredTracks.map((track, index) => (
                    <motion.div
                      key={track.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        setCurrentTrack(track);
                        setProgress(0);
                        setIsPlaying(true);
                      }}
                      className={cn(
                        "flex items-center gap-3 p-3 cursor-pointer transition-colors hover:bg-slate-50",
                        currentTrack.id === track.id && "bg-purple-50 hover:bg-purple-50",
                        index !== filteredTracks.length - 1 && "border-b border-slate-100"
                      )}
                    >
                      {/* Mini Cover */}
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center",
                        track.cover
                      )}>
                        {currentTrack.id === track.id && isPlaying ? (
                          <div className="flex gap-0.5">
                            <motion.div 
                              animate={{ height: [4, 12, 4] }}
                              transition={{ duration: 0.5, repeat: Infinity }}
                              className="w-0.5 bg-white rounded-full"
                            />
                            <motion.div 
                              animate={{ height: [4, 16, 4] }}
                              transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                              className="w-0.5 bg-white rounded-full"
                            />
                            <motion.div 
                              animate={{ height: [4, 10, 4] }}
                              transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                              className="w-0.5 bg-white rounded-full"
                            />
                          </div>
                        ) : (
                          <span className="text-white text-base">
                            {track.category === "Sleep" ? "🌙" : 
                             track.category === "Lullaby" ? "🎵" : 
                             track.category === "Meditation" ? "✨" : "💝"}
                          </span>
                        )}
                      </div>

                      {/* Track Info */}
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "font-bold truncate text-xs",
                          currentTrack.id === track.id ? "text-purple-700" : "text-slate-800"
                        )}>
                          {track.title}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">{track.artist}</p>
                      </div>

                      {/* Duration & Like */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-mono">{track.duration}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(track.id);
                          }}
                          className="p-1.5 rounded-full hover:bg-slate-200 transition-colors"
                        >
                          <Heart 
                            className={cn(
                              "w-3.5 h-3.5 transition-colors",
                              likedTracks.includes(track.id) ? "text-pink-500 fill-pink-500" : "text-slate-400"
                            )} 
                          />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* More Activities Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white"
            >
              <h4 className="font-semibold mb-4 flex items-center gap-2 text-sm">
                <Brain className="w-4 h-4" />
                More Wellness Activities
              </h4>
              <div className="grid grid-cols-1 gap-2">
                <button 
                  onClick={() => navigate('/brain-games')}
                  className="flex items-center justify-between p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors text-left text-xs font-bold w-full cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Puzzle className="w-4 h-4" />
                    <span>Memory & Focus Games</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => navigate('/exercises')}
                  className="flex items-center justify-between p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors text-left text-xs font-bold w-full cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Wind className="w-4 h-4" />
                    <span>Prenatal Yoga Exercises</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPage;
