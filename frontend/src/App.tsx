import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/auth";

// Pages
import Index from "./pages/Index.tsx";
import DoctorDashboard from "./pages/DoctorDashboard.tsx";
import NotFound from "./pages/NotFound.tsx";
import DietInfoPage from "./pages/DietInfoPage.tsx";
import DietPage from "./pages/DietPage.tsx";
import ExercisePage from "./pages/ExercisePage.tsx";
import MilestonesPage from "./pages/MilestonesPage.tsx";
import MusicPage from "./pages/MusicPage.tsx";
import BrainGamesPage from "./pages/BrainGamesPage.tsx";
import CommunityPage from "./pages/CommunityPage.tsx";

// Health Pages
import FindHospitalsPage from "./pages/health/FindHospitalsPage.tsx";
import ContactDoctorsPage from "./pages/health/ContactDoctorsPage.tsx";
import KickCounterPage from "./pages/health/KickCounterPage.tsx";
import HealthCalendarPage from "./pages/health/HealthCalendarPage.tsx";
import SymptomCheckerPage from "./pages/health/SymptomCheckerPage.tsx";
import MedicationTrackerPage from "./pages/health/MedicationTrackerPage.tsx";
import VitalsMonitorPage from "./pages/health/VitalsMonitorPage.tsx";
import MentalWellnessPage from "./pages/health/MentalWellnessPage.tsx";
import ProfessionalResourcesPage from "./pages/health/ProfessionalResourcesPage.tsx";

// Footer Pages
import FeaturesPage from "./pages/footer/FeaturesPage.tsx";
import PricingPage from "./pages/footer/PricingPage.tsx";
import AboutPage from "./pages/footer/AboutPage.tsx";
import PrivacyPage from "./pages/footer/PrivacyPage.tsx";
import TermsPage from "./pages/footer/TermsPage.tsx";
import ContactPage from "./pages/footer/ContactPage.tsx";
import TestCasesPage from "./pages/footer/TestCasesPage.tsx";



// Activities Pages
import BreathingPage from "./pages/StressReliefPage.tsx";
import MeditationPage from "./pages/activities/MeditationPage.jsx";
import YogaPage from "./pages/activities/YogaPage.jsx";
import MindfulnessPage from "./pages/activities/MindfulnessPage.jsx";
import RelaxationPage from "./pages/activities/RelaxationPage.jsx";
import ActivitySessionPage from "./pages/activities/ActivitySessionPage";
import MicroSelfCarePage from "./pages/activities/MicroSelfCarePage";
import ProfileDetailPage from "./pages/profile/ProfileDetailPage";
import ProfileEditPage from "./pages/profile/ProfileEditPage";

