import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, X } from "lucide-react";

const moods = [
  { emoji: "😊", label: "Great", value: 5 },
  { emoji: "🙂", label: "Good", value: 4 },
  { emoji: "😐", label: "Okay", value: 3 },
  { emoji: "😔", label: "Low", value: 2 },
  { emoji: "😢", label: "Struggling", value: 1 },
];

const mockHistory = [
  { day: "Mon", value: 4 },
  { day: "Tue", value: 3 },
  { day: "Wed", value: 4 },
  { day: "Thu", value: 2 },
  { day: "Fri", value: 3 },
  { day: "Sat", value: 4 },
  { day: "Today", value: 0 },
];

const supportMessages: Record<number, string> = {
  1: "💗 You're not alone, Mama. Try a 1-minute breathing exercise, or reach out to someone you trust. Sona is here for you.",
  2: "🌸 It's okay to have tough days. Would you like a calming meditation or to talk to SonaAI?",
  3: "🌻 You're doing great! Remember to take a moment for yourself today.",
  4: "✨ Lovely mood! Keep nurturing yourself, Mama.",
  5: "🎉 You're glowing! What a wonderful day to celebrate the little joys.",
};

interface MoodCheckinProps {
  onClose: () => void;
}

const MoodCheckin = ({ onClose }: MoodCheckinProps) => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [history] = useState(mockHistory);

  const trend = (() => {
    const recent = history.filter((h) => h.value > 0).slice(-3);
    if (recent.length < 2) return "neutral";
    const avg = recent.reduce((s, h) => s + h.value, 0) / recent.length;
    return avg >= 3.5 ? "up" : avg <= 2.5 ? "down" : "neutral";
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      className="mx-6 mb-6 p-6 rounded-3xl bg-card border border-border relative"
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground">
        <X className="w-4 h-4" />
      </button>

      <h3 className="text-lg font-serif text-foreground mb-1">How is Mom feeling today? 💕</h3>
      <p className="text-xs text-muted-foreground mb-4">Your feelings matter. Track your emotional wellness.</p>

      {/* Emoji Scale */}
      <div className="flex justify-between mb-4">
        {moods.map((m) => (
          <button
            key={m.value}
            onClick={() => setSelectedMood(m.value)}
            className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${
              selectedMood === m.value ? "bg-primary/15 scale-110" : "hover:bg-muted"
            }`}
          >
            <span className="text-2xl">{m.emoji}</span>
            <span className="text-[10px] text-muted-foreground">{m.label}</span>
          </button>
        ))}
      </div>

      {/* Support Message */}
      <AnimatePresence>
        {selectedMood && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 rounded-2xl bg-primary/10 text-sm text-foreground"
          >
            {supportMessages[selectedMood]}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Weekly Trend */}
      <div className="mt-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground font-medium">This Week</span>
          <span className="flex items-center gap-1 text-xs">
            {trend === "up" && <><TrendingUp className="w-3 h-3 text-primary" /> <span className="text-primary">Improving</span></>}
            {trend === "down" && <><TrendingDown className="w-3 h-3 text-destructive" /> <span className="text-destructive">Needs attention</span></>}
            {trend === "neutral" && <><Minus className="w-3 h-3 text-muted-foreground" /> <span className="text-muted-foreground">Stable</span></>}
          </span>
        </div>
        <div className="flex items-end gap-1.5 h-16">
          {history.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full rounded-full transition-all ${
                  h.value === 0 ? "bg-border" : h.value >= 4 ? "bg-primary" : h.value >= 3 ? "bg-primary/60" : "bg-destructive/50"
                }`}
                style={{ height: h.value === 0 ? 8 : `${(h.value / 5) * 100}%` }}
              />
              <span className="text-[9px] text-muted-foreground">{h.day}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MoodCheckin;
