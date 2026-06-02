import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Search, PhoneCall, HeartHandshake, ShieldAlert, BookOpen, ExternalLink, Sparkles, Loader2, FileText, CheckCircle2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

interface GuideItem {
  id: string;
  title: string;
  source: string;
  summary: string;
  recommendations: string[];
  fullUrl?: string;
}

const whoGuidelines: GuideItem[] = [
  {
    id: "breastfeeding",
    title: "WHO Infant Feeding Guidelines",
    source: "World Health Organization (WHO)",
    summary: "Comprehensive recommendations for the optimal feeding of infants and young children to support healthy growth and cognitive development.",
    recommendations: [
      "Initiation of breastfeeding within the first hour of birth.",
      "Exclusive breastfeeding for the first 6 months of life.",
      "Introduction of nutritionally-adequate and safe complementary foods at 6 months.",
      "Continued breastfeeding up to 2 years of age or beyond.",
      "Avoid feeding bottles and pacifiers that can cause nipple confusion."
    ],
    fullUrl: "https://www.who.int/health-topics/breastfeeding"
  },
  {
    id: "sleep",
    title: "AAP Safe Infant Sleep Protocols",
    source: "American Academy of Pediatrics (AAP)",
    summary: "Vetted sleep environments and positioning protocols designed to significantly reduce the risk of SIDS and other sleep-related infant deaths.",
    recommendations: [
      "Always place infants on their backs to sleep for every sleep session.",
      "Use a flat, firm, non-inclined sleep surface (crib, bassinet, pack-and-play).",
      "Keep soft objects, loose bedding, pillows, bumper pads, and toys out of the sleep area.",
      "Room share without bed sharing—keep baby's sleep area close to your bed for at least the first 6 months.",
      "Avoid overheating the room; dress the infant in light layers or a wearable blanket."
    ],
    fullUrl: "https://www.aap.org/en/patient-care/safe-sleep/"
  },
  {
    id: "postpartum",
    title: "WHO Maternal Postpartum Care Standards",
    source: "World Health Organization (WHO)",
    summary: "Clinical guidelines focusing on the critical first 6 weeks following birth to support physical recovery and detect early warning signs.",
    recommendations: [
      "Postpartum assessment within the first 24 hours of birth.",
      "At least three additional postpartum contacts at day 3, between days 7-14, and at 6 weeks.",
      "Screening for postpartum depression and maternal anxiety during each contact.",
      "Encourage pelvic floor muscle training (Kegels) to prevent postpartum incontinence.",
      "Acknowledge fatigue and arrange for domestic support during the first weeks."
    ],
    fullUrl: "https://www.who.int/publications/i/item/9789240045980"
  }
];

