import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, Key, Lock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();

  const rules = [
    { icon: ShieldCheck, title: "HIPAA Compliant Protocols", desc: "All medical vitals (blood pressure, glucose, temperature) are handled under standard clinical encryption protocols, ensuring complete confidentiality." },
    { icon: Lock, title: "End-to-End Encryption", desc: "Your video consults and clinic interactions are secure. Jitsi telehealth rooms generate unique, dynamic private keys that cannot be inspected by external hosts." },
    { icon: Key, title: "Data Ownership", desc: "Mothers retain complete ownership of their intake questionnaires and baseline diaries. You can opt to export or request complete purging of your telemetry log history at any time." }
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
            <h1 className="text-xl font-bold text-gray-950 font-serif">Privacy Policy</h1>
          </div>
          <Button onClick={() => navigate('/auth')} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl">
            Register Securely
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16 space-y-16">
        <div className="text-center space-y-4">
          <span className="text-xs uppercase font-extrabold tracking-widest text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
            Security Committment
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-950 font-serif leading-tight">
            Vetted Security & Trusted Storage
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Your trust is our absolute priority. We employ clinical-grade safeguards to protect every detail of your pregnancy diary.
          </p>
        </div>

        <div className="space-y-6">
          {rules.map((rule, idx) => {
            const Icon = rule.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl p-6 shadow-md border border-purple-100 flex flex-col md:flex-row gap-5 items-start"
              >
                <div className="p-3 bg-purple-50 text-purple-700 rounded-2xl">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-gray-950">{rule.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{rule.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default PrivacyPage;
