import { useEffect } from "react";
import { Heart } from "lucide-react";
import { useLocation, useSearchParams } from "react-router-dom";
import BottomNav, { Tab } from "@/components/BottomNav";
import { DesktopNav } from "@/components/DesktopNav";
import HomeTab from "@/components/HomeTab";
import HealthTab from "@/components/HealthTab";
import SonaAITab from "@/components/SonaAITab";
import ActivitiesTab from "@/components/ActivitiesTab";
import ProfileTab from "@/components/ProfileTab";
import EcosystemTab from "@/components/EcosystemTab";

import { NightModeProvider } from "@/contexts/NightModeContext";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // Derive active tab from URL query params (default to "home")
  const tab = (searchParams.get("tab") as Tab) || "home";

  // Switch tabs using replace:true so tab-switching does NOT create
  // new browser history entries. This means "Back" always returns
  // to the actual page the user came from, not a previous tab state.
  const setTab = (newTab: Tab) => {
    setSearchParams({ tab: newTab }, { replace: true });
  };

  // On mount only: respect location.state?.tab if set by a redirect
  // (e.g., Navigate to="/dashboard" state={{ tab: "activities" }})
  useEffect(() => {
    const requestedTab = location.state?.tab as Tab | undefined;
    if (requestedTab) {
      setSearchParams({ tab: requestedTab }, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  // This component is now wrapped in ProtectedRoute, so we know the user is authenticated
  return (
    <NightModeProvider>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative overflow-hidden">
        {/* Decorative Hearts Background - preserved aesthetic */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 text-pink-200/20 animate-pulse">
            <Heart className="w-32 h-32" fill="currentColor" />
          </div>
          <div className="absolute top-40 right-20 text-purple-200/20 animate-pulse" style={{ animationDelay: '1s' }}>
            <Heart className="w-24 h-24" fill="currentColor" />
          </div>
          <div className="absolute bottom-20 left-32 text-blue-200/20 animate-pulse" style={{ animationDelay: '2s' }}>
            <Heart className="w-28 h-28" fill="currentColor" />
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex min-h-screen">
          {/* Desktop Navigation Sidebar */}
          <div className="w-64 flex-shrink-0">
            <DesktopNav active={tab} onChange={setTab} />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex">
            <div className="max-w-6xl mx-auto w-full px-8 py-8">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 min-h-full">
                {tab === "home" && <HomeTab />}
                {tab === "health" && <HealthTab />}
                {tab === "ecosystem" && <EcosystemTab />}
                {tab === "sona" && <SonaAITab />}
                {tab === "activities" && <ActivitiesTab />}
                {tab === "profile" && <ProfileTab />}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="min-h-screen">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 mb-20">
                {tab === "home" && <HomeTab />}
                {tab === "health" && <HealthTab />}
                {tab === "ecosystem" && <EcosystemTab />}
                {tab === "sona" && <SonaAITab />}
                {tab === "activities" && <ActivitiesTab />}
                {tab === "profile" && <ProfileTab />}
              </div>
            </div>
          </div>
          
          {/* Mobile bottom navigation */}
          <div className="fixed bottom-0 left-0 right-0 z-20">
            <BottomNav active={tab} onChange={setTab} />
          </div>
        </div>
      </div>
    </NightModeProvider>
  );
};

export default Index;
