import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { CalendarIcon, Smile, Meh, Frown, Heart, Angry, Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface OnboardingProps {
  onComplete: () => void;
}

const FloatingHeart = ({ delay, left, size }: { delay: number; left: string; size: number }) => (
  <motion.div
    className="absolute bottom-0 text-primary"
    style={{ left, fontSize: size }}
    initial={{ y: 0, opacity: 1, rotate: 0 }}
    animate={{ y: "-100vh", opacity: 0, rotate: 45 }}
    transition={{ duration: 4 + Math.random() * 3, delay, repeat: Infinity, ease: "easeOut" }}
  >
    ❤️
  </motion.div>
);

const hearts = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  delay: Math.random() * 3,
  left: `${Math.random() * 100}%`,
  size: 16 + Math.random() * 24,
}));

const moodOptions = [
  { icon: Heart, label: "Great", color: "text-primary" },
  { icon: Smile, label: "Good", color: "text-accent" },
  { icon: Meh, label: "Okay", color: "text-muted-foreground" },
  { icon: Frown, label: "Tired", color: "text-accent" },
  { icon: Angry, label: "Stressed", color: "text-destructive" },
];

const dietaryStaples = [
  { icon: "🍚", label: "Rice" }, { icon: "🌽", label: "Maize" },
  { icon: "🍠", label: "Yam" }, { icon: "🫘", label: "Beans" },
  { icon: "🥬", label: "Greens" }, { icon: "🐟", label: "Fish" },
  { icon: "🥚", label: "Eggs" }, { icon: "🥛", label: "Milk" },
  { icon: "🍌", label: "Plantain" }, { icon: "🥜", label: "Groundnut" },
  { icon: "🫒", label: "Palm Oil" }, { icon: "🥩", label: "Meat" },
];

const SplashOnboarding = ({ onComplete }: OnboardingProps) => {
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const [date, setDate] = useState<Date>();
  const [mood, setMood] = useState<number | null>(null);
  const [staples, setStaples] = useState<string[]>([]);
  const [email, setEmail] = useState("");

  if (!showOnboarding) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-screen bg-background px-6 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Flying hearts */}
        {hearts.map((h) => (
          <FloatingHeart key={h.id} delay={h.delay} left={h.left} size={h.size} />
        ))}

        {/* Yoga/mantra visual */}
        <motion.div
          className="absolute top-12 opacity-20 text-6xl"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          🕉️
        </motion.div>
        <motion.p
          className="absolute top-28 text-xs text-muted-foreground tracking-[0.3em] uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1 }}
        >
          breathe · nurture · grow
        </motion.p>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
          className="text-center z-10"
        >
          <h1 className="text-6xl font-serif font-bold text-primary text-3d mb-4">Sona</h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-2xl font-serif text-foreground/80 mb-2"
          >
            Built for women
          </motion.p>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="text-2xl font-serif text-primary italic"
          >
            by women.
          </motion.p>

          {/* Yoga silhouette */}
          <motion.div
            className="mt-6 text-4xl opacity-30"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🧘‍♀️
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} className="z-10">
          <Button
            onClick={() => navigate('/auth')}
            className="mt-12 px-8 py-6 text-lg rounded-full bg-primary text-primary-foreground glow-pink"
          >
            Get Started
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  const steps = [
    <motion.div key="step0" className="space-y-6 text-center" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}>
      <h2 className="text-2xl font-serif text-foreground">Are you expecting or postpartum?</h2>
      <div className="flex gap-4 justify-center">
        {["Expecting", "Postpartum"].map((opt) => (
          <Button key={opt} variant={status === opt ? "default" : "outline"}
            className={cn("px-8 py-6 text-lg rounded-2xl transition-all", status === opt && "glow-pink")}
            onClick={() => setStatus(opt)}
          >
            {opt === "Expecting" ? "🤰" : "👶"} {opt}
          </Button>
        ))}
      </div>
    </motion.div>,

    <motion.div key="step1" className="space-y-6 text-center" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}>
      <h2 className="text-2xl font-serif text-foreground">
        {status === "Expecting" ? "When is your due date?" : "Baby's birth date?"}
      </h2>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn("w-64 justify-start text-left text-lg py-6 rounded-2xl", !date && "text-muted-foreground")}>
            <CalendarIcon className="mr-2 h-5 w-5" />
            {date ? format(date, "PPP") : "Select a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <Calendar mode="single" selected={date} onSelect={setDate} className="p-3 pointer-events-auto" />
        </PopoverContent>
      </Popover>
    </motion.div>,

    <motion.div key="step2" className="space-y-6 text-center" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}>
      <h2 className="text-2xl font-serif text-foreground">How are you feeling right now?</h2>
      <div className="flex gap-3 justify-center flex-wrap">
        {moodOptions.map((m, i) => (
          <button key={m.label} onClick={() => setMood(i)}
            className={cn("flex flex-col items-center gap-2 p-4 rounded-2xl transition-all border-2",
              mood === i ? "border-primary bg-pink-light scale-110" : "border-transparent bg-card hover:bg-muted"
            )}
          >
            <m.icon className={cn("w-8 h-8", m.color)} />
            <span className="text-sm font-medium text-foreground">{m.label}</span>
          </button>
        ))}
      </div>
    </motion.div>,

    <motion.div key="step3" className="space-y-6 text-center" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}>
      <h2 className="text-2xl font-serif text-foreground">Your primary local dietary staples?</h2>
      <p className="text-sm text-muted-foreground">Select all that apply</p>
      <div className="grid grid-cols-4 gap-3 max-w-xs mx-auto">
        {dietaryStaples.map((item) => (
          <button key={item.label}
            onClick={() => setStaples((prev) => prev.includes(item.label) ? prev.filter((s) => s !== item.label) : [...prev, item.label])}
            className={cn("flex flex-col items-center gap-1 p-3 rounded-xl transition-all border-2",
              staples.includes(item.label) ? "border-primary bg-pink-light" : "border-transparent bg-card hover:bg-muted"
            )}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-xs text-foreground">{item.label}</span>
          </button>
        ))}
      </div>
    </motion.div>,

    <motion.div key="step4" className="space-y-6 text-center" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}>
      <h2 className="text-2xl font-serif text-foreground">Invite a Co-Parent or Workplace Ally</h2>
      <p className="text-sm text-muted-foreground">Build your support network from day one</p>
      <div className="flex gap-2 max-w-xs mx-auto">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input placeholder="Enter their email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 py-6 rounded-2xl text-lg" />
        </div>
      </div>
      <Button variant="outline" className="text-muted-foreground" onClick={onComplete}>Skip for now</Button>
    </motion.div>,
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background px-6 py-12">
      <div className="flex gap-2 mb-8 px-4">
        {steps.map((_, i) => (
          <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-all", i <= step ? "bg-primary" : "bg-muted")} />
        ))}
      </div>
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">{steps[step]}</AnimatePresence>
      </div>
      <div className="flex justify-between items-center px-4 pb-4">
        <Button variant="ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Button onClick={() => step < steps.length - 1 ? setStep(step + 1) : onComplete()} className="px-8 py-6 rounded-full bg-primary text-primary-foreground">
          {step < steps.length - 1 ? "Continue" : "Let's Go"} <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default SplashOnboarding;
