import { Home, HeartPulse, Bot, Activity, User, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

export type Tab = "home" | "health" | "sona" | "activities" | "profile" | "ecosystem";

interface BottomNavProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const BottomNav = ({ active, onChange }: BottomNavProps) => {
  const { t } = useLanguage();

  const tabs: { id: Tab; icon: typeof Home; label: string }[] = [
    { id: "home", icon: Home, label: t("nav.home", "Home") },
    { id: "health", icon: HeartPulse, label: t("nav.health", "Health") },
    { id: "ecosystem", icon: Globe, label: t("nav.ecosystem", "Ecosystem") },
    { id: "sona", icon: Bot, label: t("nav.sona_ai", "SonaAI") },
    { id: "activities", icon: Activity, label: t("nav.activities", "Activities") },
    { id: "profile", icon: User, label: t("nav.profile", "Profile") },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card/95 backdrop-blur-lg border-t border-border z-50">
      <div className="flex justify-around py-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={cn(
              "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors min-w-[56px]",
              active === t.id ? "text-primary" : "text-muted-foreground"
            )}
          >
            <t.icon className={cn("w-5 h-5", active === t.id && "drop-shadow-sm")} />
            <span className="text-[10px] font-medium">{t.label}</span>
            {active === t.id && <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
