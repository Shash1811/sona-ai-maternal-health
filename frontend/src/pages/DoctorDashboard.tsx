import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Users,
  BarChart3,
  Settings,
  ShieldCheck,
  LogOut,
  Sparkles,
  UserRound,
  TrendingUp,
  AlertCircle,
  Bell,
  ChevronRight,
  FileBadge,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { TriageQueue } from "@/pages/doctor/TriageQueue";
import { PatientDetailView } from "@/pages/doctor/PatientDetailView";
import { CoPilotDrawer } from "@/pages/doctor/CoPilotDrawer";
import { MOCK_PATIENTS, Patient } from "@/pages/doctor/mockData";

type NavSection = "triage" | "roster" | "analytics" | "settings";

const NAV_ITEMS: { id: NavSection; icon: typeof Activity; label: string }[] = [
  { id: "triage", icon: Activity, label: "Triage Queue" },
  { id: "roster", icon: Users, label: "Patient Roster" },
  { id: "analytics", icon: BarChart3, label: "Analytics" },
  { id: "settings", icon: Settings, label: "Settings" },
];

// ─── Analytics Panel ──────────────────────────────────────
const AnalyticsPanel = () => {
  const stats = [
    { label: "Patients Today", value: "12", change: "+3", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Critical Alerts", value: "1", change: "Active", color: "text-red-600", bg: "bg-red-50" },
    { label: "Avg. Response Time", value: "4.2m", change: "-12%", color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "AI Escalations", value: "7", change: "This week", color: "text-amber-600", bg: "bg-amber-50" },
  ];

  const weeklyData = [
    { day: "Mon", value: 60 }, { day: "Tue", value: 80 }, { day: "Wed", value: 45 },
    { day: "Thu", value: 90 }, { day: "Fri", value: 70 }, { day: "Sat", value: 30 }, { day: "Sun", value: 20 },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Clinical Analytics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="text-sm text-slate-500 mb-1">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-400 mt-1">{s.change}</p>
          </div>
        ))}
      </div>

      {/* Mini bar chart */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800">Consultations This Week</h3>
          <TrendingUp className="w-5 h-5 text-blue-500" />
        </div>
        <div className="flex items-end gap-3 h-32">
          {weeklyData.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-blue-100 rounded-t-lg transition-all hover:bg-blue-400"
                style={{ height: `${d.value}%` }}
              />
              <span className="text-xs text-slate-400">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Risk distribution */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-semibold text-slate-800 mb-4">Patient Risk Distribution</h3>
        <div className="space-y-3">
          {[
            { label: "Critical", value: 20, color: "bg-red-500" },
            { label: "High Risk", value: 40, color: "bg-amber-400" },
            { label: "Routine", value: 40, color: "bg-emerald-400" },
          ].map((r) => (
            <div key={r.label} className="flex items-center gap-3">
              <span className="text-sm text-slate-600 w-20">{r.label}</span>
              <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${r.color} rounded-full`} style={{ width: `${r.value}%` }} />
              </div>
              <span className="text-sm font-medium text-slate-700 w-8">{r.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Patient Roster ───────────────────────────────────────
const PatientRoster = ({ onSelect }: { onSelect: (p: Patient) => void }) => (
  <div className="p-8 max-w-5xl mx-auto">
    <h2 className="text-2xl font-bold text-slate-800 mb-6">Full Patient Roster</h2>
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="grid grid-cols-[1fr_80px_160px_160px_120px_80px] text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span>Patient</span><span>Age</span><span>Status</span><span>Primary Concern</span><span>Risk</span><span></span>
      </div>
      {MOCK_PATIENTS.map((p) => (
        <button
          key={p.id}
          onClick={() => onSelect(p)}
          className="w-full grid grid-cols-[1fr_80px_160px_160px_120px_80px] items-center px-5 py-4 border-b border-slate-50 hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {p.name.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-slate-800 text-sm">{p.name}</p>
              <p className="text-xs text-slate-400">{p.email}</p>
            </div>
          </div>
          <span className="text-sm text-slate-600">{p.age}</span>
          <span className="text-xs text-slate-500">
            {p.gestationWeek ? `${p.gestationWeek}w gestation` : `${p.daysPostpartum}d postpartum`}
          </span>
          <span className="text-xs text-slate-600 truncate pr-4">{p.primarySymptom}</span>
          <span className={`text-xs font-semibold capitalize px-2 py-1 rounded-full inline-block ${
            p.riskLevel === "critical" ? "bg-red-50 text-red-700" :
            p.riskLevel === "high" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
          }`}>{p.riskLevel}</span>
          <ChevronRight className="w-4 h-4 text-slate-300 ml-auto" />
        </button>
      ))}
    </div>
  </div>
);

// ─── Settings Panel ───────────────────────────────────────
const SettingsPanel = ({ user }: { user: any }) => (
  <div className="p-8 max-w-3xl mx-auto">
    <h2 className="text-2xl font-bold text-slate-800 mb-6">Settings</h2>
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <FileBadge className="w-5 h-5 text-blue-500" /> Physician Profile
        </h3>
        <div className="space-y-3">
          {[["Email", user?.email || "—"], ["Role", "Medical Professional"], ["License Status", "Verified ✓"], ["Specialisation", "Obstetrics & Gynaecology"]].map(([k, v]) => (
            <div key={k} className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-sm text-slate-500">{k}</span>
              <span className="text-sm font-medium text-slate-800">{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-500" /> Notification Preferences
        </h3>
        {["Critical patient alerts", "New AI escalations", "Daily patient summary", "Missed appointment alerts"].map((item) => (
          <div key={item} className="flex justify-between items-center py-3 border-b border-slate-50">
            <span className="text-sm text-slate-700">{item}</span>
            <div className="w-10 h-6 bg-blue-500 rounded-full relative cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm" />
            </div>
          </div>
        ))}
      </div>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-5 flex items-center gap-4">
        <AlertCircle className="w-6 h-6 text-blue-500 flex-shrink-0" />
        <p className="text-sm text-slate-600">
          AI Co-Pilot responses are for clinical decision support only. All treatment decisions remain the physician's responsibility.
        </p>
      </div>
    </div>
  </div>
);

// ─── MAIN DASHBOARD ────────────────────────────────────────
const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<NavSection>("triage");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [search, setSearch] = useState("");
  const [isCoPilotOpen, setIsCoPilotOpen] = useState(false);

  const handleSelectPatient = (p: Patient) => {
    setSelectedPatient(p);
    setActiveSection("triage");
  };

  const criticalCount = MOCK_PATIENTS.filter((p) => p.riskLevel === "critical").length;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* ── Left Navigation Sidebar ── */}
      <nav className="w-64 bg-white border-r border-slate-100 flex flex-col flex-shrink-0 fixed h-full z-40">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
              <Heart className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm leading-none">Sona AI</p>
              <p className="text-xs text-slate-400 mt-0.5">Provider Console</p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <div className="flex-1 py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                {item.label}
                {item.id === "triage" && criticalCount > 0 && (
                  <span className="ml-auto text-xs font-bold bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                    {criticalCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Co-Pilot Toggle */}
        <div className="px-3 pb-3">
          <button
            onClick={() => setIsCoPilotOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 hover:from-indigo-100 hover:to-purple-100 transition-all border border-indigo-100"
          >
            <Sparkles className="w-5 h-5 text-indigo-500" />
            Clinical Co-Pilot
            <ChevronRight className="w-4 h-4 ml-auto text-indigo-400" />
          </button>
        </div>

        {/* User info + Logout */}
        <div className="px-4 py-4 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
              <UserRound className="w-5 h-5 text-slate-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">Dr. {user?.email?.split("@")[0] || "Physician"}</p>
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <p className="text-[11px] text-emerald-600">License Verified</p>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="w-full rounded-xl text-slate-600 border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 gap-2 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </Button>
        </div>
      </nav>

      {/* ── Main Content Area ── */}
      <div className="pl-64 flex-1 flex min-h-screen">
        {/* Triage Queue (left panel) — always visible in triage mode */}
        <AnimatePresence>
          {activeSection === "triage" && (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="w-[320px] bg-white border-r border-slate-100 flex-shrink-0 flex flex-col min-h-screen"
            >
              <TriageQueue
                search={search}
                setSearch={setSearch}
                selectedPatient={selectedPatient}
                onSelect={setSelectedPatient}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Central content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeSection === "triage" ? (
              selectedPatient ? (
                <PatientDetailView
                  key={selectedPatient.id}
                  patient={selectedPatient}
                  onVideoCall={() => alert(`Initiating video call with ${selectedPatient.name}...`)}
                />
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center min-h-screen text-center px-8"
                >
                  <div className="w-24 h-24 rounded-3xl bg-slate-100 flex items-center justify-center mb-6">
                    <UserRound className="w-12 h-12 text-slate-300" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-700 mb-2">Select a patient</h2>
                  <p className="text-slate-400 max-w-sm">
                    Choose a patient from the smart queue to view their AI clinical summary, vitals, and EHR details.
                  </p>
                  <div className="mt-8 flex flex-col items-center gap-2">
                    <p className="text-xs text-red-500 font-semibold uppercase tracking-wider animate-pulse">
                      ● {criticalCount} Critical patient{criticalCount > 1 ? "s" : ""} require{criticalCount === 1 ? "s" : ""} immediate attention
                    </p>
                  </div>
                </motion.div>
              )
            ) : activeSection === "roster" ? (
              <PatientRoster key="roster" onSelect={handleSelectPatient} />
            ) : activeSection === "analytics" ? (
              <AnalyticsPanel key="analytics" />
            ) : (
              <SettingsPanel key="settings" user={user} />
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* ── Clinical Co-Pilot Drawer ── */}
      <CoPilotDrawer
        patient={selectedPatient}
        isOpen={isCoPilotOpen}
        onClose={() => setIsCoPilotOpen(false)}
      />

      {/* Overlay when drawer is open */}
      <AnimatePresence>
        {isCoPilotOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCoPilotOpen(false)}
            className="fixed inset-0 bg-black/20 z-40"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DoctorDashboard;