// Components
import { AuthScreen } from "@/components/auth/AuthScreen";
import { MaternalQuestionnaire } from "@/components/questionnaire/MaternalQuestionnaire";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const RoleDashboard = () => {
  const { user } = useAuth();
  if (user?.role === UserRole.MEDICAL_PROFESSIONAL) {
    return <DoctorDashboard />;
  }
  return <Index />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
          <Routes>
            {/* Default route - redirect to auth for unauthenticated users */}
            <Route path="/" element={<Navigate to="/auth" replace />} />
            
            {/* Authentication routes */}
            <Route path="/auth" element={<AuthScreen />} />
            
            {/* Test route - bypass authentication for debugging */}
            <Route path="/test" element={
              <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">Test Page Working!</h1>
                  <p className="text-lg text-gray-600">If you can see this, the app is working.</p>
                  <a href="/auth" className="mt-4 inline-block px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600">
                    Go to Auth
                  </a>
                </div>
              </div>
            } />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <RoleDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/diet" element={
              <ProtectedRoute>
                <DietInfoPage />
              </ProtectedRoute>
            } />
            
            <Route path="/diet-guide" element={
              <ProtectedRoute>
                <DietPage />
              </ProtectedRoute>
            } />
            
            <Route path="/exercises" element={
              <ProtectedRoute>
                <ExercisePage />
              </ProtectedRoute>
            } />
            
            <Route path="/milestones" element={
              <ProtectedRoute>
                <MilestonesPage />
              </ProtectedRoute>
            } />
            
            <Route path="/music" element={
              <ProtectedRoute>
                <MusicPage />
              </ProtectedRoute>
            } />
            
            <Route path="/brain-games" element={
              <ProtectedRoute>
                <BrainGamesPage />
              </ProtectedRoute>
            } />
            
            <Route path="/community" element={
              <ProtectedRoute>
                <CommunityPage />
              </ProtectedRoute>
            } />
            
            {/* Health Tool routes */}
            <Route path="/find-hospitals" element={
              <ProtectedRoute>
                <FindHospitalsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/contact-doctors" element={
              <ProtectedRoute>
                <ContactDoctorsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/kick-counter" element={
              <ProtectedRoute>
                <KickCounterPage />
              </ProtectedRoute>
            } />
            
            <Route path="/health-calendar" element={
              <ProtectedRoute>
                <HealthCalendarPage />
              </ProtectedRoute>
            } />
            
            <Route path="/symptom-checker" element={
              <ProtectedRoute>
                <SymptomCheckerPage />
              </ProtectedRoute>
            } />
            
            <Route path="/medication-tracker" element={
              <ProtectedRoute>
                <MedicationTrackerPage />
              </ProtectedRoute>
            } />
            
            <Route path="/vitals-monitor" element={
              <ProtectedRoute>
                <VitalsMonitorPage />
              </ProtectedRoute>
            } />
            
            <Route path="/mental-wellness" element={
              <ProtectedRoute>
                <MentalWellnessPage />
              </ProtectedRoute>
            } />

            <Route path="/professional-resources" element={
              <ProtectedRoute>
                <ProfessionalResourcesPage />
              </ProtectedRoute>
            } />

            
            {/* Activities routes */}
            <Route path="/activities/breathing" element={
              <ProtectedRoute>
                <BreathingPage />
              </ProtectedRoute>
            } />

            <Route path="/activities" element={<Navigate to="/dashboard?tab=activities" replace />} />
            
            <Route path="/activities/meditation" element={
              <ProtectedRoute>
                <MeditationPage />
              </ProtectedRoute>
            } />
            
            <Route path="/activities/yoga" element={
              <ProtectedRoute>
                <YogaPage />
              </ProtectedRoute>
            } />
            
            <Route path="/activities/mindfulness" element={
              <ProtectedRoute>
                <MindfulnessPage />
              </ProtectedRoute>
            } />
            
            <Route path="/activities/relaxation" element={
              <ProtectedRoute>
                <RelaxationPage />
              </ProtectedRoute>
            } />

            <Route path="/activities/session/:sessionId" element={
              <ProtectedRoute>
                <ActivitySessionPage />
              </ProtectedRoute>
            } />

            <Route path="/activities/self-care/:activityId" element={
              <ProtectedRoute>
                <MicroSelfCarePage />
              </ProtectedRoute>
            } />

            <Route path="/profile" element={<Navigate to="/dashboard?tab=profile" replace />} />

            <Route path="/profile/edit" element={
              <ProtectedRoute>
                <ProfileEditPage />
              </ProtectedRoute>
            } />

            <Route path="/profile/:section" element={
              <ProtectedRoute>
                <ProfileDetailPage />
              </ProtectedRoute>
            } />
            
            {/* Questionnaire route - for mom onboarding */}
            <Route path="/questionnaire" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
                  <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="text-center mb-8">
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Sona AI! 💕</h1>
                      <p className="text-gray-600">Please complete this quick questionnaire to personalize your experience</p>
                    </div>
                    <MaternalQuestionnaire />
                  </div>
                </div>
              </ProtectedRoute>
            } />
            
            {/* Footer routes */}
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/test-cases" element={<TestCasesPage />} />

            {/* Fallback route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </TooltipProvider>
</QueryClientProvider>
);

export default App;
