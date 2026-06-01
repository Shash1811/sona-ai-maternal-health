import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Info, HelpCircle, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const TermsPage: React.FC = () => {
  const navigate = useNavigate();

  const guidelines = [
    { icon: Info, title: "Advisory Guidance & Clinical Disclaimer", desc: "All checkups, comfort logs, and generative assessments compiled by Sona AI are strictly supportive clinical reviews. They are not absolute diagnoses and never replace in-person primary clinical or emergency room care." },
    { icon: CheckSquare, title: "Account Safety & Licensing Check", desc: "Clinicians using the PG doctor dashboard must present authentic licensing documents. Mothers agree to provide true vitals records to ensure highly accurate Gemini analysis outputs." },
    { icon: HelpCircle, title: "Emergency Guidelines", desc: "If you experience acute pain, bleeding, vision changes, or high fever, do not wait for AI insights. Instantly contact 911 or visit the closest maternal urgent care clinic." }
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
            <h1 className="text-xl font-bold text-gray-950 font-serif">Terms of Service</h1>
          </div>
          <Button onClick={() => navigate('/auth')} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl">
            Accept & Continue
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16 space-y-16">
        <div className="text-center space-y-4">
          <span className="text-xs uppercase font-extrabold tracking-widest text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
            Legal Compliance
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-950 font-serif leading-tight">
            Terms of Use & Clinical Protocols
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            By utilizing our virtual health tools, RAG search engines, and forums, you acknowledge and agree to our clinical guidelines.
          </p>
        </div>

        <div className="space-y-6">
          {guidelines.map((item, idx) => {
            const Icon = item.icon;
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

export default TermsPage;
