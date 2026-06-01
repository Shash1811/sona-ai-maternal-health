import { Home, Heart, MessageCircle, Activity, User, Utensils, Globe } from 'lucide-react';
import { Tab } from './BottomNav';
import { useLanguage } from '@/contexts/LanguageContext';

interface DesktopNavProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

export const DesktopNav: React.FC<DesktopNavProps> = ({ active, onChange }) => {
  const { t } = useLanguage();

  const navItems = [
    { id: 'home' as Tab, label: t("nav.home", "Home"), icon: Home },
    { id: 'health' as Tab, label: t("nav.health", "Health"), icon: Heart },
    { id: 'ecosystem' as Tab, label: t("nav.ecosystem", "Ecosystem"), icon: Globe },
    { id: 'sona' as Tab, label: t("nav.sona_ai", "Sona AI"), icon: MessageCircle },
    { id: 'activities' as Tab, label: t("nav.activities", "Activities"), icon: Activity },
    { id: 'profile' as Tab, label: t("nav.profile", "Profile"), icon: User },
  ];

  return (
    <div className="hidden lg:block w-64 bg-white border-r border-gray-200 shadow-lg min-h-screen">
      <div className="p-6">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg">
            <Heart className="w-5 h-5 text-white" fill="currentColor" />
          </div>
          <h1 className="text-xl font-serif font-bold text-gray-800">Sona</h1>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Diet Link */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <a
            href="/diet"
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
          >
            <Utensils className="w-5 h-5" />
            <span className="font-medium">{t("home.action_diet", "Diet Guide")}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
