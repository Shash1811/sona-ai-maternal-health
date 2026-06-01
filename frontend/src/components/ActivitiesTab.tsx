import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Clock, Play, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TimeCapsule from "@/components/TimeCapsule";
import { activityCategories, microSelfCare } from "@/data/activityContent";

const ActivitiesTab = () => {
  const [activeSection, setActiveSection] = useState<"activities" | "capsule">("activities");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-2xl font-serif text-foreground">Activities</h1>
        <p className="text-sm text-muted-foreground">Your daily wellness journey</p>
      </div>

      <div className="mx-6 mb-4 flex gap-2">
        <button
          onClick={() => setActiveSection("activities")}
          className={`flex-1 py-2.5 rounded-2xl text-xs font-medium transition-all ${
            activeSection === "activities" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"
          }`}
        >
          Wellness
        </button>
        <button
          onClick={() => setActiveSection("capsule")}
          className={`flex-1 py-2.5 rounded-2xl text-xs font-medium transition-all ${
            activeSection === "capsule" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"
          }`}
        >
          Time Capsule
        </button>
      </div>

      {activeSection === "capsule" ? (
        <TimeCapsule />
      ) : (
        <>
          <div className="px-6 mb-4">
            <p className="text-sm font-medium text-muted-foreground mb-2">1-Minute Self-Care</p>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
              {microSelfCare.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.route)}
                  className="min-w-[110px] p-3 rounded-2xl bg-card text-center transition-all flex flex-col items-center justify-center hover:bg-muted hover:scale-105 hover:shadow-lg border-2 border-transparent hover:border-primary/20"
                >
                  <span className="text-[10px] mb-1 px-2 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                    {item.emoji}
                  </span>
                  <p className="text-[10px] text-foreground font-medium">{item.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div
            onClick={() => navigate("/activities/breathing")}
            className="mx-6 mb-8 p-8 rounded-3xl bg-primary text-primary-foreground text-center cursor-pointer hover:scale-[1.02] transition-all hover:shadow-lg relative overflow-hidden group"
          >
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
              <ChevronRight className="w-6 h-6 text-primary-foreground/80" />
            </div>

            <p className="text-sm font-medium opacity-90 mb-4 tracking-wide uppercase">Guided Breathing</p>
            <motion.div
              className="w-24 h-24 mx-auto rounded-full bg-primary-foreground/20 flex items-center justify-center mb-4 shadow-inner"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sun className="w-10 h-10 text-primary-foreground" />
            </motion.div>
            <p className="text-sm opacity-90 font-medium">Breathe in... breathe out...</p>
          </div>

          <div className="px-6 space-y-8">
            {activityCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
                className="group"
              >
                <div
                  onClick={() => navigate(category.route)}
                  className="flex items-center justify-between mb-4 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl ${category.color} flex items-center justify-center shadow-sm`}>
                      <category.icon className="w-5 h-5 text-foreground/80" />
                    </div>
                    <h2 className="text-xl font-serif text-foreground">{category.title}</h2>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                  </div>
                </div>

                <div className="space-y-3">
                  {category.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => navigate(`/activities/session/${item.id}`)}
                      className="w-full flex items-center justify-between p-4 rounded-2xl bg-card hover:bg-muted hover:scale-[1.01] transition-all text-left shadow-sm hover:shadow-md border border-transparent hover:border-border/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Play className="w-4 h-4 text-primary ml-0.5" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm mb-0.5">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-background/50 px-2.5 py-1 rounded-full">
                        <Clock className="w-3 h-3" />
                        {item.duration}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ActivitiesTab;
