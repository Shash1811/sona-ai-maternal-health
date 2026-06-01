// ============================================================
// MOCK DATA — Doctor Dashboard
// Replace with real API calls when backend is ready.
// ============================================================

export type RiskLevel = "critical" | "high" | "routine";

export interface Vital {
  label: string;
  value: string;
  unit: string;
  status: "normal" | "warning" | "critical";
}

export interface Patient {
  id: number;
  name: string;
  age: number;
  email: string;
  phone: string;
  riskLevel: RiskLevel;
  primarySymptom: string;
  gestationWeek?: number;
  daysPostpartum?: number;
  lastSeen: string;
  aiSummary: string;
  erAdvised: boolean;
  medicalHistory: string[];
  allergies: string[];
  medications: string[];
  vitals: Vital[];
  visits: {
    date: string;
    summary: string;
  }[];
}

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 1,
    name: "Priya Sharma",
    age: 29,
    email: "priya.sharma@email.com",
    phone: "+91 98765 43210",
    riskLevel: "critical",
    primarySymptom: "Severe upper abdominal pain + headache",
    gestationWeek: 34,
    lastSeen: "2 hours ago",
    erAdvised: true,
    aiSummary:
      "Patient reports severe upper abdominal pain (9/10) and persistent headache starting approximately 12 hours ago. Sona AI flagged these as potential signs of HELLP syndrome and immediately advised an ER visit. Patient also reports visual disturbances (flashing lights) and edema in hands and face. No reported vaginal bleeding. No fever. Last BP reading self-reported at 158/105 mmHg. Sona AI instructed patient to avoid eating and to call 108 immediately.",
    medicalHistory: ["Gestational hypertension (onset at 28 weeks)", "Iron-deficiency anemia"],
    allergies: ["Penicillin", "Sulfa drugs"],
    medications: ["Labetalol 200mg twice daily", "Ferrous sulfate 325mg", "Prenatal vitamins"],
    vitals: [
      { label: "Blood Pressure", value: "158/105", unit: "mmHg", status: "critical" },
      { label: "Heart Rate", value: "98", unit: "bpm", status: "warning" },
      { label: "SpO₂", value: "97", unit: "%", status: "normal" },
      { label: "Temperature", value: "37.1", unit: "°C", status: "normal" },
    ],
    visits: [
      { date: "Apr 28, 2026", summary: "Routine 34-week check. BP elevated (142/90). Increased Labetalol dose." },
      { date: "Apr 14, 2026", summary: "32-week check. Mild edema noted. Patient counselled on warning signs." },
      { date: "Mar 30, 2026", summary: "Anemia follow-up. Hb 9.8 g/dL. Started iron supplementation." },
    ],
  },
  {
    id: 2,
    name: "Ananya Reddy",
    age: 26,
    email: "ananya.reddy@email.com",
    phone: "+91 87654 32109",
    riskLevel: "high",
    primarySymptom: "Postpartum fever + breast engorgement",
    daysPostpartum: 8,
    lastSeen: "5 hours ago",
    erAdvised: false,
    aiSummary:
      "Patient is 8 days postpartum and reports low-grade fever (38.1°C) and significant right breast engorgement with redness for the past 2 days. Sona AI assessed potential early mastitis and advised warm compresses, frequent feeding, and to seek care within 24 hours if no improvement. Patient also reports increased lochia (bright red). Sona AI flagged this for physician follow-up. Baby is feeding but reportedly fussy.",
    medicalHistory: ["C-section delivery (8 days ago)", "Gestational diabetes (diet-controlled)"],
    allergies: ["NSAIDs"],
    medications: ["Ibuprofen 400mg as needed", "Postpartum vitamins"],
    vitals: [
      { label: "Blood Pressure", value: "118/76", unit: "mmHg", status: "normal" },
      { label: "Heart Rate", value: "88", unit: "bpm", status: "normal" },
      { label: "Temperature", value: "38.1", unit: "°C", status: "warning" },
      { label: "SpO₂", value: "99", unit: "%", status: "normal" },
    ],
    visits: [
      { date: "Apr 25, 2026", summary: "C-section delivery — uncomplicated. Baby weight 3.1 kg." },
      { date: "Apr 12, 2026", summary: "38-week check. GDM well-controlled. NST reactive." },
    ],
  },
  {
    id: 3,
    name: "Meera Pillai",
    age: 32,
    email: "meera.pillai@email.com",
    phone: "+91 76543 21098",
    riskLevel: "high",
    primarySymptom: "Reduced fetal movements",
    gestationWeek: 38,
    lastSeen: "1 day ago",
    erAdvised: false,
    aiSummary:
      "Patient at 38 weeks reports she has noticed significantly reduced fetal movement over the past 6 hours (counted fewer than 3 movements in 2 hours). Sona AI immediately escalated this, advised patient to lie on her left side and count kicks for 2 hours. Patient re-reported 4 movements total. Sona AI advised scheduling an NST today and to call the clinic immediately if movements remain low. No contractions reported. Patient has a history of a previous late stillbirth.",
    medicalHistory: ["Previous late stillbirth (37 weeks, 2023)", "Anxiety disorder", "BMI 31"],
    allergies: ["Latex"],
    medications: ["Sertraline 50mg daily", "Low-dose aspirin 81mg"],
    vitals: [
      { label: "Blood Pressure", value: "126/82", unit: "mmHg", status: "normal" },
      { label: "Heart Rate", value: "84", unit: "bpm", status: "normal" },
      { label: "Temperature", value: "36.8", unit: "°C", status: "normal" },
      { label: "SpO₂", value: "98", unit: "%", status: "normal" },
    ],
    visits: [
      { date: "Apr 29, 2026", summary: "37-week check. Reactive NST. Cephalic presentation. Discussing birth plan." },
      { date: "Apr 15, 2026", summary: "35-week check. Growth scan — AC on 55th percentile." },
    ],
  },
  {
    id: 4,
    name: "Kavita Nair",
    age: 24,
    email: "kavita.nair@email.com",
    phone: "+91 65432 10987",
    riskLevel: "routine",
    primarySymptom: "Morning sickness / nausea",
    gestationWeek: 10,
    lastSeen: "3 days ago",
    erAdvised: false,
    aiSummary:
      "First-trimester patient at 10 weeks reporting moderate nausea and vomiting (2–3 times/day) primarily in the morning. Sona AI provided dietary guidance (small frequent meals, ginger, dry crackers) and confirmed this is within the range of normal. Patient has been unable to tolerate prenatal vitamins. Sona AI suggested switching to gummy vitamins and taking them at night. No red flags identified. Follow-up scheduled for 12-week dating scan.",
    medicalHistory: ["PCOS", "Hypothyroidism (treated)"],
    allergies: ["None known"],
    medications: ["Levothyroxine 50mcg", "Folic acid 5mg"],
    vitals: [
      { label: "Blood Pressure", value: "110/70", unit: "mmHg", status: "normal" },
      { label: "Heart Rate", value: "79", unit: "bpm", status: "normal" },
      { label: "Temperature", value: "36.6", unit: "°C", status: "normal" },
      { label: "Weight", value: "58.2", unit: "kg", status: "normal" },
    ],
    visits: [
      { date: "Apr 10, 2026", summary: "First antenatal visit. Dating confirmed at 8+2 weeks. Baseline labs ordered." },
    ],
  },
  {
    id: 5,
    name: "Sushma Joshi",
    age: 35,
    email: "sushma.joshi@email.com",
    phone: "+91 54321 09876",
    riskLevel: "routine",
    primarySymptom: "Lower back pain (postpartum)",
    daysPostpartum: 45,
    lastSeen: "1 week ago",
    erAdvised: false,
    aiSummary:
      "Patient is 45 days postpartum and reporting persistent lower back pain (4/10), especially when breastfeeding. Sona AI provided postural advice and suggested gentle core exercises. Pain is non-radiating and relieved with rest. Patient's mood screen (Edinburgh score) was 6 — within normal range. Lochia has resolved. Breastfeeding is going well. Patient enquired about contraception options — Sona AI provided information and recommended a discussion with the physician.",
    medicalHistory: ["Vaginal delivery (45 days ago)", "Episiotomy (healed)"],
    allergies: ["Codeine"],
    medications: ["Postpartum vitamins"],
    vitals: [
      { label: "Blood Pressure", value: "114/72", unit: "mmHg", status: "normal" },
      { label: "Heart Rate", value: "72", unit: "bpm", status: "normal" },
      { label: "Temperature", value: "36.7", unit: "°C", status: "normal" },
      { label: "Weight", value: "63.5", unit: "kg", status: "normal" },
    ],
    visits: [
      { date: "Apr 20, 2026", summary: "6-week postpartum check. Physical recovery excellent. Contraception counselled." },
      { date: "Mar 20, 2026", summary: "Delivery — SVD, 3.4 kg baby girl. Apgar 9/10." },
    ],
  },
];

export const COPILOT_SUGGESTIONS = [
  "Summarize the last 3 visits",
  "Check drug interactions",
  "Draft a clinical note",
  "Flag for urgent review",
];
