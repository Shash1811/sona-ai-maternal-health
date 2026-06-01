import { useState, useEffect, useRef, KeyboardEvent, FormEvent } from "react";
import API_BASE_URL from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Mic, Sparkles, ArrowLeft, Plus, Command,
  User, Baby, Utensils, AlertTriangle, BookOpen, AudioLines
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── types ────────────────────────────────────────────────────────────────────

type Mode = "health" | "identity";

interface Bullet {
  label: string;
  detail: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  time: string;
  bullets?: Bullet[];
  emotion?: string;
  suggestions?: string[];
  isGrounding?: boolean;
}

interface ChatProps {
  onBack?: () => void;
}

// ─── static data ──────────────────────────────────────────────────────────────

const QUICK_FEATURES = [
  { icon: Utensils, label: "AI Diet Recommender", color: "bg-rose-50 text-rose-600 hover:bg-rose-100" },
  { icon: Baby, label: "Baby Care Assistant", color: "bg-pink-50 text-pink-600 hover:bg-pink-100" },
  { icon: AlertTriangle, label: "SOS Emergency", color: "bg-red-50 text-red-600 hover:bg-red-100" },
  { icon: BookOpen, label: "Baby Diseases & Food", color: "bg-violet-50 text-violet-600 hover:bg-violet-100" },
  { icon: AudioLines, label: "Baby Cry Detector", color: "bg-amber-50 text-amber-600 hover:bg-amber-100" },
];

const INITIAL_MESSAGES: Message[] = [
  {
    role: "assistant",
    content: "Hi Mama! 💕 I'm Sona, your AI health companion. How can I help you today?",
    time: "10:41",
  },
];

// ─── helpers ──────────────────────────────────────────────────────────────────

function nowTime(): string {
  const d = new Date();
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}

// Auto-resize textarea
function useAutoResizeTextarea() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  };
  
  return { textareaRef, adjustHeight };
}

// ─── sub-components ───────────────────────────────────────────────────────────

const Avatar = ({ role }: { role: "user" | "assistant" }) => (
  <div className={cn(
    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm",
    role === "assistant" 
      ? "bg-gradient-to-br from-pink-400 to-rose-500"
      : "bg-gradient-to-br from-slate-400 to-slate-500"
  )}>
    {role === "assistant" ? (
      <Sparkles size={14} className="text-white" />
    ) : (
      <User size={14} className="text-white" />
    )}
  </div>
);

