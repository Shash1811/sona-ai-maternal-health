import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Moon, Scale, Utensils, MessageCircle, Baby, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardProps {
  onOpenChat: () => void;
  onOpenMindful: () => void;
  onOpenCommunity: () => void;
  onOpenMarketplace: () => void;
}

const trackers = [
  { icon: Moon, label: "Sleep Sync", value: "5.2 hrs overlap", color: "bg-sage-light" },
  { icon: Scale, label: "Weight", value: "62.5 kg", color: "bg-gold-light" },
  { icon: Utensils, label: "Daily Diet", value: "1,850 cal", color: "bg-blush" },
];

const Dashboard = ({ onOpenChat, onOpenMindful, onOpenCommunity, onOpenMarketplace }: DashboardProps) => {
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <div>
          <p className="text-sm text-muted-foreground">Good morning</p>
          <h1 className="text-2xl font-serif text-foreground">Welcome back, Mama 💛</h1>
        </div>
        <Button className="bg-sos hover:bg-destructive text-destructive-foreground rounded-full px-4 py-2 font-bold text-sm shadow-lg animate-pulse">
          <AlertTriangle className="w-4 h-4 mr-1" /> SOS
        </Button>
      </div>

      {/* Timeline Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-6 p-6 rounded-3xl bg-primary text-primary-foreground mb-6"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm opacity-80">Pregnancy Timeline</span>
          <span className="text-sm font-bold bg-primary-foreground/20 px-3 py-1 rounded-full">Week 24</span>
        </div>
        <div className="w-full bg-primary-foreground/20 rounded-full h-2 mb-4">
          <div className="bg-accent h-2 rounded-full" style={{ width: "60%" }} />
        </div>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
            <Baby className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="font-bold text-lg font-serif">Baby Talk 🎧</p>
            <p className="text-sm opacity-90">Baby's hearing is developing today! They can hear your heartbeat and voice.</p>
          </div>
        </div>
      </motion.div>

      {/* Smart Trackers */}
      <div className="px-6 mb-6">
        <h2 className="text-lg font-serif text-foreground mb-3">Smart Trackers</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
          {trackers.map((t) => (
            <motion.div
              key={t.label}
              whileHover={{ scale: 1.03 }}
              className={`min-w-[140px] p-4 rounded-2xl ${t.color} flex flex-col gap-2`}
            >
              <t.icon className="w-5 h-5 text-foreground/70" />
              <span className="text-xs text-muted-foreground">{t.label}</span>
              <span className="font-bold text-foreground">{t.value}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="px-6 space-y-3">
        <h2 className="text-lg font-serif text-foreground mb-3">Quick Access</h2>
        {[
          { label: "Mindful Moments", desc: "Breathe & relax", action: onOpenMindful },
          { label: "My Village", desc: "Connect with your community", action: onOpenCommunity },
          { label: "Marketplace", desc: "Shop for mom & baby", action: onOpenMarketplace },
        ].map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-card hover:bg-muted transition-colors text-left"
          >
            <div>
              <p className="font-medium text-foreground">{item.label}</p>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        ))}
      </div>

      {/* FAB */}
      <motion.button
        onClick={onOpenChat}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl glow-sage z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ y: [0, -6, 0] }}
        transition={{ y: { repeat: Infinity, duration: 3 } }}
      >
        <MessageCircle className="w-7 h-7" />
      </motion.button>
    </div>
  );
};

export default Dashboard;
