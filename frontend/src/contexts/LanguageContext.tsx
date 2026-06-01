import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'English' | 'Hindi' | 'Kannada' | 'Tamil' | 'Telugu';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Comprehensive dictionary for Sona AI Maternal App - English, Hindi, and Kannada
const translations: Record<Language, Record<string, string>> = {
  English: {
    // Nav & Common
    "nav.home": "Home",
    "nav.health": "Health",
    "nav.ecosystem": "Ecosystem",
    "nav.activities": "Activities",
    "nav.sona_ai": "Sona AI",
    "nav.profile": "Profile",
    "common.back": "Back",
    "common.save": "Save",
    "common.loading": "Loading...",
    "common.urgent": "URGENT",

    // Home Tab
    "home.welcome": "Welcome back",
    "home.journey": "Your Pregnancy Journey",
    "home.week": "Week",
    "home.baby_size": "Your baby is the size of a sweet melon 🍈",
    "home.daily_tip": "Daily Tip: Stay hydrated, consume protein-rich meals, and take short 15-minute walks to improve circulation.",
    "home.quick_actions": "Quick Actions",
    "home.action_diet": "Nutrition Guide",
    "home.action_diet_desc": "Gestational diet plans",
    "home.action_exercise": "Baby Yoga",
    "home.action_exercise_desc": "Safe prenatal routines",
    "home.action_milestones": "Milestones",
    "home.action_milestones_desc": "Baby growth milestones",
    "home.action_music": "Lullaby & Music",
    "home.action_music_desc": "Soothe baby's brain",
    "home.action_games": "Brain Games",
    "home.action_games_desc": "Fun cognitive boosts",
    "home.community_title": "Join the Community",
    "home.community_desc": "Share experiences and support each other on your journey.",
    "home.join_now": "Join Now",

    // Health Tab
    "health.title": "Clinical Health Tools",
    "health.subtitle": "Monitor your vitals and find nearby medical care",
    "health.hospitals": "Find Hospitals",
    "health.hospitals_desc": "Locate nearest emergency care",
    "health.doctors": "Contact Doctors",
    "health.doctors_desc": "Get in touch with clinical experts",
    "health.kick": "Kick Counter",
    "health.kick_desc": "Monitor active baby movements",
    "health.calendar": "Health Calendar",
    "health.calendar_desc": "Appointments and vaccine dates",
    "health.symptom": "Symptom Checker",
    "health.symptom_desc": "Check pregnancy complications safely",
    "health.medication": "Medication Tracker",
    "health.medication_desc": "Never miss vital doses",
    "health.vitals": "Vitals Monitor",
    "health.vitals_desc": "Track blood pressure and pulse",

    // Ecosystem Tab
    "eco.title": "Maternal Ecosystem",
    "eco.subtitle": "Holistic health tracker, co-parenting sync, and smart insights",
    "eco.vitals_form": "Log Today's Vitals",
    "eco.bp": "Blood Pressure (mmHg)",
    "eco.sugar": "Blood Sugar (mg/dL)",
    "eco.pulse": "Pulse (bpm)",
    "eco.log_btn": "Record Vitals in DB",
    "eco.insights_title": "Sona AI Daily Insights",
    "eco.insight_1": "Your blood pressure is in the normal range. Great job maintaining a balanced diet!",
    "eco.insight_2": "Walking 10 mins today is recommended to ease light ankle swelling reported yesterday.",
    "eco.coparent_title": "Co-Parent Sync Active",
    "eco.coparent_desc": "Dr. Chen is currently linked and receiving vitals summaries.",

    // Sona Chat / AI Tab
    "chat.title": "Sona Maternal Companion",
    "chat.subtitle": "AI clinical care, RAG knowledge retriever, & emotional coaching",
    "chat.welcome": "Hi Mama, I'm Sona. How are you feeling today? You can ask me about nutrition, safety guidelines, exercises, or translate your diaper-changing multitasking skills for your resume!",
    "chat.preset_meds": "Is paracetamol safe now?",
    "chat.preset_diet": "Diet for gestational diabetes?",
    "chat.preset_resume": "Translate mommy skills to resume",
    "chat.placeholder": "Ask Sona AI anything...",
    "chat.breathing_title": "Calming Breathing Exercise",
    "chat.breathing_desc": "Take a deep breath with Sona to reduce stress.",

    // Profile Tab
    "profile.title": "Profile & Settings",
    "profile.age": "Age",
    "profile.pregnant": "Pregnant",
    "profile.gender": "Gender",
    "profile.coparent_btn": "Co-Parent Sync",
    "profile.coparent_desc": "Share the mental load",
    "profile.change_lang": "Change Language",
    "profile.single_dads": "Support for Single Dads",
    "profile.help": "Help and Support",
    "profile.privacy": "Privacy Policy",
    "profile.rate": "Rate Us",
    "profile.share": "Share Sona AI",
    "profile.logout": "Log Out"
  },
  Hindi: {
    // Nav & Common
    "nav.home": "होम",
    "nav.health": "स्वास्थ्य",
    "nav.ecosystem": "पारिस्थितिकी",
    "nav.activities": "गतिविधियां",
    "nav.sona_ai": "सोना AI",
    "nav.profile": "प्रोफ़ाइल",
    "common.back": "पीछे",
    "common.save": "सुरक्षित करें",
    "common.loading": "लोड हो रहा है...",
    "common.urgent": "अति आवश्यक",

    // Home Tab
    "home.welcome": "स्वागत है",
    "home.journey": "आपकी गर्भावस्था यात्रा",
    "home.week": "सप्ताह",
    "home.baby_size": "आपका बच्चा एक मीठे तरबूज के आकार का है 🍈",
    "home.daily_tip": "दैनिक सलाह: हाइड्रेटेड रहें, प्रोटीन युक्त भोजन करें और रक्त परिसंचरण में सुधार के लिए 15 मिनट की छोटी सैर करें।",
    "home.quick_actions": "त्वरित क्रियाएं",
    "home.action_diet": "पोषण गाइड",
    "home.action_diet_desc": "गर्भावस्था के आहार चार्ट",
    "home.action_exercise": "शिशु योग",
    "home.action_exercise_desc": "सुरक्षित प्रसवपूर्व व्यायाम",
    "home.action_milestones": "मील के पत्थर",
    "home.action_milestones_desc": "बच्चे के विकास के चरण",
    "home.action_music": "लोरी और संगीत",
    "home.action_music_desc": "बच्चे के मस्तिष्क को शांत करें",
    "home.action_games": "दिमागी खेल",
    "home.action_games_desc": "मजेदार दिमागी कसरत",
    "home.community_title": "समुदाय से जुड़ें",
    "home.community_desc": "अपनी यात्रा में एक-दूसरे के साथ अनुभव साझा करें और सहायता करें।",
    "home.join_now": "अभी शामिल हों",

    // Health Tab
    "health.title": "चिकित्सीय स्वास्थ्य उपकरण",
    "health.subtitle": "अपने महत्वपूर्ण स्वास्थ्य संकेतों की निगरानी करें और नजदीकी चिकित्सा सहायता पाएं",
    "health.hospitals": "अस्पताल खोजें",
    "health.hospitals_desc": "निकटतम आपातकालीन चिकित्सा खोजें",
    "health.doctors": "डॉक्टरों से संपर्क करें",
    "health.doctors_desc": "चिकित्सीय विशेषज्ञों से बात करें",
    "health.kick": "किक काउंटर",
    "health.kick_desc": "बच्चे की सक्रिय गतिविधियों को ट्रैक करें",
    "health.calendar": "स्वास्थ्य कैलेंडर",
    "health.calendar_desc": "अपॉइंटमेंट और टीकाकरण की तारीखें",
    "health.symptom": "लक्षण जांचकर्ता",
    "health.symptom_desc": "गर्भावस्था की जटिलताओं की सुरक्षित जांच करें",
    "health.medication": "दवा ट्रैकर",
    "health.medication_desc": "महत्वपूर्ण खुराक कभी न भूलें",
    "health.vitals": "स्वास्थ्य संकेतक",
    "health.vitals_desc": "रक्तचाप और नाड़ी को ट्रैक करें",

    // Ecosystem Tab
    "eco.title": "मातृ पारिस्थितिकी तंत्र",
    "eco.subtitle": "समग्र स्वास्थ्य ट्रैकर, सह-अभिभावक समन्वय, और स्मार्ट विश्लेषण",
    "eco.vitals_form": "आज के स्वास्थ्य संकेतक दर्ज करें",
    "eco.bp": "रक्तचाप (mmHg)",
    "eco.sugar": "रक्त शर्करा (mg/dL)",
    "eco.pulse": "नाड़ी की दर (bpm)",
    "eco.log_btn": "डेटाबेस में दर्ज करें",
    "eco.insights_title": "सोना AI दैनिक सलाह",
    "eco.insight_1": "आपका रक्तचाप सामान्य सीमा में है। संतुलित आहार बनाए रखने के लिए बहुत बढ़िया काम!",
    "eco.insight_2": "कल रिपोर्ट किए गए टखनों की हल्की सूजन को कम करने के लिए आज 10 मिनट टहलने की सलाह दी जाती है।",
    "eco.coparent_title": "सह-अभिभावक सिंक सक्रिय है",
    "eco.coparent_desc": "डॉ. चेन वर्तमान में जुड़े हुए हैं और स्वास्थ्य सारांश प्राप्त कर रहे हैं।",

    // Sona Chat / AI Tab
    "chat.title": "सोना मातृ साथी",
    "chat.subtitle": "AI नैदानिक सहायता, RAG ज्ञान खोजक, और भावनात्मक कोचिंग",
    "chat.welcome": "नमस्ते माँ, मैं सोना हूँ। आज आप कैसा महसूस कर रही हैं? आप मुझसे पोषण, सुरक्षा दिशानिर्देशों, व्यायाम के बारे में पूछ सकती हैं, या अपने बायोडाटा के लिए अपने डायपर बदलने के मल्टीटास्किंग कौशल का अनुवाद कर सकती हैं!",
    "chat.preset_meds": "क्या पैरासिटामोल अभी सुरक्षित है?",
    "chat.preset_diet": "गर्भावधि मधुमेह के लिए आहार?",
    "chat.preset_resume": "माँ के कौशलों का रिज्यूमे में अनुवाद करें",
    "chat.placeholder": "सोना AI से कुछ भी पूछें...",
    "chat.breathing_title": "शांत करने वाला साँस लेने का व्यायाम",
    "chat.breathing_desc": "तनाव कम करने के लिए सोना के साथ गहरी साँस लें।",

    // Profile Tab
    "profile.title": "प्रोफ़ाइल और सेटिंग्स",
    "profile.age": "आयु",
    "profile.pregnant": "गर्भवती सप्ताह",
    "profile.gender": "लिंग",
    "profile.coparent_btn": "सह-अभिभावक सिंक",
    "profile.coparent_desc": "मानसिक बोझ साझा करें",
    "profile.change_lang": "भाषा बदलें",
    "profile.single_dads": "एकल पिताओं के लिए सहायता",
    "profile.help": "सहायता और संपर्क",
    "profile.privacy": "गोपनीयता नीति",
    "profile.rate": "हमें रेट करें",
    "profile.share": "सोना AI साझा करें",
    "profile.logout": "लॉग आउट"
  },
  Kannada: {
    // Nav & Common
    "nav.home": "ಮುಖಪುಟ",
    "nav.health": "ಆರೋಗ್ಯ",
    "nav.ecosystem": "ಪರಿಸರ ವ್ಯವಸ್ಥೆ",
    "nav.activities": "ಚಟುವಟಿಕೆಗಳು",
    "nav.sona_ai": "ಸೋನಾ AI",
    "nav.profile": "ಪ್ರೊಫೈಲ್",
    "common.back": "ಹಿಂದಕ್ಕೆ",
    "common.save": "ಉಳಿಸು",
    "common.loading": "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    "common.urgent": "ತುರ್ತು",

    // Home Tab
    "home.welcome": "ಸ್ವಾಗತ",
    "home.journey": "ನಿಮ್ಮ ಗರ್ಭಾವಸ್ಥೆಯ ಪ್ರಯಾಣ",
    "home.week": "ವಾರ",
    "home.baby_size": "ನಿಮ್ಮ ಮಗು ಸಿಹಿ ಕರಬೂಜದ ಗಾತ್ರದಲ್ಲಿದೆ 🍈",
    "home.daily_tip": "ದೈನಂದಿನ ಸಲಹೆ: ಹೈಡ್ರೇಟೆಡ್ ಆಗಿರಿ, ಪ್ರೋಟೀನ್ ಭರಿತ ಆಹಾರ ಸೇವಿಸಿ ಮತ್ತು ರಕ್ತ ಪರಿಚಲನೆ ಸುಧಾರಿಸಲು 15 ನಿಮಿಷಗಳ ಸಣ್ಣ ನಡಿಗೆಯನ್ನು ಮಾಡಿ.",
    "home.quick_actions": "ತ್ವರಿತ ಕ್ರಿಯೆಗಳು",
    "home.action_diet": "ಪೌಷ್ಟಿಕಾಂಶ ಮಾರ್ಗದರ್ಶಿ",
    "home.action_diet_desc": "ಗರ್ಭಾವಸ್ಥೆಯ ಆಹಾರ ಯೋಜನೆಗಳು",
    "home.action_exercise": "ಶಿಶು ಯೋಗ",
    "home.action_exercise_desc": "ಸುರಕ್ಷಿತ ಪ್ರಸವಪೂರ್ವ ವ್ಯಾಯಾಮಗಳು",
    "home.action_milestones": "ಮೈಲಿಗಲ್ಲುಗಳು",
    "home.action_milestones_desc": "ಮಗುವಿನ ಬೆಳವಣಿಗೆಯ ಹಂತಗಳು",
    "home.action_music": "ಜೋಗುಳ ಮತ್ತು ಸಂಗೀತ",
    "home.action_music_desc": "ಮಗುವಿನ ಮಿದುಳನ್ನು ಶಾಂತಗೊಳಿಸಿ",
    "home.action_games": "ಮೆದುಳಿನ ಆಟಗಳು",
    "home.action_games_desc": "ಮನರಂಜನೆಯ ಅರಿವಿನ ಆಟಗಳು",
    "home.community_title": "ಸಮುದಾಯಕ್ಕೆ ಸೇರಿ",
    "home.community_desc": "ನಿಮ್ಮ ಪ್ರಯಾಣದಲ್ಲಿ ಪರಸ್ಪರ ಅನುಭವಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ ಮತ್ತು ಬೆಂಬಲಿಸಿ.",
    "home.join_now": "ಈಗಲೇ ಸೇರಿಕೊಳ್ಳಿ",

    // Health Tab
    "health.title": "ವೈದ್ಯಕೀಯ ಆರೋಗ್ಯ ಉಪಕರಣಗಳು",
    "health.subtitle": "ನಿಮ್ಮ ಪ್ರಮುಖ ಆರೋಗ್ಯ ಸೂಚಕಗಳನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ ಮತ್ತು ಹತ್ತಿರದ ವೈದ್ಯಕೀಯ ಚಿಕಿತ್ಸೆ ಕಂಡುಕೊಳ್ಳಿ",
    "health.hospitals": "ಆಸ್ಪತ್ರೆಗಳನ್ನು ಹುಡುಕಿ",
    "health.hospitals_desc": "ಹತ್ತಿರದ ತುರ್ತು ಚಿಕಿತ್ಸಾ ಕೇಂದ್ರ ಪತ್ತೆಹಚ್ಚಿ",
    "health.doctors": "ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ",
    "health.doctors_desc": "ವೈದ್ಯಕೀಯ ತಜ್ಞರೊಂದಿಗೆ ಸಂಪರ್ಕ ಸಾಧಿಸಿ",
    "health.kick": "ಕಿಕ್ ಕೌಂಟರ್",
    "health.kick_desc": "ಮಗುವಿನ ಸಕ್ರಿಯ ಚಲನವಲನಗಳನ್ನು ಗಮನಿಸಿ",
    "health.calendar": "ಆರೋಗ್ಯ ಕ್ಯಾಲೆಂಡರ್",
    "health.calendar_desc": "ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಮತ್ತು ಲಸಿಕೆ ದಿನಾಂಕಗಳು",
    "health.symptom": "ರೋಗಲಕ್ಷಣ ತಪಾಸಕ",
    "health.symptom_desc": "ಗರ್ಭಾವಸ್ಥೆಯ ತೊಂದರೆಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ತಪಾಸಿಸಿ",
    "health.medication": "ಔಷಧಿ ಟ್ರ್ಯಾಕರ್",
    "health.medication_desc": "ಪ್ರಮುಖ ಡೋಸ್‌ಗಳನ್ನು ಎಂದಿಗೂ ಮರೆಯಬೇಡಿ",
    "health.vitals": "ಆರೋಗ್ಯ ಸೂಚಕಗಳು",
    "health.vitals_desc": "ರಕ್ತದೊತ್ತಡ ಮತ್ತು ನಾಡಿಮಿಡಿತ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",

    // Ecosystem Tab
    "eco.title": "ಮಾತೃ ಪರಿಸರ ವ್ಯವಸ್ಥೆ",
    "eco.subtitle": "ಸಮಗ್ರ ಆರೋಗ್ಯ ಟ್ರ್ಯಾಕರ್, ಸಹ-ಪೋಷಕರ ಸಮನ್ವಯ ಮತ್ತು ಸ್ಮಾರ್ಟ್ ಒಳನೋಟಗಳು",
    "eco.vitals_form": "ಇಂದಿನ ಆರೋಗ್ಯ ಸೂಚಕಗಳನ್ನು ದಾಖಲಿಸಿ",
    "eco.bp": "ರಕ್ತದೊತ್ತಡ (mmHg)",
    "eco.sugar": "ರಕ್ತದ ಸಕ್ಕರೆ (mg/dL)",
    "eco.pulse": "ನಾಡಿಮಿಡಿತ (bpm)",
    "eco.log_btn": "ಡೇಟಾಬೇಸ್‌ನಲ್ಲಿ ಉಳಿಸಿ",
    "eco.insights_title": "ಸೋನಾ AI ದೈನಂದಿನ ಒಳನೋಟಗಳು",
    "eco.insight_1": "ನಿಮ್ಮ ರಕ್ತದೊತ್ತಡವು ಸಾಮಾನ್ಯ ಮಿತಿಯಲ್ಲಿದೆ. ಸಮತೋಲಿತ ಆಹಾರವನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳಲು ಉತ್ತಮ ಕೆಲಸ!",
    "eco.insight_2": "ನಿನ್ನೆ ವರದಿಯಾದ ಪಾದಗಳ ಲಘು ಊತವನ್ನು ಕಡಿಮೆ ಮಾಡಲು ಇಂದು 10 ನಿಮಿಷಗಳ ಕಾಲ ನಡೆಯಲು ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ.",
    "eco.coparent_title": "ಸಹ-ಪೋಷಕರ ಸಿಂಕ್ ಸಕ್ರಿಯವಾಗಿದೆ",
    "eco.coparent_desc": "ಡಾ. ಚೆನ್ ಪ್ರಸ್ತುತ ಸಂಪರ್ಕ ಹೊಂದಿದ್ದಾರೆ ಮತ್ತು ಆರೋಗ್ಯದ ಸಾರಾಂಶವನ್ನು ಪಡೆಯುತ್ತಿದ್ದಾರೆ.",

    // Sona Chat / AI Tab
    "chat.title": "ಸೋನಾ ಮಾತೃ ಸಂಗಾತಿ",
    "chat.subtitle": "AI ವೈದ್ಯಕೀಯ ನೆರವು, RAG ಜ್ಞಾನ ಶೋಧಕ ಮತ್ತು ಭಾವನಾತ್ಮಕ ತರಬೇತಿ",
    "chat.welcome": "ನಮಸ್ತೆ ಅಮ್ಮ, ನಾನು ಸೋನಾ. ಇಂದು ನೀವು ಹೇಗಿದ್ದೀರಿ? ನೀವು ನನ್ನನ್ನು ಪೌಷ್ಟಿಕಾಂಶ, ಸುರಕ್ಷತಾ ಮಾರ್ಗಸೂಚಿಗಳು, ವ್ಯಾಯಾಮಗಳ ಬಗ್ಗೆ ಕೇಳಬಹುದು ಅಥವಾ ನಿಮ್ಮ ರೆಸ್ಯೂಮೆಗಾಗಿ ನಿಮ್ಮ ಮಗುವಿನ ಆರೈಕೆಯ ಕೌಶಲ್ಯಗಳನ್ನು ಭಾಷಾಂತರಿಸಬಹುದು!",
    "chat.preset_meds": "ಪ್ಯಾರಸಿಟಮಾಲ್ ಈಗ ಸುರಕ್ಷಿತವೇ?",
    "chat.preset_diet": "ಗರ್ಭಾವಸ್ಥೆಯ ಮಧುಮೇಹಕ್ಕೆ ಆಹಾರ ಕ್ರಮ?",
    "chat.preset_resume": "ತಾಯ್ತನದ ಕೌಶಲ್ಯಗಳನ್ನು ರೆಸ್ಯೂಮೆಗೆ ಭಾಷಾಂತರಿಸಿ",
    "chat.placeholder": "ಸೋನಾ AI ಅನ್ನು ಏನಾದರೂ ಕೇಳಿ...",
    "chat.breathing_title": "ಶಾಂತಗೊಳಿಸುವ ಉಸಿರಾಟದ ವ್ಯಾಯಾಮ",
    "chat.breathing_desc": "ಒತ್ತಡವನ್ನು ಕಡಿಮೆ ಮಾಡಲು ಸೋನಾ ಜೊತೆಗೆ ದೀರ್ಘವಾಗಿ ಉಸಿರಾಡಿ.",

    // Profile Tab
    "profile.title": "ಪ್ರೊಫೈಲ್ ಮತ್ತು ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    "profile.age": "ವಯಸ್ಸು",
    "profile.pregnant": "ಗರ್ಭಾವಸ್ಥೆಯ ವಾರ",
    "profile.gender": "ಲಿಂಗ",
    "profile.coparent_btn": "ಸಹ-ಪೋಷಕರ ಸಿಂಕ್",
    "profile.coparent_desc": "ಮಾನಸಿಕ ಹೊರೆಯನ್ನು ಹಂಚಿಕೊಳ್ಳಿ",
    "profile.change_lang": "ಭಾಷೆಯನ್ನು ಬದಲಾಯಿಸಿ",
    "profile.single_dads": "ಒಂಟಿ ತಂದೆಯರಿಗೆ ಬೆಂಬಲ",
    "profile.help": "ಸಹಾಯ ಮತ್ತು ಸಂಪರ್ಕ",
    "profile.privacy": "ಗೌಪ್ಯತಾ ನೀತಿ",
    "profile.rate": "ನಮ್ಮನ್ನು ರೇಟ್ ಮಾಡಿ",
    "profile.share": "ಸೋನಾ AI ಹಂಚಿಕೊಳ್ಳಿ",
    "profile.logout": "ಲಾಗ್ ಔಟ್"
  },
  Tamil: {},
  Telugu: {}
};

