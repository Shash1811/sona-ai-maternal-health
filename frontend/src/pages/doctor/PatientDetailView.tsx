import { motion } from "framer-motion";
import {
  Bot,
  AlertCircle,
  Pill,
  Syringe,
  Heart,
  Video,
  Phone,
  FileText,
  Activity,
  CheckCircle,
  XCircle,
  Stethoscope,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Patient, RiskLevel } from "@/pages/doctor/mockData";

const riskBanner: Record<RiskLevel, { bg: string; border: string; text: string; icon: React.ReactNode; message: string }> = {
  critical: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-800",
    icon: <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />,
    message: "AI flagged as CRITICAL — ER visit advised. Immediate physician review required.",
  },
  high: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-800",
    icon: <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />,
    message: "AI flagged as HIGH RISK — physician follow-up required within 24 hours.",
  },
  routine: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-800",
    icon: <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />,
    message: "AI assessment: Routine. Standard monitoring recommended.",
  },
};

const vitalStatusStyle = {
  normal: "text-emerald-700 bg-emerald-50",
  warning: "text-amber-700 bg-amber-50",
  critical: "text-red-700 bg-red-50 font-bold animate-pulse",
};

interface Props {
  patient: Patient;
  onVideoCall: () => void;
}

export const PatientDetailView = ({ patient, onVideoCall }: Props) => {
  const banner = riskBanner[patient.riskLevel];

  return (
    <motion.div
      key={patient.id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full overflow-y-auto"
    >
      {/* Patient Header */}
      <div className="px-6 pt-6 pb-5 border-b border-slate-100">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
              {patient.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{patient.name}</h2>
              <p className="text-sm text-slate-500">{patient.email} · {patient.phone}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                <span>Age {patient.age}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span>
                  {patient.gestationWeek
                    ? `${patient.gestationWeek} weeks gestation`
                    : `${patient.daysPostpartum} days postpartum`}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span>Last seen: {patient.lastSeen}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button
              size="sm"
              onClick={onVideoCall}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2"
            >
              <Video className="w-4 h-4" />
              Video Call
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => (window.location.href = `mailto:${patient.email}`)}
              className="rounded-xl gap-2"
            >
              <Phone className="w-4 h-4" />
              Contact
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
        {/* LEFT: Main clinical content */}
        <div className="space-y-5">
          {/* AI Risk Banner */}
          <div className={`flex items-start gap-3 p-4 rounded-2xl border ${banner.bg} ${banner.border}`}>
            {banner.icon}
            <p className={`text-sm font-medium ${banner.text}`}>{banner.message}</p>
          </div>

          {/* AI Clinical Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-100">
              <Bot className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-slate-800 text-sm">AI Clinical Summary</h3>
              <span className="ml-auto text-[11px] font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                Sona AI · Auto-generated
              </span>
            </div>
            <div className="p-5">
              <p className="text-sm text-slate-700 leading-relaxed">{patient.aiSummary}</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  This summary is AI-generated from patient interactions. Always verify with clinical judgment.
                </span>
              </div>
            </div>
          </div>

          {/* Vitals */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100">
              <Activity className="w-5 h-5 text-slate-600" />
              <h3 className="font-semibold text-slate-800 text-sm">Self-Reported Vitals</h3>
            </div>
            <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
              {patient.vitals.map((v) => (
                <div key={v.label} className="text-center p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">{v.label}</p>
                  <p className={`text-lg font-bold rounded-lg px-2 py-0.5 ${vitalStatusStyle[v.status]}`}>
                    {v.value}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{v.unit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visit History */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100">
              <Calendar className="w-5 h-5 text-slate-600" />
              <h3 className="font-semibold text-slate-800 text-sm">Visit History</h3>
            </div>
            <div className="p-5 space-y-4">
              {patient.visits.map((v, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-400 mt-1 flex-shrink-0" />
                    {i < patient.visits.length - 1 && (
                      <div className="w-px flex-1 bg-slate-200 mt-1" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-xs font-medium text-slate-500 mb-0.5">{v.date}</p>
                    <p className="text-sm text-slate-700">{v.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: EHR Sidebar */}
        <div className="space-y-4">
          {/* Medical History */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50">
              <Stethoscope className="w-4 h-4 text-slate-500" />
              <h3 className="font-semibold text-slate-700 text-xs uppercase tracking-wider">Medical History</h3>
            </div>
            <ul className="p-4 space-y-2">
              {patient.medicalHistory.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Allergies */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-red-50">
              <XCircle className="w-4 h-4 text-red-500" />
              <h3 className="font-semibold text-red-700 text-xs uppercase tracking-wider">Allergies</h3>
            </div>
            <div className="p-4 flex flex-wrap gap-2">
              {patient.allergies.map((a, i) => (
                <span key={i} className="text-xs font-medium bg-red-50 text-red-700 border border-red-100 px-2.5 py-1 rounded-full">
                  {a}
                </span>
              ))}
              {patient.allergies.length === 0 && (
                <span className="text-xs text-slate-400">None reported</span>
              )}
            </div>
          </div>

          {/* Medications */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50">
              <Pill className="w-4 h-4 text-purple-500" />
              <h3 className="font-semibold text-slate-700 text-xs uppercase tracking-wider">Medications</h3>
            </div>
            <ul className="p-4 space-y-2">
              {patient.medications.map((med, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <Syringe className="w-3 h-3 text-purple-400 mt-1 flex-shrink-0" />
                  {med}
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-4 text-white space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-3">Quick Actions</p>
            {["Schedule follow-up", "Order lab work", "Refer to specialist", "Generate discharge note"].map((action) => (
              <button
                key={action}
                className="w-full text-left text-sm bg-white/10 hover:bg-white/20 px-3 py-2.5 rounded-xl transition-colors flex items-center justify-between group"
              >
                <span>{action}</span>
                <Heart className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
