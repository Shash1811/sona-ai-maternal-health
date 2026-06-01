import { motion } from "framer-motion";
import { ArrowLeft, Mic, Play, Headphones, Wind, Moon, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MindfulProps {
  onBack: () => void;
}

const meditations = [
  { title: "Return to Work Anxiety", duration: "3 min", icon: "💼", color: "bg-sage-light" },
  { title: "Sleep Deprivation Relief", duration: "3 min", icon: "😴", color: "bg-gold-light" },
  { title: "Postpartum Body Image", duration: "3 min", icon: "🪷", color: "bg-blush" },
  { title: "New Mom Overwhelm", duration: "3 min", icon: "🌊", color: "bg-sage-light" },
  { title: "Partner Communication", duration: "3 min", icon: "💬", color: "bg-gold-light" },
  { title: "Self-Compassion", duration: "3 min", icon: "💛", color: "bg-blush" },
];

const MindfulMoments = ({ onBack }: MindfulProps) => {
  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 pt-6 pb-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-serif text-foreground">Mindful Moments</h1>
      </div>

      {/* Breathing Circle */}
      <div className="flex flex-col items-center py-8">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20"
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-4 rounded-full bg-primary/30"
            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />
          <motion.div
            className="absolute inset-8 rounded-full bg-primary/40"
            animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          />
          <motion.p
            className="relative z-10 text-lg font-serif text-primary font-medium"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            Breathe
          </motion.p>
        </div>
        <p className="text-sm text-muted-foreground mt-4">Follow the circle. Inhale… exhale.</p>
      </div>

      {/* Cry Translator */}
      <div className="mx-6 mb-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-5 rounded-3xl bg-card border border-border flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center">
            <Mic className="w-7 h-7 text-accent" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-foreground font-serif">Cry Translator</p>
            <p className="text-sm text-muted-foreground">Record baby's cry for AI assessment</p>
          </div>
          <Button size="icon" className="rounded-full bg-primary text-primary-foreground">
            <Mic className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>

      {/* Meditations */}
      <div className="px-6">
        <h2 className="text-lg font-serif text-foreground mb-4">Guided Meditations</h2>
        <div className="grid grid-cols-2 gap-3">
          {meditations.map((m) => (
            <motion.button
              key={m.title}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`${m.color} p-4 rounded-2xl text-left`}
            >
              <span className="text-2xl mb-2 block">{m.icon}</span>
              <p className="text-sm font-medium text-foreground leading-tight">{m.title}</p>
              <div className="flex items-center gap-1 mt-2">
                <Play className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{m.duration}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MindfulMoments;
