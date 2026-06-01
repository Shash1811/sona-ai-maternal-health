import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MapPin, Phone, Dumbbell, Utensils, Baby, CalendarDays, Stethoscope, Heart, Activity, Pill, BookOpen } from "lucide-react";
import MoodCheckin from "@/components/MoodCheckin";
import GrowthTracker from "@/components/GrowthTracker";
import { useLanguage } from "@/contexts/LanguageContext";

const HealthTab = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [showMood, setShowMood] = useState(true);
  const [showGrowth, setShowGrowth] = useState(false);

  const babyInfo = {
    week: 24,
    size: t("home.baby_size", "An ear of corn 🌽"),
    weight: "~600g",
    milestone: t("home.daily_tip", "Baby can hear sounds and respond to light!"),
  };

  const features = [
    { icon: MapPin, label: t("health.hospitals", "Find Hospitals"), desc: t("health.hospitals_desc", "Near you"), color: "bg-pink-light", route: "/find-hospitals" },
    { icon: Phone, label: t("health.doctors", "Contact Doctors"), desc: t("health.doctors_desc", "Get help fast"), color: "bg-rose-light", route: "/contact-doctors" },
    { icon: Dumbbell, label: t("home.action_exercise", "Yoga & Exercise"), desc: t("home.action_exercise_desc", "Stay active safely"), color: "bg-lavender", route: "/exercises" },
    { icon: Utensils, label: t("home.action_diet", "Diet Plans"), desc: t("home.action_diet_desc", "Nutrition guide"), color: "bg-gold-light", route: "/diet-guide" },
    { icon: Baby, label: t("health.kick", "Kick Counter"), desc: t("health.kick_desc", "Track movements"), color: "bg-blush", route: "/kick-counter" },
    { icon: CalendarDays, label: t("health.calendar", "Health Calendar"), desc: t("health.calendar_desc", "Appointments"), color: "bg-pink-light", route: "/health-calendar" },
    { icon: Stethoscope, label: t("health.symptom", "Symptom Checker"), desc: t("health.symptom_desc", "Quick assessment"), color: "bg-rose-light", route: "/symptom-checker" },
    { icon: Pill, label: t("health.medication", "Medication Tracker"), desc: t("health.medication_desc", "Never miss a dose"), color: "bg-lavender", route: "/medication-tracker" },
    { icon: Activity, label: t("health.vitals", "Vitals Monitor"), desc: t("health.vitals_desc", "BP & glucose"), color: "bg-gold-light", route: "/vitals-monitor" },
    { icon: Heart, label: t("profile.rate", "Mental Wellness"), desc: t("health.medication_desc", "Mood tracking"), color: "bg-blush", route: "/mental-wellness" },
    { icon: BookOpen, label: t("nav.activities", "Professional Resources"), desc: t("eco.coparent_desc", "WHO & clinical guidance"), color: "bg-lavender", route: "/professional-resources" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-4xl font-serif text-gray-900 mb-8 font-bold">{t("nav.health", "Health")} 💗</h1>

        {/* Baby Status Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-3xl bg-white shadow-lg border border-gray-200 mb-8"
        >
          <h2 className="text-2xl font-serif mb-4 text-gray-900 font-semibold">{t("home.journey", "Status of Your Baby")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-200">
              <p className="text-3xl font-bold text-gray-900">{babyInfo.week}</p>
              <p className="text-sm text-gray-600 font-semibold mt-1">{t("home.week", "Weeks")}</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-200">
              <p className="text-2xl font-bold text-gray-900">{babyInfo.size}</p>
              <p className="text-sm text-gray-600 font-semibold mt-1">Size</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-200">
              <p className="text-2xl font-bold text-gray-900">{babyInfo.weight}</p>
              <p className="text-sm text-gray-600 font-semibold mt-1">Weight</p>
            </div>
          </div>
          <p className="text-base text-gray-800 leading-relaxed font-medium">🌟 {babyInfo.milestone}</p>
        </motion.div>

        {/* Mood Check-in */}
        {showMood && <MoodCheckin onClose={() => setShowMood(false)} />}

        {/* Growth & Safety Toggle */}
        <div className="mb-8">
          <button
            onClick={() => setShowGrowth(!showGrowth)}
            className="w-full p-6 rounded-2xl bg-white shadow-lg border border-gray-200 flex items-center justify-between hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Baby className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="text-lg font-semibold text-gray-900">{t("home.action_milestones", "Growth & Safety Tracker")}</p>
                <p className="text-sm text-gray-600">{t("home.action_milestones_desc", "Milestones, vaccines & weekly summary")}</p>
              </div>
            </div>
            <span className="text-sm text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">
              {showGrowth ? t("common.back", "Hide") : t("home.join_now", "View")}
            </span>
          </button>
        </div>

        {showGrowth && <GrowthTracker />}

        {/* Features Grid */}
        <div>
          <h2 className="text-2xl font-serif text-gray-900 mb-6 font-bold">{t("health.title", "Health Tools")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.button
                key={f.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => f.route && navigate(f.route)}
                className={`${f.color} p-6 rounded-2xl text-left flex flex-col gap-3 hover:scale-[1.02] transition-transform shadow-md hover:shadow-lg border border-gray-200 cursor-pointer`}
              >
                <f.icon className="w-8 h-8 text-gray-800" />
                <p className="font-bold text-gray-900 text-base">{f.label}</p>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-normal break-words">{f.desc}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthTab;
