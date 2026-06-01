import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Shield, HeartHandshake, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  const milestones = [
    { icon: Heart, title: "Our Mission", desc: "Sona AI is founded on the clinical mandate to make comprehensive, personalized maternal health insights accessible to every expecting and postpartum mother globally, preventing complications before they happen." },
    { icon: Shield, title: "Our Core Standards", desc: "Every assessment is cross-checked against standard ACOG, WHO, and clinical guideline baselines. Patient data is securely locked with full HIPAA-compliant data storage models." },
    { icon: Eye, title: "Our Vision", desc: "A world where every mom enjoys seamless direct scheduling, high-fidelity AI vitals checks, immediate clinical sync, and supportive local community connections." }
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
            <h1 className="text-xl font-bold text-gray-950 font-serif">About Sona AI</h1>
          </div>
          <Button onClick={() => navigate('/auth')} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl">
            Join Us
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16 space-y-16">
        <div className="text-center space-y-4">
          <span className="text-xs uppercase font-extrabold tracking-widest text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
            Our Story
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-950 font-serif leading-tight">
            Democratizing Clinical Maternal Care
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed font-serif">
            "Sona AI was born out of a desire to build a secure, proactive maternal companion. By pairing advanced language models with simple clinical tracking interfaces, we provide continuous health insights for every stage of pregnancy."
          </p>
        </div>

        <div className="space-y-6">
          {milestones.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl p-6 shadow-md border border-purple-100 flex flex-col md:flex-row gap-5 items-start"
              >
                <div className="p-3 bg-purple-50 text-purple-700 rounded-2xl">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-gray-950">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
