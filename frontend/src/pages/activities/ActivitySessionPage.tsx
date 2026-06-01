import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Clock, Pause, Play, RotateCcw, Music, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { activitySessions } from "@/data/activityContent";
import { toast } from "sonner";

// Static mapping of the copied music tracks
const musicTracks = [
  {
    title: "Downpour Solitude",
    artist: "Dramatic Lullabies",
    src: "/music/Downpour-Sad-Dramatic-Music-chosic.com_.mp3"
  },
  {
    title: "Evening Improvisation",
    artist: "Ethera",
    src: "/music/Evening-Improvisation-with-Ethera(chosic.com).mp3"
  },
  {
    title: "Sakuya Lullaby",
    artist: "Peritune",
    src: "/music/PerituneMaterial_Sakuya2(chosic.com).mp3"
  },
  {
    title: "A Mother's Promise",
    artist: "Chosic",
    src: "/music/a-promise(chosic.com).mp3"
  }
];

const ActivitySessionPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const session = activitySessions.find((item) => item.id === sessionId);
  const totalSeconds = (session?.minutes || 5) * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [notes, setNotes] = useState("");
  const [completed, setCompleted] = useState(false);

  // Audio system state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<typeof musicTracks[0] | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Pick a random track on session initialize
  useEffect(() => {
    setSecondsLeft(totalSeconds);
    setIsRunning(false);
    setCompleted(false);

    // Pick random track
    const randomTrack = musicTracks[Math.floor(Math.random() * musicTracks.length)];
    setCurrentTrack(randomTrack);

    // Instantiate HTML5 Audio
    const audio = new Audio(randomTrack.src);
    audio.loop = true;
    audio.volume = 0.4; // Soothing medium volume
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [sessionId, totalSeconds]);

  // Sync play state with session running state
  useEffect(() => {
    if (!audioRef.current) return;
    if (isRunning && secondsLeft > 0) {
      audioRef.current.play().catch((err) => {
        console.warn("Audio autoplay blocked by browser context. Waiting for user interaction:", err);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isRunning, secondsLeft]);

  // Handle Mute Toggle
  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioRef.current.volume = newMuted ? 0 : 0.4;
  };

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;

    const interval = window.setInterval(() => {
      setSecondsLeft((value) => {
        if (value <= 1) {
          setIsRunning(false);
          setCompleted(true);
          toast.success("Congratulations! You completed this wellness block! 🎉");
          return 0;
        }
        return value - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const progress = useMemo(() => {
    return Math.round(((totalSeconds - secondsLeft) / totalSeconds) * 100);
  }, [secondsLeft, totalSeconds]);

  const formatTime = (value: number) => {
    const minutes = Math.floor(value / 60);
    const seconds = value % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const saveReflection = () => {
    if (!session || !notes.trim()) return;

    const existing = JSON.parse(localStorage.getItem("sona_activity_reflections") || "[]");
    localStorage.setItem(
      "sona_activity_reflections",
      JSON.stringify([
        {
          id: Date.now(),
          session: session.title,
          notes: notes.trim(),
          createdAt: new Date().toISOString(),
        },
        ...existing,
      ]),
    );
    setNotes("");
    setCompleted(true);
    toast.success("Reflection logged to your health journal.");
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-6">
        <div className="max-w-md rounded-2xl bg-white p-6 text-center shadow-lg">
          <h1 className="text-2xl font-semibold text-gray-900">Session not found</h1>
          <Button className="mt-5 rounded-xl animate-bounce" onClick={() => navigate("/dashboard", { state: { tab: "activities" } })}>
            Back to Activities
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="mx-auto max-w-4xl px-6 py-6 pb-24">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 font-semibold text-purple-700 hover:text-purple-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Activities
        </button>

        <div className="rounded-3xl bg-white p-6 shadow-xl border border-purple-100/50">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-purple-600 uppercase tracking-wider">{session.categoryTitle}</p>
              <h1 className="mt-1 text-3xl font-serif font-bold text-gray-900">{session.title}</h1>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{session.description}</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2 text-sm font-bold text-purple-700">
              <Clock className="h-4 w-4" />
              {session.duration}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            {/* Visual Timer and Controls */}
            <div className="rounded-3xl bg-gradient-to-br from-pink-500 to-purple-600 p-8 text-center text-white shadow-lg flex flex-col justify-between min-h-[360px] relative overflow-hidden">
              
              {/* Soft visual waves in the background */}
              {isRunning && (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)] animate-pulse pointer-events-none" />
              )}

              <div className="mx-auto mb-5 flex h-44 w-44 items-center justify-center rounded-full bg-white/20 shadow-2xl border border-white/10 backdrop-blur-sm">
                <div>
                  <div className="text-5xl font-mono font-bold tracking-tight">{formatTime(secondsLeft)}</div>
                  <div className="mt-2 text-xs font-bold uppercase tracking-wider opacity-85">
                    {isRunning ? "In session 🧘" : completed ? "Completed" : "Ready"}
                  </div>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="mb-6">
                <div className="mb-2 h-2 overflow-hidden rounded-full bg-white/20">
                  <div className="h-full rounded-full bg-white transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>

              {/* Dynamic Calming Audio Pill */}
              {currentTrack && (
                <div className="mb-6 mx-auto px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-between gap-4 max-w-sm w-full transition-all">
                  <div className="flex items-center gap-2.5 text-left">
                    <div className="p-2 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                      <Music className={`h-4.5 w-4.5 text-white ${isRunning ? "animate-bounce" : ""}`} />
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-pink-200">Ambient Music</p>
                      <p className="text-xs font-bold text-white truncate max-w-[150px]">{currentTrack.title}</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={toggleMute} 
                    className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX className="h-4.5 w-4.5" /> : <Volume2 className="h-4.5 w-4.5" />}
                  </button>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex justify-center gap-3">
                <Button
                  onClick={() => setIsRunning((value) => !value)}
                  className="rounded-2xl bg-white text-purple-700 hover:bg-white/95 px-6 py-5 font-bold transition-all shadow-md active:scale-95"
                >
                  {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4 fill-current" />}
                  {isRunning ? "Pause" : "Start"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSecondsLeft(totalSeconds);
                    setIsRunning(false);
                    setCompleted(false);
                    if (audioRef.current) {
                      audioRef.current.currentTime = 0;
                    }
                  }}
                  className="rounded-2xl border-white/60 bg-white/10 text-white hover:bg-white/20 px-6 py-5 font-bold transition-all"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>

            {/* Sidebar Guide and reflection journaling */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-5">
                <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600" />
                  Guided Cues
                </h2>
                <div className="mt-4 space-y-3">
                  {session.guide.map((step, idx) => (
                    <div key={idx} className="flex gap-2.5 text-xs text-gray-700 leading-relaxed">
                      <span className="text-purple-600 font-bold shrink-0 mt-0.5">•</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-3">
                <h2 className="font-bold text-gray-900 text-sm">Reflection Log</h2>
                <Textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="How did you and baby feel during this session?"
                  className="min-h-24 rounded-xl text-xs bg-slate-50/50 focus-visible:ring-purple-400 focus:outline-none"
                />
                <Button 
                  onClick={saveReflection} 
                  disabled={!notes.trim()} 
                  className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 text-xs transition-all"
                >
                  Log reflection
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitySessionPage;