const TypingIndicator = () => (
  <div className="flex gap-3 items-start">
    <Avatar role="assistant" />
    <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-100 rounded-2xl rounded-tl-none shadow-sm">
      {[0, 150, 300].map((delay, i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  </div>
);

const MessageBubble = ({
  msg,
  onSuggestion,
}: {
  msg: Message;
  onSuggestion?: (text: string) => void;
}) => {
  const isUser = msg.role === "user";
  
  return (
    <div className={cn("flex gap-3 items-start w-full", isUser && "flex-row-reverse")}>
      <Avatar role={msg.role} />
      
      {/* CRITICAL FIX: Made this wrapper a flex-col so items-end and items-start work perfectly.
      */}
      <div className={cn("flex flex-col max-w-[85%] md:max-w-2xl", isUser ? "items-end" : "items-start")}>
        
        {/* CRITICAL FIX: Added w-fit to force the background to hug the text. 
        */}
        <div className={cn(
          "px-4 py-3 rounded-2xl shadow-sm w-fit",
          isUser 
            ? "bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-tr-none"
            : "bg-white border border-slate-200 text-slate-700 rounded-tl-none"
        )}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-left">{msg.content}</p>
          
          {msg.bullets && (
            <div className="mt-3 space-y-2">
              {msg.bullets.map((b, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-current mt-1.5 flex-shrink-0 opacity-60" />
                  <div className="text-sm text-left">
                    <span className="font-medium">{b.label}</span>
                    <span className="opacity-80"> — {b.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {msg.suggestions && (
            <div className="mt-3 flex flex-col gap-1.5 w-full">
              {msg.suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => onSuggestion?.(s)}
                  className={cn(
                    "text-left px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer w-full",
                    isUser 
                      ? "bg-white/20 hover:bg-white/30 text-white"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"
                  )}
                >
                  {s} ↗
                </button>
              ))}
            </div>
          )}
        </div>
        <p className={cn("text-[11px] text-slate-400 mt-1.5", isUser ? "mr-1" : "ml-1")}>
          {msg.time}
        </p>
      </div>
    </div>
  );
};

// Quick feature button
const QuickFeatureButton = ({ 
  icon: Icon, 
  label, 
  color, 
  onClick 
}: { 
  icon: React.ElementType; 
  label: string; 
  color: string; 
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200",
      "hover:scale-[1.02] hover:shadow-md active:scale-[0.98]",
      color
    )}
  >
    <Icon size={20} className="flex-shrink-0" />
    <span className="text-sm font-medium">{label}</span>
  </button>
);

// ─── main component ───────────────────────────────────────────────────────────

const SonaChat = ({ onBack }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFeatures, setShowFeatures] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea();

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => { scrollToBottom(); }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: text, time: nowTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setShowFeatures(false);
    setIsLoading(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "user_123",
          session_id: "session_123",
          message: text,
          mode: "health",
        }),
      });
      if (!res.ok) throw new Error("Network error");

      const data = await res.json();

      const aiMsg: Message = {
        role: "assistant",
        content: data.response,
        time: nowTime(),
        emotion: data.emotion_detected,
        suggestions: data.suggestions,
        isGrounding: data.is_grounding_exercise,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble connecting right now, but I want you to know that your feelings are valid. Take a few deep breaths — you're doing an amazing job.",
          time: nowTime(),
          suggestions: ["Try again in a moment", "Tell me more about how you're feeling"],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // ─── layout ────────────────────────────────────────────────────────────────

  return (
    // CRITICAL FIX: Changed h-screen to h-[100dvh] for perfect mobile rendering
    <div className="flex flex-col h-[100dvh] bg-slate-50/50 font-sans">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="px-6 py-5 flex-shrink-0">
        <div className="flex items-center gap-3">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-2 -ml-2 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-md">
            <Baby size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Sona AI</h1>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Sparkles size={10} className="text-pink-500" /> Always here for you
            </p>
          </div>
        </div>
      </header>

      {/* ── Main Chat Area ────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden max-w-4xl mx-auto w-full px-4 sm:px-6">
        
        {/* Scrollable Messages Area */}
        <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 space-y-6">
          
          {/* Quick Features - Only shown initially */}
          {showFeatures && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <p className="text-sm text-slate-500 font-medium">Quick AI Features</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {QUICK_FEATURES.map((feature) => (
                  <QuickFeatureButton
                    key={feature.label}
                    icon={feature.icon}
                    label={feature.label}
                    color={feature.color}
                    onClick={() => {
                      setInput(feature.label);
                      setShowFeatures(false);
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Messages */}
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <MessageBubble msg={msg} onSuggestion={sendMessage} />
            </motion.div>
          ))}

          {/* Typing indicator */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <TypingIndicator />
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* ── Fixed Input Area ─────────────────────────────── */}
        <div className="flex-shrink-0 py-4 bg-slate-50/50">
          <form onSubmit={handleSubmit} className="relative">
            <div className={cn(
              "flex items-end gap-2 border rounded-2xl px-4 py-3 bg-white transition-all duration-200",
              "border-slate-200 focus-within:border-pink-400 focus-within:ring-4 focus-within:ring-pink-100/50",
              "shadow-sm hover:shadow-md"
            )}>
              {/* Mic Button */}
              <button
                type="button"
                className="p-2 rounded-full text-slate-400 hover:text-pink-500 hover:bg-pink-50 transition-colors flex-shrink-0"
              >
                <Mic size={20} />
              </button>

              {/* Auto-resizing Textarea */}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  adjustHeight();
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask Sona anything..."
                disabled={isLoading}
                rows={1}
                className={cn(
                  "flex-1 resize-none bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400",
                  "text-sm leading-relaxed py-1.5 min-h-[28px] max-h-[120px]"
                )}
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={cn(
                  "p-2.5 rounded-full flex-shrink-0 transition-all duration-200",
                  isLoading || !input.trim()
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-br from-pink-500 to-rose-600 text-white hover:from-pink-600 hover:to-rose-700 hover:shadow-lg hover:scale-105 active:scale-95"
                )}
              >
                <Send size={18} />
              </button>
            </div>
          </form>
          
          <p className="mt-2 text-[11px] text-slate-400 text-center">
            Sona is an AI and may make mistakes. For emergencies call 999.
          </p>
        </div>
      </main>
    </div>
  );
};

export default SonaChat;