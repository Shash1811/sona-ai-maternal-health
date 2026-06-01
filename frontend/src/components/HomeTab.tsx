import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Baby, Moon, Scale, Utensils, LogIn, UserPlus, Sun, Heart, Brain, Users, Shield, Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNightMode } from "@/contexts/NightModeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import carouselDiet from "@/assets/carousel-diet.jpg";
import carouselMusic from "@/assets/carousel-music.jpg";
import carouselBrain from "@/assets/carousel-brain.jpg";
import carouselStress from "@/assets/carousel-stress.jpg";

const HomeTab = () => {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { nightMode, toggleNightMode } = useNightMode();
  const { user } = useAuth();
  const navigate = useNavigate();

  const slides = [
    { image: carouselDiet, title: t("home.action_diet", "Diet for Mom & Baby"), subtitle: t("home.action_diet_desc", "Nutrition tips for every stage"), route: "/diet-guide" },
    { image: carouselMusic, title: t("home.action_music", "Soothing Music"), subtitle: t("home.action_music_desc", "Calming melodies for you & baby"), route: "/music" },
    { image: carouselBrain, title: t("home.action_games", "Brain Games"), subtitle: t("home.action_games_desc", "Fun activities for development"), route: "/brain-games" },
    { image: carouselStress, title: t("home.breathing_title", "Stress Reliever"), subtitle: t("home.breathing_desc", "Mindfulness & relaxation"), route: "/activities/breathing" },
  ];

  const trackers = [
    { icon: Moon, label: t("home.action_music", "Sleep Sync"), value: "5.2 hrs", color: "bg-pink-light" },
    { icon: Scale, label: t("health.vitals", "Weight"), value: "62.5 kg", color: "bg-rose-light" },
    { icon: Utensils, label: t("home.action_diet", "Daily Diet"), value: "1,850 cal", color: "bg-lavender" },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((p) => (p + 1) % slides.length), 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const features = [
    {
      icon: <Heart className="w-8 h-8 text-pink-500" />,
      title: t("home.action_diet", "Personalized Diet Plans"),
      description: t("home.action_diet_desc", "AI-powered nutrition recommendations tailored to your pregnancy stage and dietary preferences")
    },
    {
      icon: <Brain className="w-8 h-8 text-purple-500" />,
      title: t("profile.coparent_btn", "Medical Professional Sync"),
      description: t("eco.coparent_desc", "Connect with healthcare providers and sync your health data for comprehensive care")
    },
    {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      title: t("home.community_title", "Community Support"),
      description: t("home.community_desc", "Join a supportive community of mothers and experts sharing experiences and advice")
    }
  ];

  return (
    <div className="min-h-screen bg-background lg:bg-transparent lg:p-0">
      {/* Professional Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-400 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" fill="currentColor" />
                </div>
                <span className="text-xl font-bold text-foreground font-serif">Sona AI</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6 py-2"
                >
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/auth')}
                    className="border-border hover:bg-accent rounded-xl px-6 py-2"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => navigate('/auth')}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6 py-2"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg z-50 border-t border-border"
              >
                <div className="px-4 py-4 space-y-2">
                  {user ? (
                    <Button 
                      onClick={() => {
                        navigate('/dashboard');
                        setMobileMenuOpen(false);
                      }}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6 py-3 w-full"
                    >
                      Go to Dashboard
                    </Button>
                  ) : (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          navigate('/auth');
                          setMobileMenuOpen(false);
                        }}
                        className="border-border hover:bg-accent rounded-xl px-6 py-3 w-full"
                      >
                        Sign In
                      </Button>
                      <Button 
                        onClick={() => {
                          navigate('/auth');
                          setMobileMenuOpen(false);
                        }}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6 py-3 w-full"
                      >
                        Sign Up
                      </Button>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 font-serif leading-tight">
                AI-Powered Maternal Care & Health Tracking
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                Experience personalized pregnancy care with intelligent nutrition planning, 
                health monitoring, and expert support tailored for your unique journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/auth')}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-xl px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Start Your Journey
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')}
                  className="border-border hover:bg-accent rounded-xl px-8 py-4 text-lg font-semibold"
                >
                  View Demo
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-200 rounded-full opacity-20 -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-200 rounded-full opacity-20 -ml-24 -mb-24"></div>
      </section>

      {/* Main Content - Professional Layout */}
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section - Slideshow + Pregnancy Tracker */}
            <section className="py-16">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* Slideshow - Maintained Position */}
                <div className="flex-1">
                  <div 
                    className="rounded-2xl overflow-hidden relative h-80 aspect-video cursor-pointer hover:shadow-lg transition-all duration-300 group"
                    onClick={() => navigate(slides[currentSlide].route)}
                  >
                    {/* Left Arrow */}
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-white/50 shadow-lg flex items-center justify-center text-slate-700 hover:bg-white/90 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </motion.button>

                    {/* Right Arrow */}
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentSlide((prev) => (prev + 1) % slides.length);
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-white/50 shadow-lg flex items-center justify-center text-slate-700 hover:bg-white/90 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0"
                      >
                        <img src={slides[currentSlide].image} alt={slides[currentSlide].title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
                          <h3 className="text-white font-serif text-2xl font-bold">{slides[currentSlide].title}</h3>
                          <p className="text-white/90 text-lg">{slides[currentSlide].subtitle}</p>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                      {slides.map((_, i) => (
                        <button key={i} onClick={(e) => {
                          e.stopPropagation();
                          setCurrentSlide(i);
                        }}
                          className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? "bg-white w-6" : "bg-white/50"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pregnancy Tracker - Maintained Position */}
                <div className="md:w-96">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="p-8 rounded-2xl bg-primary text-primary-foreground h-full hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm opacity-80">Pregnancy Timeline</span>
                      <span className="text-sm font-bold bg-primary-foreground/20 px-4 py-2 rounded-full">Week 24</span>
                    </div>
                    <div className="w-full bg-primary-foreground/20 rounded-full h-3 mb-6">
                      <div className="bg-white h-3 rounded-full" style={{ width: "60%" }} />
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                        <Baby className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-xl font-serif">Baby Talk &#x1f3a7;</p>
                        <p className="text-sm opacity-90">Baby's hearing is developing today! They can hear your heartbeat and voice.</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Feature Value Grid */}
            <section className="py-16 border-t border-border">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Sona AI?</h2>
                <p className="text-lg text-muted-foreground">Comprehensive maternal care powered by artificial intelligence</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center p-8 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Smart Trackers Section */}
            <section className="py-16 border-t border-border">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">Smart Trackers</h2>
                <p className="text-lg text-muted-foreground">Monitor your health and wellness journey</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                {trackers.map((t) => (
                  <motion.div 
                    key={t.label} 
                    whileHover={{ scale: 1.03 }} 
                    className={`p-6 rounded-2xl ${t.color} flex flex-col gap-3 h-48 w-64 hover:shadow-lg transition-shadow duration-300`}
                  >
                    <t.icon className="w-6 h-6 text-foreground/70" />
                    <span className="text-sm text-muted-foreground">{t.label}</span>
                    <span className="font-bold text-lg text-foreground">{t.value}</span>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Community Section */}
            <section className="py-16 border-t border-border">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">Join the Sona Community</h2>
                <p className="text-lg text-muted-foreground">Save your progress and connect with other moms</p>
              </div>
              <div className="flex justify-center">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 w-full max-w-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Connect with Moms</h3>
                      <p className="text-sm text-gray-600 mt-2">Share experiences, ask questions, and support each other</p>
                    </div>
                    <Button 
                      onClick={() => navigate('/community')}
                      className="w-full rounded-2xl py-5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
                    >
                      Join Community
                    </Button>
                  </div>
                </motion.div>
              </div>
            </section>
          </div>
        </div>

        {/* Mobile Layout - Preserved Order */}
        <div className="lg:hidden space-y-6">
          {/* Slideshow - Maintained Position */}
          <div 
            className="rounded-2xl overflow-hidden relative h-44 sm:h-48 cursor-pointer hover:shadow-lg transition-shadow duration-300 group"
            onClick={() => navigate(slides[currentSlide].route)}
          >
            {/* Left Arrow - Mobile */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md border border-white/50 shadow-lg flex items-center justify-center text-slate-700 hover:bg-white/90 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>

            {/* Right Arrow - Mobile */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide((prev) => (prev + 1) % slides.length);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md border border-white/50 shadow-lg flex items-center justify-center text-slate-700 hover:bg-white/90 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <img src={slides[currentSlide].image} alt={slides[currentSlide].title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-white font-serif text-lg sm:text-xl font-bold">{slides[currentSlide].title}</h3>
                  <p className="text-white/80 text-sm sm:text-base">{slides[currentSlide].subtitle}</p>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {slides.map((_, i) => (
                <button key={i} onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide(i);
                }}
                  className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? "bg-white w-5" : "bg-white/50"}`}
                />
              ))}
            </div>
          </div>

          {/* Pregnancy Tracker - Maintained Position */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="p-6 rounded-2xl bg-primary text-primary-foreground hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm opacity-80">Pregnancy Timeline</span>
              <span className="text-sm font-bold bg-primary-foreground/20 px-3 py-1 rounded-full">Week 24</span>
            </div>
            <div className="w-full bg-primary-foreground/20 rounded-full h-2 mb-4">
              <div className="bg-white h-2 rounded-full" style={{ width: "60%" }} />
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Baby className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-lg sm:text-xl font-serif">Baby Talk &#x1f3a7;</p>
                <p className="text-sm opacity-90">Baby's hearing is developing today! They can hear your heartbeat and voice.</p>
              </div>
            </div>
          </motion.div>

          {/* Feature Grid - Mobile */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground text-center">Why Choose Sona AI?</h2>
            {features.map((feature, index) => (
              <div key={index} className="p-6 rounded-2xl bg-card border border-border">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Smart Trackers */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">Smart Trackers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {trackers.map((t) => (
                <motion.div key={t.label} whileHover={{ scale: 1.03 }}
                  className={`p-4 rounded-2xl ${t.color} flex flex-col gap-2 hover:shadow-lg transition-shadow duration-300`}
                >
                  <t.icon className="w-5 h-5 text-foreground/70" />
                  <span className="text-xs text-muted-foreground">{t.label}</span>
                  <span className="font-bold text-foreground">{t.value}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Community Section */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/community')}
            className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 cursor-pointer hover:shadow-xl transition-all duration-300"
          >
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Join the Community</h2>
              <p className="text-sm text-gray-600 mb-4">Share experiences and support each other</p>
              <Button 
                className="w-full rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                onClick={(e) => { e.stopPropagation(); navigate('/community'); }}
              >
                Join Now
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Production Footer */}
      <footer className="bg-muted/50 border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="col-span-2 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-400 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" fill="currentColor" />
                </div>
                <span className="text-xl font-bold text-foreground font-serif">Sona AI</span>
              </div>
              <p className="text-muted-foreground mb-4 font-sans text-sm">
                AI-powered maternal care and health tracking for expecting and new mothers.
              </p>
              <p className="text-sm text-muted-foreground font-sans">
                © 2024 Sona AI. All rights reserved.
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-semibold text-sm text-foreground mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-sm text-foreground mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-sm text-foreground mb-4">Quality & Trust</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/test-cases" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    Test Cases
                  </Link>
                </li>
                <li><Link to="/test-cases" className="text-muted-foreground hover:text-foreground transition-colors">RAG Chatbot Evaluator</Link></li>
                <li><Link to="/test-cases" className="text-muted-foreground hover:text-foreground transition-colors">Clinical Baselines</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeTab;