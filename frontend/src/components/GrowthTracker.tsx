import { useState } from "react";
import { motion } from "framer-motion";
import { Baby, Syringe, AlertCircle, CheckCircle2, Clock, TrendingUp, FileText } from "lucide-react";

const milestones = [
  { week: 20, title: "Baby responds to sound", done: true },
  { week: 22, title: "Baby develops taste buds", done: true },
  { week: 24, title: "Baby can hear your voice", done: true },
  { week: 26, title: "Eyes begin to open", done: false },
  { week: 28, title: "Baby starts dreaming", done: false },
  { week: 30, title: "Rapid brain growth", done: false },
];

const vaccinations = [
  { name: "BCG", due: "At birth", status: "done" as const },
  { name: "OPV-0", due: "At birth", status: "done" as const },
  { name: "Hepatitis B-1", due: "6 weeks", status: "upcoming" as const },
  { name: "Pentavalent-1", due: "6 weeks", status: "upcoming" as const },
  { name: "Rotavirus-1", due: "6 weeks", status: "upcoming" as const },
  { name: "PCV-1", due: "6 weeks", status: "upcoming" as const },
];

const alerts = [
  { type: "reminder", text: "Next checkup in 3 days", icon: Clock },
  { type: "alert", text: "Hepatitis B-1 due in 2 weeks", icon: Syringe },
];

const weeklySummary = {
  weight: "+0.3 kg",
  kicks: "42 kicks today",
  sleep: "6.2 hrs avg",
  mood: "Mostly good 🙂",
};

const GrowthTracker = () => {
  const [tab, setTab] = useState<"milestones" | "vaccines" | "summary">("milestones");

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="mx-6 flex gap-2">
        {([
          { id: "milestones", label: "Growth", icon: Baby },
          { id: "vaccines", label: "Vaccines", icon: Syringe },
          { id: "summary", label: "Summary", icon: FileText },
        ] as const).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl text-xs font-medium transition-all ${
              tab === t.id ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"
            }`}
          >
            <t.icon className="w-3.5 h-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {/* Alerts */}
      <div className="px-6 space-y-2">
        {alerts.map((a, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-center gap-3 p-3 rounded-2xl ${
              a.type === "alert" ? "bg-destructive/10" : "bg-gold-light"
            }`}
          >
            <a.icon className={`w-4 h-4 ${a.type === "alert" ? "text-destructive" : "text-foreground/70"}`} />
            <span className="text-xs text-foreground">{a.text}</span>
          </motion.div>
        ))}
      </div>

      {/* Milestones */}
      {tab === "milestones" && (
        <div className="px-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Pregnancy Milestones</h3>
          <div className="relative pl-6">
            <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-border" />
            {milestones.map((m, i) => (
              <motion.div
                key={m.week}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="relative flex items-start gap-3 mb-4"
              >
                <div className={`absolute -left-3.5 w-4 h-4 rounded-full border-2 ${
                  m.done ? "bg-primary border-primary" : "bg-card border-border"
                } flex items-center justify-center`}>
                  {m.done && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
                </div>
                <div className="ml-2">
                  <p className={`text-sm font-medium ${m.done ? "text-foreground" : "text-muted-foreground"}`}>
                    Week {m.week}: {m.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2 italic">
            Every baby grows at their own pace 💕 No pressure, just love.
          </p>
        </div>
      )}

      {/* Vaccines */}
      {tab === "vaccines" && (
        <div className="px-6 space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Vaccination Timeline (India)</h3>
          {vaccinations.map((v, i) => (
            <motion.div
              key={v.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-2xl bg-card"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                v.status === "done" ? "bg-primary/15" : "bg-gold-light"
              }`}>
                {v.status === "done" ? (
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                ) : (
                  <Clock className="w-4 h-4 text-foreground/70" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{v.name}</p>
                <p className="text-xs text-muted-foreground">{v.due}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                v.status === "done" ? "bg-primary/15 text-primary" : "bg-gold-light text-foreground/70"
              }`}>
                {v.status === "done" ? "Done" : "Upcoming"}
              </span>
            </motion.div>
          ))}
          <div className="p-4 rounded-2xl bg-lavender/50 mt-3">
            <p className="text-xs text-foreground font-medium mb-1">🏥 Government Schemes</p>
            <p className="text-xs text-muted-foreground">
              Pradhan Mantri Matru Vandana Yojana • Janani Suraksha Yojana • Mission Indradhanush
            </p>
          </div>
        </div>
      )}

      {/* Weekly Summary */}
      {tab === "summary" && (
        <div className="px-6 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Weekly Health Summary</h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(weeklySummary).map(([key, val]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-2xl bg-card text-center"
              >
                <p className="text-lg font-bold text-foreground">{val}</p>
                <p className="text-xs text-muted-foreground capitalize">{key}</p>
              </motion.div>
            ))}
          </div>
          <div className="p-4 rounded-2xl bg-primary/10 flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Weekly Insight</p>
              <p className="text-xs text-muted-foreground">
                Baby's kicks are slightly above average this week — a great sign of healthy development! 
                Your sleep improved by 0.4 hrs. Keep it up, Mama! 💪
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrowthTracker;
