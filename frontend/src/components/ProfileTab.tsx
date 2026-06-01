import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Camera, ChevronRight, Globe, HelpCircle, LogOut, Share2, Shield, Star, User, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

const defaultProfile = {
  name: "Mama Sona",
  age: "28",
  pregnancyWeek: "24",
  gender: "Female",
};

const ProfileTab = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t, language } = useLanguage();
  const [profile, setProfile] = useState(defaultProfile);

  useEffect(() => {
    const stored = localStorage.getItem("sona_profile_details");
    if (stored) setProfile({ ...defaultProfile, ...JSON.parse(stored) });
  }, []);

  const settings = [
    { icon: Globe, label: t("profile.change_lang", "Change Language"), desc: language, route: "/profile/language" },
    { icon: Users, label: t("profile.single_dads", "Support for Single Dads"), desc: "Community and resources", route: "/profile/single-dads" },
    { icon: HelpCircle, label: t("profile.help", "Help and Support"), desc: "FAQ and contact", route: "/profile/help" },
    { icon: Shield, label: t("profile.privacy", "Privacy Policy"), desc: "Your data safety", route: "/profile/privacy" },
    { icon: Star, label: t("profile.rate", "Rate Us"), desc: "Share your feedback", route: "/profile/rate" },
    { icon: Share2, label: t("profile.share", "Share Sona AI"), desc: "Spread the love", route: "/profile/share" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background pb-24 text-gray-900">
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-2xl font-serif text-foreground font-bold">{t("profile.title", "Profile & Settings")}</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => navigate("/profile/edit")}
        className="mx-6 mb-6 p-6 rounded-3xl bg-card border border-border text-center cursor-pointer hover:bg-muted/40 transition-colors"
      >
        <div className="relative w-20 h-20 mx-auto mb-3">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-10 h-10 text-primary" />
          </div>
          <button
            onClick={(event) => {
              event.stopPropagation();
              navigate("/profile/edit");
            }}
            className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>
        <h2 className="text-lg font-serif text-foreground font-semibold">{profile.name}</h2>
        <p className="text-sm text-muted-foreground">{user?.email || "mama@sona.app"}</p>
        <div className="flex justify-center gap-6 mt-4">
          <div className="text-center">
            <p className="font-bold text-foreground">{profile.age}</p>
            <p className="text-xs text-muted-foreground">{t("profile.age", "Age")}</p>
          </div>
          <div className="w-px bg-border" />
          <div className="text-center">
            <p className="font-bold text-foreground">{profile.pregnancyWeek}w</p>
            <p className="text-xs text-muted-foreground">{t("profile.pregnant", "Pregnant")}</p>
          </div>
          <div className="w-px bg-border" />
          <div className="text-center">
            <p className="font-bold text-foreground">{profile.gender}</p>
            <p className="text-xs text-muted-foreground">{t("profile.gender", "Gender")}</p>
          </div>
        </div>
      </motion.div>

      <div className="mx-6 mb-6">
        <button
          onClick={() => navigate("/profile/co-parent")}
          className="w-full p-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center gap-3 hover:bg-primary/15 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-foreground">{t("profile.coparent_btn", "Co-Parent Sync")}</p>
            <p className="text-xs text-muted-foreground">{t("profile.coparent_desc", "Share the mental load")}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-primary" />
        </button>
      </div>

      <div className="px-6 space-y-2">
        {settings.map((setting, index) => (
          <motion.button
            key={setting.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => navigate(setting.route)}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-card hover:bg-muted transition-colors text-left border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <setting.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">{setting.label}</p>
                <p className="text-xs text-muted-foreground">{setting.desc}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </motion.button>
        ))}
      </div>

      <div className="px-6 mt-6">
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full rounded-2xl py-5 text-destructive border-destructive/30 hover:bg-destructive/10"
        >
          <LogOut className="w-5 h-5 mr-2" />
          {t("profile.logout", "Log Out")}
        </Button>
      </div>
    </div>
  );
};

export default ProfileTab;
