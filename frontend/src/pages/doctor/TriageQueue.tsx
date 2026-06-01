import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Activity,
  Search,
  ChevronRight,
  Clock,
  Baby,
  Stethoscope,
  ShieldAlert,
  ShieldCheck,
  CircleCheck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { MOCK_PATIENTS, Patient, RiskLevel } from "@/pages/doctor/mockData";

const riskConfig: Record<
  RiskLevel,
  { label: string; bg: string; text: string; border: string; icon: React.ReactNode; dot: string }
> = {
  critical: {
    label: "Critical",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
    icon: <ShieldAlert className="w-4 h-4 text-red-600" />,
  },
  high: {
    label: "High Risk",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
    icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
  },
  routine: {
    label: "Routine",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    icon: <CircleCheck className="w-4 h-4 text-emerald-600" />,
  },
};

interface Props {
  search: string;
  setSearch: (v: string) => void;
  selectedPatient: Patient | null;
  onSelect: (p: Patient) => void;
}

export const TriageQueue = ({ search, setSearch, selectedPatient, onSelect }: Props) => {
  // Sort: critical first, then high, then routine
  const sortOrder: RiskLevel[] = ["critical", "high", "routine"];
  const sorted = [...MOCK_PATIENTS].sort(
    (a, b) => sortOrder.indexOf(a.riskLevel) - sortOrder.indexOf(b.riskLevel)
  );

  const filtered = sorted.filter((p) =>
    `${p.name} ${p.primarySymptom}`.toLowerCase().includes(search.toLowerCase())
  );

  const criticalCount = MOCK_PATIENTS.filter((p) => p.riskLevel === "critical").length;
  const highCount = MOCK_PATIENTS.filter((p) => p.riskLevel === "high").length;

  return (
    <div className="flex flex-col h-full">
      {/* Queue Header */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-slate-800 text-sm">Smart Queue</h2>
          </div>
          <span className="text-xs text-slate-500">{filtered.length} patients</span>
        </div>

        {/* Risk summary pills */}
        <div className="flex gap-2 mb-4">
          <span className="flex items-center gap-1.5 text-xs font-medium bg-red-50 text-red-700 px-2.5 py-1 rounded-full border border-red-100">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            {criticalCount} Critical
          </span>
          <span className="flex items-center gap-1.5 text-xs font-medium bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-100">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            {highCount} High
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patients..."
            className="pl-9 h-9 text-sm bg-slate-50 border-slate-200 rounded-xl"
          />
        </div>
      </div>

      {/* Patient rows */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {filtered.map((patient, i) => {
            const risk = riskConfig[patient.riskLevel];
            const isSelected = selectedPatient?.id === patient.id;

            return (
              <motion.button
                key={patient.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => onSelect(patient)}
                className={`w-full text-left px-4 py-4 border-b border-slate-50 transition-all group ${
                  isSelected
                    ? "bg-blue-50 border-l-4 border-l-blue-500"
                    : "hover:bg-slate-50/80 border-l-4 border-l-transparent"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Risk dot */}
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${risk.dot} ${patient.riskLevel === 'critical' ? 'animate-pulse' : ''}`} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-slate-800 text-sm truncate">{patient.name}</p>
                      <ChevronRight className={`w-4 h-4 text-slate-300 flex-shrink-0 transition-transform ${isSelected ? 'rotate-90' : 'group-hover:translate-x-0.5'}`} />
                    </div>

                    {/* Age + pregnancy context */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-slate-500">Age {patient.age}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Baby className="w-3 h-3" />
                        {patient.gestationWeek
                          ? `${patient.gestationWeek}w gestation`
                          : `${patient.daysPostpartum}d postpartum`}
                      </div>
                    </div>

                    {/* Primary symptom */}
                    <p className="text-xs text-slate-600 truncate mb-2">
                      <Stethoscope className="w-3 h-3 inline mr-1 text-slate-400" />
                      {patient.primarySymptom}
                    </p>

                    {/* Risk badge + last seen */}
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${risk.bg} ${risk.text}`}>
                        {risk.icon}
                        {risk.label}
                        {patient.erAdvised && " · ER Advised"}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock className="w-3 h-3" />
                        {patient.lastSeen}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-slate-400">No patients found</div>
        )}
      </div>
    </div>
  );
};
