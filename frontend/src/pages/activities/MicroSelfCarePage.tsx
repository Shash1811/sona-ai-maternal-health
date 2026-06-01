import { useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Copy, Pause, Play, RefreshCw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const affirmations = [
  "I can take this moment one breath at a time.",
  "My body is working hard, and I can meet it with kindness.",
  "I do not have to do everything perfectly to be deeply loving.",
  "Small care still counts as care.",
  "I am allowed to rest before I am empty.",
];

const MicroSelfCarePage = () => {
  const { activityId } = useParams();
  const navigate = useNavigate();
  const [affirmationIndex, setAffirmationIndex] = useState(0);
  const [gratitude, setGratitude] = useState("");
  const [saved, setSaved] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const title = useMemo(() => {
    if (activityId === "affirmation") return "Quick Affirmation";
    if (activityId === "calming-audio") return "Calming Audio";
    if (activityId === "gratitude-pause") return "Gratitude Pause";
    return "Self-Care";
  }, [activityId]);

  const stopAudio = () => {
    oscillatorRef.current?.stop();
    oscillatorRef.current?.disconnect();
    gainRef.current?.disconnect();
    oscillatorRef.current = null;
    gainRef.current = null;
    setAudioPlaying(false);
  };

  const toggleAudio = () => {
    if (audioPlaying) {
      stopAudio();
      return;
    }

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const context = audioContextRef.current || new AudioContextClass();
    audioContextRef.current = context;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 174;
    gain.gain.value = 0.08;
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillatorRef.current = oscillator;
    gainRef.current = gain;
    setAudioPlaying(true);
  };

  const saveGratitude = () => {
    if (!gratitude.trim()) return;
    const existing = JSON.parse(localStorage.getItem("sona_gratitude_pauses") || "[]");
    localStorage.setItem(
      "sona_gratitude_pauses",
      JSON.stringify([{ id: Date.now(), text: gratitude.trim(), createdAt: new Date().toISOString() }, ...existing]),
    );
    setSaved(true);
    setGratitude("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="mx-auto max-w-2xl px-6 py-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 font-medium text-purple-700 hover:text-purple-900"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Activities
        </button>

        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="mt-2 text-gray-600">A tiny reset for the middle of a real day.</p>

          {activityId === "affirmation" && (
            <div className="mt-6 space-y-5">
              <div className="rounded-2xl bg-purple-50 p-8 text-center">
                <p className="text-xl font-semibold leading-relaxed text-purple-900">{affirmations[affirmationIndex]}</p>
              </div>
              <div className="flex gap-3">
                <Button
                  className="flex-1 rounded-xl"
                  onClick={() => setAffirmationIndex((index) => (index + 1) % affirmations.length)}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  New Affirmation
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => navigator.clipboard?.writeText(affirmations[affirmationIndex])}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {activityId === "calming-audio" && (
            <div className="mt-6 space-y-5">
              <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-purple-900 p-8 text-center text-white">
                <div className="mx-auto mb-5 flex h-36 w-36 items-center justify-center rounded-full bg-white/15">
                  <div className={`h-20 w-20 rounded-full bg-white/30 ${audioPlaying ? "animate-pulse" : ""}`} />
                </div>
                <p className="text-sm opacity-80">174 Hz soft tone</p>
                <p className="mt-1 text-lg font-semibold">{audioPlaying ? "Playing" : "Ready"}</p>
              </div>
              <Button className="w-full rounded-xl" onClick={toggleAudio}>
                {audioPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                {audioPlaying ? "Stop Audio" : "Start Audio"}
              </Button>
            </div>
          )}

          {activityId === "gratitude-pause" && (
            <div className="mt-6 space-y-5">
              <div className="rounded-2xl bg-pink-50 p-5">
                <p className="font-medium text-gray-900">Name one thing that is helping you today.</p>
                <Textarea
                  value={gratitude}
                  onChange={(event) => {
                    setGratitude(event.target.value);
                    setSaved(false);
                  }}
                  placeholder="Today I am grateful for..."
                  className="mt-3 min-h-32 rounded-xl bg-white"
                />
              </div>
              <Button onClick={saveGratitude} disabled={!gratitude.trim()} className="w-full rounded-xl">
                {saved ? <Check className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                {saved ? "Saved" : "Save Pause"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MicroSelfCarePage;