export const ProfessionalResourcesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);

  const handleSearchGuidelines = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearchResult(null);

    const payload = {
      user_id: user?.id?.toString() || "0",
      message: `Guideline search query: ${searchQuery}. Please search the WHO guidelines and provide a professional clinical answer.`,
      session_id: "professional_rag_search",
      mode: "chat"
    };

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('https://sona-ai-backend.onrender.com/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResult(data.response);
      } else {
        setSearchResult("Unable to connect to the medical knowledge base at the moment. Please try again soon.");
      }
    } catch (err) {
      console.error(err);
      setSearchResult("Error scanning guidelines database. Showing verified local standard offline guidance: Exclusive breastfeeding is recommended for 6 months, along with back sleep safety positioning.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-purple-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-purple-100 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-6 h-6 text-purple-700" />
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Professional Resources</h1>
              <p className="text-sm text-gray-500">Vetted clinical guidelines & emergency support</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Sona AI Guideline Search (RAG) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-purple-100 overflow-hidden relative"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-300 rounded-full opacity-10 filter blur-xl pointer-events-none" />
          
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-purple-100 rounded-xl text-purple-700">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-950 font-serif">Sona AI WHO Guideline Search</h2>
              <p className="text-xs text-gray-500">Direct vector RAG retrieval from peer-reviewed databases</p>
            </div>
          </div>

          <form onSubmit={handleSearchGuidelines} className="relative">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Safe infant sleep environment or Preeclampsia warning signs..."
              className="w-full pl-4 pr-12 py-6 rounded-2xl border-purple-100 focus:border-purple-300 focus:ring-purple-300 bg-white"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 p-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl shadow-md disabled:opacity-50 transition-all"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            </button>
          </form>

          {/* RAG search response */}
          <AnimatePresence>
            {searchResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-5 bg-gradient-to-br from-purple-50/50 via-white to-pink-50/30 rounded-2xl border border-purple-100/50"
              >
                <div className="flex items-start gap-2 mb-3">
                  <div className="p-1 bg-emerald-100 rounded-lg text-emerald-700 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-purple-800">
                    Sona AI Grounded Guideline Assessment
                  </h3>
                </div>
                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line font-medium font-serif">
                  {searchResult}
                </p>
                <div className="mt-4 pt-3 border-t border-purple-50/50 flex items-center justify-between text-[10px] text-gray-400">
                  <span>Source: WHO, AAP & Registered Intake Baseline</span>
                  <span>Clinical Grade • Vetted</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Emergency Clinical Hotlines */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 shadow-xl border border-red-50"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-red-100 rounded-xl text-red-700">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-950 font-serif">Emergency Hotlines</h2>
              <p className="text-xs text-gray-500">Immediate clinical care and crisis support channels</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-red-50/50 to-orange-50/20 rounded-2xl border border-red-100/50 flex items-start gap-3 justify-between">
              <div>
                <h3 className="font-bold text-sm text-gray-950">Maternal Mental Health</h3>
                <p className="text-xs text-gray-600 mt-1 leading-normal">National pregnancy and postpartum wellness support.</p>
                <p className="text-xs font-bold text-red-700 mt-2 flex items-center gap-1">
                  📞 1-833-TLC-MAMA (1-833-852-6262)
                </p>
              </div>
              <a href="tel:18338526262" className="p-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-sm">
                <PhoneCall className="w-4 h-4" />
              </a>
            </div>

            <div className="p-4 bg-gradient-to-br from-red-50/50 to-orange-50/20 rounded-2xl border border-red-100/50 flex items-start gap-3 justify-between">
              <div>
                <h3 className="font-bold text-sm text-gray-950">Preeclampsia Foundation</h3>
                <p className="text-xs text-gray-600 mt-1 leading-normal">High blood pressure, swelling, and preeclampsia red flags assistance.</p>
                <p className="text-xs font-bold text-red-700 mt-2 flex items-center gap-1">
                  📞 1-800-773-5267
                </p>
              </div>
              <a href="tel:18007735267" className="p-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-sm">
                <PhoneCall className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Global Clinical Guidelines Accordions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2 mb-2 px-1">
            <BookOpen className="w-5 h-5 text-purple-700" />
            <h2 className="text-lg font-bold text-gray-950 font-serif">Vetted Clinical Guidelines</h2>
          </div>

          <div className="space-y-3">
            {whoGuidelines.map((guide) => {
              const isExpanded = expandedGuide === guide.id;
              return (
                <div
                  key={guide.id}
                  className="bg-white rounded-2xl border border-purple-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => setExpandedGuide(isExpanded ? null : guide.id)}
                    className="w-full p-5 flex items-center justify-between text-left focus:outline-none"
                  >
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                        {guide.source}
                      </span>
                      <h3 className="font-bold text-gray-950 mt-1">{guide.title}</h3>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-purple-50 bg-purple-50/10"
                      >
                        <div className="p-5 space-y-4">
                          <p className="text-xs text-gray-700 leading-relaxed font-medium">
                            {guide.summary}
                          </p>

                          <div className="space-y-2">
                            <h4 className="text-[10px] uppercase tracking-wider font-bold text-purple-700">
                              Core Protocol Checklist
                            </h4>
                            <ul className="space-y-2">
                              {guide.recommendations.map((rec, idx) => (
                                <li key={idx} className="text-xs text-gray-700 flex items-start gap-2.5 leading-relaxed">
                                  <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {guide.fullUrl && (
                            <a
                              href={guide.fullUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-purple-700 hover:text-purple-800 font-bold hover:underline pt-2"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              View Official Document
                            </a>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfessionalResourcesPage;
