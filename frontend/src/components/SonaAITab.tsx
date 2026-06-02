import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Mic, Bot, Utensils, Baby, AlertTriangle, BookOpen, AudioLines, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import API_BASE_URL from "@/lib/api";

type Message = { role: "user" | "assistant"; content: string; sources?: string[]; crisis?: boolean };

const SonaAITab = () => {
  const { t, language } = useLanguage();
  const { user, token } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showFeatures, setShowFeatures] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize and translate welcome message on language change
  useEffect(() => {
    setMessages([
      { role: "assistant", content: t("chat.welcome", "Hi Mama! 💕 I'm Sona, your AI health companion. How can I help you today?") },
    ]);
  }, [language]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const quickFeatures = [
    { icon: Utensils, label: t("home.action_diet", "AI Diet Recommender"), color: "bg-pink-light" },
    { icon: Baby, label: t("home.action_exercise", "Baby Care Assistant"), color: "bg-rose-light" },
    { icon: AlertTriangle, label: t("common.urgent", "SOS Emergency"), color: "bg-destructive/10" },
    { icon: BookOpen, label: t("health.symptom", "Baby Diseases & Food"), color: "bg-lavender" },
    { icon: AudioLines, label: t("home.action_music", "Baby Cry Detector"), color: "bg-gold-light" },
  ];

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setInput(""); // Clear input immediately
    setMessages((p) => [...p, { role: "user", content: userMessage }]);
    setShowFeatures(false);
    
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          user_id: String(user?.id || 'web_user'),
          session_id: `web_session_${user?.id || 'guest'}`,
          message: userMessage,
          mode: 'health'
        })
      });
      
      const data = await response.json();
      const sources = data.metadata?.rag_sources?.map((source: any) => source.title || source.source) || [];
      setMessages((p) => [
        ...p,
        {
          role: "assistant",
          content: data.response,
          sources,
          crisis: Boolean(data.metadata?.crisis_detection?.is_crisis),
        },
      ]);
    } catch (error) {
      setMessages((p) => [...p, { role: "assistant", content: t("chat.placeholder", "Sorry, I'm having trouble connecting right now. Please try again in a moment.") }]);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-background font-sans">
      <div className="flex-1 flex flex-col w-full max-w-4xl mx-auto min-h-0 px-4 sm:px-6 lg:px-8">
        {/* Header - Fixed at the top */}
        <header className="py-6 flex-shrink-0 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-sm">
            <Bot className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-serif text-foreground font-bold">{t("nav.sona_ai", "Sona AI")}</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-primary" /> {t("chat.subtitle", "Always here for you")}
            </p>
          </div>
        </header>

        {/* Scrollable Area - Takes remaining middle space */}
        <main ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 pb-4 scroll-smooth pr-2">
          {/* Quick Features */}
          {showFeatures && (
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-3 font-medium">{t("home.quick_actions", "Quick AI Features")}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickFeatures.map((f) => (
                  <button
                    key={f.label}
                    onClick={() => { setInput(f.label); setShowFeatures(false); }}
                    className={`${f.color} p-4 rounded-2xl flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-transform w-full text-left shadow-sm border border-gray-100/50`}
                  >
                    <f.icon className="w-6 h-6 text-foreground/70 shrink-0" />
                    <span className="text-sm font-medium text-foreground">{f.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div className="space-y-4">
            {messages.map((m, i) => (
              <div 
                key={i} 
                className={cn(
                  "flex w-full", 
                  m.role === "assistant" ? "justify-start" : "justify-end"
                )}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    "p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm w-fit max-w-[85%] md:max-w-lg",
                    m.role === "assistant"
                      ? "bg-card text-card-foreground rounded-bl-sm border border-border"
                      : "bg-primary text-primary-foreground rounded-br-sm"
                  )}
                  >
                  {m.content}
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-3 border-t border-border/70 pt-2 text-[11px] opacity-80">
                      Sources: {m.sources.slice(0, 3).join(", ")}
                    </div>
                  )}
                  {m.crisis && (
                    <div className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">
                      Crisis alert detected. If you are in immediate danger, call local emergency services now.
                    </div>
                  )}
                </motion.div>
              </div>
            ))}
          </div>
        </main>

        {/* Input Bar - Anchored to bottom */}
        <footer className="py-4 flex-shrink-0">
          <div className="flex gap-2 items-center bg-card rounded-2xl border border-border p-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <Button variant="ghost" size="icon" className="rounded-full shrink-0 text-muted-foreground hover:text-primary">
              <Mic className="w-5 h-5" />
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={t("chat.placeholder", "Ask Sona AI anything...")}
              className="border-0 bg-transparent focus-visible:ring-0 text-sm flex-1 px-1 shadow-none"
            />
            <Button
              size="icon"
              className={cn(
                "rounded-full shrink-0 transition-all duration-200",
                !input.trim() ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground hover:scale-105"
              )}
              onClick={sendMessage}
              disabled={!input.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SonaAITab;
