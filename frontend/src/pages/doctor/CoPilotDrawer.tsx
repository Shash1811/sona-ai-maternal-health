import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Send,
  ChevronRight,
  Sparkles,
  Loader2,
  User,
  FileText,
  Pill,
  ClipboardList,
  MessageSquare,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Patient } from "@/pages/doctor/mockData";

interface Message {
  id: number;
  role: "doctor" | "copilot";
  content: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  { icon: <ClipboardList className="w-4 h-4" />, label: "Summarize last 3 visits", prompt: "Summarize the last 3 visits for this patient in a concise clinical format." },
  { icon: <Pill className="w-4 h-4" />, label: "Check drug interactions", prompt: "Check for any drug interactions between the patient's current medications and flag any concerns." },
  { icon: <FileText className="w-4 h-4" />, label: "Draft clinical note", prompt: "Draft a SOAP clinical note based on the patient's reported symptoms and AI summary." },
  { icon: <MessageSquare className="w-4 h-4" />, label: "Patient message draft", prompt: "Draft a brief, empathetic patient message summarizing today's assessment and next steps." },
];

const MOCK_RESPONSES: Record<string, string> = {
  "Summarize the last 3 visits for this patient in a concise clinical format.":
    "**Clinical Summary — Last 3 Visits:**\n\n**Visit 1 (Apr 28):** Routine 34-week antenatal check. BP elevated at 142/90 mmHg — Labetalol dose titrated upward. Patient counselled on warning signs of pre-eclampsia.\n\n**Visit 2 (Apr 14):** 32-week check. Mild bilateral pedal edema noted (+1). Growth scan confirmed appropriate for gestational age. Patient educated on symptoms requiring immediate attention.\n\n**Visit 3 (Mar 30):** Anaemia follow-up. Hb 9.8 g/dL. Iron supplementation commenced. Dietary counselling provided.\n\n**Key Trend:** Progressive hypertension with superimposed concerns — escalating vigilance warranted.",

  "Check for any drug interactions between the patient's current medications and flag any concerns.":
    "**Drug Interaction Analysis:**\n\n✅ **Labetalol + Ferrous Sulfate** — No clinically significant interaction. However, administer iron at least 2 hours apart from Labetalol to avoid reduced absorption.\n\n✅ **Labetalol + Prenatal Vitamins** — No known interaction.\n\n⚠️ **Flag:** In context of current clinical picture (BP 158/105, visual disturbances, edema), Labetalol may be insufficient as monotherapy. Consider IV Hydralazine or Magnesium Sulfate if HELLP is confirmed.",

  "Draft a SOAP clinical note based on the patient's reported symptoms and AI summary.":
    "**SOAP Note — Auto-Draft (Review Before Finalising)**\n\n**S (Subjective):** 34-week G2P1 patient presents via AI consultation with severe upper abdominal pain (9/10), persistent headache, visual disturbances (photopsia), and facial/hand edema. Symptom onset 12 hours ago. Denies vaginal bleeding. Self-reported BP: 158/105 mmHg.\n\n**O (Objective):** BP 158/105, HR 98, SpO₂ 97%, Temp 37.1°C. Known gestational hypertension, currently on Labetalol 200mg BD.\n\n**A (Assessment):** Clinical picture consistent with severe pre-eclampsia / possible HELLP syndrome. Symptoms require urgent evaluation.\n\n**P (Plan):** Immediate ER referral advised. Order FBC, LFTs, urine PCR, and coagulation profile. Antenatal team alerted.",

  "Draft a brief, empathetic patient message summarizing today's assessment and next steps.":
    "**Suggested Patient Message:**\n\n---\nDear Priya,\n\nThank you for reaching out to Sona. I've reviewed your symptoms and I'm concerned about the pain, headache, and blood pressure reading you've reported.\n\nI strongly advise you to **go to the nearest emergency room immediately**. Please do not wait. These symptoms need to be assessed in person right away.\n\nPlease let someone drive you — do not drive yourself. If you cannot get a ride, please call **108** for an ambulance.\n\nYou and your baby are the priority right now. Please go now.\n\nI'll be notified once you arrive.\n\nWith care,\nDr. [Your Name]\n---",
};

const getTime = () =>
  new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

interface Props {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CoPilotDrawer = ({ patient, isOpen, onClose }: Props) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "copilot",
      content: patient
        ? `Clinical Co-Pilot ready. I'm briefed on **${patient.name}**'s case. How can I assist you?`
        : "Clinical Co-Pilot ready. Select a patient to begin a context-aware session.",
      timestamp: getTime(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setMessages([
      {
        id: 0,
        role: "copilot",
        content: patient
          ? `Clinical Co-Pilot ready. I'm briefed on **${patient.name}**'s case (${patient.riskLevel} risk). How can I assist you?`
          : "Clinical Co-Pilot ready. Select a patient to begin a context-aware session.",
        timestamp: getTime(),
      },
    ]);
  }, [patient?.id]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { id: Date.now(), role: "doctor", content: text, timestamp: getTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    await new Promise((r) => setTimeout(r, 1400));
    const responseText =
      MOCK_RESPONSES[text] ||
      `I've analysed the clinical context for ${patient?.name || "the patient"}. Based on their profile, history, and AI-reported symptoms:\n\n${text.includes("?") ? "To answer your question directly: " : ""}This requires careful clinical judgment. I'd recommend reviewing the AI clinical summary and vitals, cross-referencing with the visit history, and applying your clinical expertise. I can draft a note, check interactions, or provide a protocol summary if helpful.`;

    const aiMsg: Message = {
      id: Date.now() + 1,
      role: "copilot",
      content: responseText,
      timestamp: getTime(),
    };
    setMessages((prev) => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="fixed right-0 top-0 bottom-0 w-[400px] bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">Clinical Co-Pilot</p>
                <p className="text-xs text-white/70">
                  {patient ? `Context: ${patient.name}` : "No patient selected"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="px-4 py-3 border-b border-slate-100 flex-shrink-0">
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">Quick Actions</p>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_PROMPTS.map((qp) => (
                <button
                  key={qp.label}
                  onClick={() => sendMessage(qp.prompt)}
                  disabled={isLoading}
                  className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 px-3 py-2 rounded-xl border border-slate-100 hover:border-indigo-100 transition-all text-left disabled:opacity-50"
                >
                  <span className="text-slate-400">{qp.icon}</span>
                  {qp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2.5 ${msg.role === "doctor" ? "flex-row-reverse" : ""}`}>
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    msg.role === "copilot"
                      ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {msg.role === "copilot" ? (
                    <Bot className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <div className={`max-w-[80%] ${msg.role === "doctor" ? "items-end" : "items-start"} flex flex-col`}>
                  <div
                    className={`px-3.5 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                      msg.role === "doctor"
                        ? "bg-blue-600 text-white rounded-tr-sm"
                        : "bg-slate-50 text-slate-700 border border-slate-100 rounded-tl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                  <span className="text-sm text-slate-500">Analysing clinical context...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-4 border-t border-slate-100 flex-shrink-0">
            <div className="flex gap-2 items-end">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask the Co-Pilot anything about this patient..."
                className="flex-1 min-h-[80px] max-h-[140px] text-sm resize-none rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
              />
              <Button
                size="icon"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="h-10 w-10 bg-indigo-600 hover:bg-indigo-700 rounded-xl flex-shrink-0 self-end"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 text-center">
              Co-Pilot uses patient context · Always verify clinically
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
