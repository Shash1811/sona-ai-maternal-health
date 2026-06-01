import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PricingPage: React.FC = () => {
  const navigate = useNavigate();

  const tiers = [
    {
      name: "Sona Basic",
      price: "$0",
      period: "forever",
      desc: "Essentials for tracking daily maternal wellness and safe guidelines.",
      features: [
        "Daily Vitals Logging (BP, Glucose, Temp)",
        "Basic Onboarding Questionnaire",
        "Limited Offline WHO Guidelines Checklist",
        "Home and Stress-Relief breathing counts"
      ],
      cta: "Start Free Now",
      premium: false
    },
    {
      name: "Sona AI Premium",
      price: "$9.99",
      period: "per month",
      desc: "Advanced Gemini-powered generative checking and interactive vector resources.",
      features: [
        "Unrestricted Gemini 2.5 AI Insights checkups",
        "HIPAA-compliant data assessment and history logs",
        "Dynamic Vector RAG Guideline Search",
        "Postpartum Baby Cry Analyzer (Audio AI)",
        "MongoDB community forums posting & likes"
      ],
      cta: "Unlock Premium",
      premium: true
    },
    {
      name: "Clinical Sync Pro",
      price: "$24.99",
      period: "per month",
      desc: "Full relationship sync between expectant mothers and medical specialists.",
      features: [
        "Everything in Sona AI Premium",
        "Direct PG doctor dashboard messaging & sync",
        "Relational appointments calendar booking",
        "Auto-provisioned Jitsi Telehealth consultations",
        "OB/GYN vital alarm push alerts"
      ],
      cta: "Get Clinic Sync",
      premium: false
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
            <h1 className="text-xl font-bold text-gray-950 font-serif">Sona Pricing Plans</h1>
          </div>
          <Button onClick={() => navigate('/auth')} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl">
            Start Free
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-16 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs uppercase font-extrabold tracking-widest text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
            Transparent Pricing
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-950 font-serif leading-tight">
            Flexible Support for Every Stage
          </h2>
          <p className="text-lg text-gray-600">
            Select the support tier that best aligns with your needs, from daily home logs to professional clinical integrations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-white rounded-3xl p-8 shadow-md border flex flex-col justify-between relative overflow-hidden ${
                tier.premium ? 'border-purple-300 ring-2 ring-purple-100' : 'border-purple-100'
              }`}
            >
              {tier.premium && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] uppercase font-bold py-1.5 px-4 rounded-bl-2xl flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Most Popular
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-950">{tier.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{tier.desc}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-gray-950">{tier.price}</span>
                  <span className="text-xs text-gray-400">/{tier.period}</span>
                </div>

                <ul className="space-y-3.5 pt-4 border-t border-purple-50">
                  {tier.features.map((feature, fIdx) => (
                    <li key={fIdx} className="text-xs text-gray-700 flex items-start gap-2.5 leading-relaxed">
                      <span className="p-0.5 bg-purple-50 text-purple-700 rounded-md mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                onClick={() => navigate('/auth')}
                className={`w-full py-6 mt-8 rounded-xl font-bold transition-all ${
                  tier.premium
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md'
                    : 'bg-purple-50 hover:bg-purple-100 text-purple-700'
                }`}
              >
                {tier.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PricingPage;
