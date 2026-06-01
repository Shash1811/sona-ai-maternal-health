import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Camera, Users, Bell, Heart, MessageCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CommunityProps {
  onBack: () => void;
}

const tabs = ["My Village", "Community Feed", "Doctors"] as const;

const villageMembers = [
  { name: "David", role: "Co-Parent", emoji: "👨‍👧" },
  { name: "Mom", role: "Family", emoji: "👩‍👧" },
  { name: "Sarah", role: "Workplace Ally", emoji: "👩‍💼" },
  { name: "Dr. Ayo", role: "OB-GYN", emoji: "👩‍⚕️" },
];

const feedPosts = [
  { title: "Navigating Matrescence: When Motherhood Changes Your Identity", author: "Dr. Amina", likes: 234, tag: "Trending" },
  { title: "Iron-rich recipes for the third trimester", author: "Nutrition Team", likes: 189, tag: "Nutrition" },
  { title: "How I told my employer about my pregnancy", author: "Community Mom", likes: 156, tag: "Workplace" },
];

const Community = ({ onBack }: CommunityProps) => {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>("My Village");

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 pt-6 pb-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-serif text-foreground">Community</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-6 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              activeTab === tab ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Nutrition Widget */}
      <div className="mx-6 mb-6">
        <motion.div whileHover={{ scale: 1.02 }} className="p-5 rounded-3xl bg-gold-light flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-accent/30 flex items-center justify-center">
            <Camera className="w-7 h-7 text-accent-foreground" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-foreground font-serif">Local Pantry Scanner</p>
            <p className="text-sm text-muted-foreground">Snap your ingredients for a pregnancy-safe recipe</p>
          </div>
        </motion.div>
      </div>

      {activeTab === "My Village" && (
        <div className="px-6 space-y-4">
          {/* Micro-Village */}
          <h2 className="text-lg font-serif text-foreground">Your Micro-Village</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {villageMembers.map((m) => (
              <div key={m.name} className="min-w-[100px] flex flex-col items-center gap-2 p-4 rounded-2xl bg-card">
                <span className="text-3xl">{m.emoji}</span>
                <span className="text-sm font-medium text-foreground">{m.name}</span>
                <span className="text-xs text-muted-foreground">{m.role}</span>
              </div>
            ))}
          </div>
          <Button className="w-full rounded-2xl py-5 bg-sage-light text-foreground hover:bg-sage-light/80">
            <Bell className="w-4 h-4 mr-2" /> Ping Co-Parent to help with chores today
          </Button>
        </div>
      )}

      {activeTab === "Community Feed" && (
        <div className="px-6 space-y-3">
          <h2 className="text-lg font-serif text-foreground">Trending Matrescence Topics</h2>
          {feedPosts.map((post) => (
            <motion.div
              key={post.title}
              whileHover={{ scale: 1.01 }}
              className="p-4 rounded-2xl bg-card border border-border"
            >
              <span className="text-xs font-medium text-primary bg-sage-light px-2 py-1 rounded-full">{post.tag}</span>
              <p className="font-medium text-foreground mt-2 leading-snug">{post.title}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-muted-foreground">by {post.author}</span>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Heart className="w-3.5 h-3.5" />
                  <span className="text-xs">{post.likes}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === "Doctors" && (
        <div className="px-6 space-y-3">
          <h2 className="text-lg font-serif text-foreground">Find a Doctor</h2>
          {[
            { name: "Dr. Ayo Oladele", specialty: "OB-GYN", rating: 4.9, emoji: "👩‍⚕️" },
            { name: "Dr. Fatima Hassan", specialty: "Pediatrician", rating: 4.8, emoji: "👨‍⚕️" },
            { name: "Dr. Grace Nwosu", specialty: "Lactation Consultant", rating: 4.7, emoji: "👩‍⚕️" },
          ].map((doc) => (
            <div key={doc.name} className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border">
              <span className="text-3xl">{doc.emoji}</span>
              <div className="flex-1">
                <p className="font-medium text-foreground">{doc.name}</p>
                <p className="text-sm text-muted-foreground">{doc.specialty}</p>
              </div>
              <span className="text-sm font-bold text-accent">⭐ {doc.rating}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Community;
