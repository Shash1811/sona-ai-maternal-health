import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Brain, Calendar, Heart, Shield, Sparkles, MessageSquare, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const FeaturesPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Sparkles,
      title: "Gemini 2.5 AI Insights",
      desc: "Intelligent clinical baseline summarization, stress evaluation, and tailored comfort guidelines auto-analyzed from daily health logging.",
      color: "bg-pink-100 text-pink-700"
    },
    {
      icon: Calendar,
      title: "Clinic & Telehealth Scheduling",
      desc: "Relational appointments manager allowing moms to schedule video consultations with medical specialists and auto-generating end-to-end encrypted Jitsi Meet links.",
      color: "bg-purple-100 text-purple-700"
    },
    {
      icon: Brain,
      title: "Vector-Store RAG Search",
      desc: "Interactive global medical knowledge base matching questions to official WHO and AAP sleep, feeding, and postpartum checklists, contextualized by individual patient profiles.",
      color: "bg-blue-100 text-blue-700"
    },
    {
      icon: MessageSquare,
      title: "MongoDB Community Forums",
      desc: "Instant postpartum community support. Author, bookmark, like, and reply with custom emotional wellness logging tags.",
      color: "bg-indigo-100 text-indigo-700"
    },
    {
      icon: Heart,
      title: "Comprehensive Vitals Logging",
      desc: "Unified tracking interface mapping blood pressure, glucose, temperature, pulse rate, sleep deficiency, and daily anxiety checks.",
      color: "bg-rose-100 text-rose-700"
    },
    {
      icon: Shield,
      title: "Maternal Red-Flag Guardrails",
      desc: "Visual clinical range alerts notifying users immediately of elevated blood pressure or critical glucose levels.",
      color: "bg-emerald-100 text-emerald-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-purple-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-purple-100 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-6 h-6 text-purple-700" />
            </motion.button>
            <h1 className="text-xl font-bold text-gray-950 font-serif">Sona Ecosystem Features</h1>
          </div>
          <Button onClick={() => navigate('/auth')} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl">
            Get Started
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs uppercase font-extrabold tracking-widest text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
            Technical Rollout Overview
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-950 font-serif leading-tight">
            Clinical Intelligence Meets Beautiful UX
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Discover the tools built to transform the maternal wellness journey with secure, instant, and personalized expert supervision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-3xl p-6 shadow-md border border-purple-100/50 hover:shadow-xl transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${feat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-950">{feat.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default FeaturesPage;