// Copy fallback English keys to empty languages so it won't crash
const getLanguageDict = (lang: Language) => {
  const dict = translations[lang] || {};
  const enDict = translations['English'];
  
  // Merge empty keys from English
  const finalDict: Record<string, string> = { ...enDict };
  Object.keys(dict).forEach(key => {
    if (dict[key]) {
      finalDict[key] = dict[key];
    }
  });
  return finalDict;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('English');

  useEffect(() => {
    const storedLang = localStorage.getItem('sona_language') as Language;
    if (storedLang && ['English', 'Hindi', 'Kannada', 'Tamil', 'Telugu'].includes(storedLang)) {
      setLanguageState(storedLang);
    }

    // Set up storage listener so switching in one sub-page instantly updates everything
    const handleStorageChange = () => {
      const current = localStorage.getItem('sona_language') as Language;
      if (current && current !== language) {
        setLanguageState(current);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Also dispatch a custom event inside Sona app when language changes locally
    const handleCustomChange = (e: CustomEvent) => {
      if (e.detail && e.detail.language) {
        setLanguageState(e.detail.language);
      }
    };
    window.addEventListener('sonaLanguageChange', handleCustomChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sonaLanguageChange', handleCustomChange as EventListener);
    };
  }, [language]);

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    localStorage.setItem('sona_language', newLang);
    
    // Dispatch custom event to notify all listeners inside the current frame
    const event = new CustomEvent('sonaLanguageChange', { detail: { language: newLang } });
    window.dispatchEvent(event);
  };

  const t = (key: string, fallback?: string): string => {
    const dict = getLanguageDict(language);
    return dict[key] || fallback || translations['English'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
