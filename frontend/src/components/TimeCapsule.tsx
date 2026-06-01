import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Mic, PenLine, Camera, Calendar, Heart, Plus, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CapsuleEntry = {
  id: number;
  type: "voice" | "letter" | "photo";
  title: string;
  date: string;
  locked: boolean;
  unlockDate?: string;
};

const mockEntries: CapsuleEntry[] = [
  { id: 1, type: "voice", title: "First lullaby recording", date: "Mar 15, 2026", locked: true, unlockDate: "2044-03-15" },
  { id: 2, type: "letter", title: "Dear baby, before you arrived...", date: "Mar 20, 2026", locked: false },
  { id: 3, type: "photo", title: "24-week bump photo", date: "Apr 1, 2026", locked: true, unlockDate: "2044-04-01" },
];

const TimeCapsule = () => {
  const [entries, setEntries] = useState<CapsuleEntry[]>(() => {
    const stored = localStorage.getItem("sona_time_capsule");
    return stored ? JSON.parse(stored) : mockEntries;
  });
  const [showCreate, setShowCreate] = useState(false);
  const [newType, setNewType] = useState<"voice" | "letter" | "photo">("letter");
  const [memoryText, setMemoryText] = useState("");
  const [unlockDate, setUnlockDate] = useState("2044-01-01");

  const typeIcons = { voice: Mic, letter: PenLine, photo: Camera };
  const typeColors = { voice: "bg-lavender", letter: "bg-pink-light", photo: "bg-gold-light" };

  const saveMemory = () => {
    const nextEntries: CapsuleEntry[] = [
      {
        id: Date.now(),
        type: newType,
        title: memoryText.trim() || `${newType[0].toUpperCase()}${newType.slice(1)} memory`,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        locked: Boolean(unlockDate),
        unlockDate,
      },
      ...entries,
    ];
    setEntries(nextEntries);
    localStorage.setItem("sona_time_capsule", JSON.stringify(nextEntries));
    setMemoryText("");
    setShowCreate(false);
  };

  return (
    <div className="space-y-4">
      {/* Hero */}
      <div className="mx-6 p-6 rounded-3xl bg-primary text-primary-foreground text-center">
        <motion.div
          className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary-foreground/20 flex items-center justify-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Heart className="w-8 h-8" />
        </motion.div>
        <h2 className="text-lg font-serif mb-1">Digital Time Capsule</h2>
        <p className="text-sm opacity-80">Capture moments to treasure forever</p>
        <Button
          onClick={() => setShowCreate(true)}
          className="mt-3 bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground rounded-full"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Memory
        </Button>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mx-6 p-5 rounded-3xl bg-card border border-border relative"
          >
            <button onClick={() => setShowCreate(false)} className="absolute top-4 right-4 text-muted-foreground">
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-serif text-foreground mb-3">New Memory</h3>

            <div className="flex gap-2 mb-3">
              {(["voice", "letter", "photo"] as const).map((t) => {
                const Icon = typeIcons[t];
                return (
                  <button
                    key={t}
                    onClick={() => setNewType(t)}
                    className={`flex-1 p-3 rounded-2xl flex flex-col items-center gap-1 transition-all ${
                      newType === t ? "bg-primary/15 ring-2 ring-primary" : "bg-muted"
                    }`}
                  >
                    <Icon className="w-5 h-5 text-foreground/70" />
                    <span className="text-xs capitalize text-foreground">{t}</span>
                  </button>
                );
              })}
            </div>

            {newType === "voice" && (
              <div className="text-center p-6 rounded-2xl bg-muted mb-3">
                <Mic className="w-10 h-10 mx-auto text-primary mb-2" />
                <Input
                  value={memoryText}
                  onChange={(event) => setMemoryText(event.target.value)}
                  placeholder="Name this voice memory"
                  className="mt-3 rounded-xl"
                />
              </div>
            )}
            {newType === "letter" && (
              <textarea
                value={memoryText}
                onChange={(event) => setMemoryText(event.target.value)}
                placeholder="Dear little one..."
                className="w-full h-24 p-3 rounded-2xl bg-muted text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary mb-3"
              />
            )}
            {newType === "photo" && (
              <div className="text-center p-6 rounded-2xl bg-muted border-2 border-dashed border-border mb-3">
                <Camera className="w-10 h-10 mx-auto text-primary mb-2" />
                <Input
                  value={memoryText}
                  onChange={(event) => setMemoryText(event.target.value)}
                  placeholder="Name this photo memory"
                  className="mt-3 rounded-xl bg-background"
                />
              </div>
            )}

            {/* Future Lock */}
            <div className="p-3 rounded-2xl bg-lavender/50 flex items-center gap-3 mb-3">
              <Lock className="w-5 h-5 text-foreground/70" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Future Lock 🔒</p>
                <p className="text-xs text-muted-foreground">Set an unlock date for this memory</p>
              </div>
              <Input
                type="date"
                className="w-32 text-xs rounded-xl"
                value={unlockDate}
                onChange={(event) => setUnlockDate(event.target.value)}
              />
            </div>

            <Button onClick={saveMemory} className="w-full rounded-2xl bg-primary text-primary-foreground">
              Save Memory 💕
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entries */}
      <div className="px-6 space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Your Memories</h3>
        {entries.map((e, i) => {
          const Icon = typeIcons[e.type];
          return (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3 p-4 rounded-2xl bg-card"
            >
              <div className={`w-10 h-10 rounded-full ${typeColors[e.type]} flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-foreground/70" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{e.title}</p>
                <p className="text-xs text-muted-foreground">{e.date}</p>
              </div>
              {e.locked ? (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Lock className="w-3.5 h-3.5" />
                  <span>{new Date(e.unlockDate!).getFullYear()}</span>
                </div>
              ) : (
                <Unlock className="w-4 h-4 text-primary" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TimeCapsule;
