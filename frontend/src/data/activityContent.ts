import { Brain, Dumbbell, Leaf, Music } from "lucide-react";

export type ActivitySession = {
  id: string;
  categoryId: string;
  categoryTitle: string;
  title: string;
  duration: string;
  minutes: number;
  description: string;
  guide: string[];
};

export const activityCategories = [
  {
    id: "meditation",
    title: "Meditation",
    icon: Leaf,
    color: "bg-pink-light",
    route: "/activities/meditation",
    items: [
      {
        id: "morning-calm",
        name: "Morning Calm",
        duration: "10 min",
        minutes: 10,
        desc: "Start your day peacefully",
        guide: [
          "Sit upright with one hand on your heart.",
          "Breathe naturally and notice the first quiet moment of the day.",
          "Set one gentle intention for yourself and your baby.",
        ],
      },
      {
        id: "baby-bond-meditation",
        name: "Baby Bond Meditation",
        duration: "8 min",
        minutes: 8,
        desc: "Connect with your baby",
        guide: [
          "Rest both hands on your belly or chest.",
          "Imagine sending warmth with every inhale.",
          "Close with one loving sentence you want your baby to hear.",
        ],
      },
      {
        id: "sleep-meditation",
        name: "Sleep Meditation",
        duration: "15 min",
        minutes: 15,
        desc: "Drift into restful sleep",
        guide: [
          "Dim the lights and let your jaw soften.",
          "Release your day one breath at a time.",
          "Let the timer guide you into a slower rhythm.",
        ],
      },
    ],
  },
  {
    id: "yoga",
    title: "Prenatal Yoga",
    icon: Dumbbell,
    color: "bg-rose-light",
    route: "/activities/yoga",
    items: [
      {
        id: "gentle-stretching",
        name: "Gentle Stretching",
        duration: "12 min",
        minutes: 12,
        desc: "Relieve tension safely",
        guide: [
          "Move slowly through neck, shoulders, and side-body stretches.",
          "Keep every stretch easy enough to breathe through.",
          "Stop immediately if anything feels sharp or uncomfortable.",
        ],
      },
      {
        id: "hip-openers",
        name: "Hip Openers",
        duration: "10 min",
        minutes: 10,
        desc: "Prepare for birth",
        guide: [
          "Use pillows or a chair for support.",
          "Keep knees and hips comfortable, never forced.",
          "Finish with a minute of steady breathing.",
        ],
      },
      {
        id: "breathing-flow",
        name: "Breathing Flow",
        duration: "8 min",
        minutes: 8,
        desc: "Pranayama practice",
        guide: [
          "Inhale through the nose for four counts.",
          "Exhale gently for six counts.",
          "Let movement follow breath, not the other way around.",
        ],
      },
    ],
  },
  {
    id: "mindfulness",
    title: "Mindfulness",
    icon: Brain,
    color: "bg-lavender",
    route: "/activities/mindfulness",
    items: [
      {
        id: "gratitude-journal",
        name: "Gratitude Journal",
        duration: "5 min",
        minutes: 5,
        desc: "Reflect on blessings",
        guide: [
          "Write three things that felt kind today.",
          "Name one thing your body helped you do.",
          "Save the thought you want to remember later.",
        ],
      },
      {
        id: "body-scan",
        name: "Body Scan",
        duration: "10 min",
        minutes: 10,
        desc: "Release physical tension",
        guide: [
          "Bring attention from your toes to the crown of your head.",
          "Pause anywhere that feels tight.",
          "Exhale as if giving that area permission to unclench.",
        ],
      },
      {
        id: "positive-affirmations",
        name: "Positive Affirmations",
        duration: "5 min",
        minutes: 5,
        desc: "Empower your mind",
        guide: [
          "Choose one affirmation and repeat it slowly.",
          "Let the words become softer, not louder.",
          "Notice one place in your body that accepts the phrase.",
        ],
      },
    ],
  },
  {
    id: "relaxation",
    title: "Relaxation",
    icon: Music,
    color: "bg-gold-light",
    route: "/activities/relaxation",
    items: [
      {
        id: "nature-sounds",
        name: "Nature Sounds",
        duration: "infinity",
        minutes: 10,
        desc: "Ambient forest and rain",
        guide: [
          "Choose a comfortable position.",
          "Let the ambient sound fill the background.",
          "Return to the sound whenever thoughts get busy.",
        ],
      },
      {
        id: "lullabies",
        name: "Lullabies",
        duration: "20 min",
        minutes: 20,
        desc: "For you and baby",
        guide: [
          "Lower the volume until it feels gentle.",
          "Hum along if that feels soothing.",
          "Let the rhythm slow your breathing.",
        ],
      },
      {
        id: "sound-bath",
        name: "Sound Bath",
        duration: "15 min",
        minutes: 15,
        desc: "Healing frequencies",
        guide: [
          "Use headphones only at a comfortable volume.",
          "Rest your shoulders and unclench your hands.",
          "Let each tone pass without trying to hold it.",
        ],
      },
    ],
  },
];

export const activitySessions: ActivitySession[] = activityCategories.flatMap((category) =>
  category.items.map((item) => ({
    id: item.id,
    categoryId: category.id,
    categoryTitle: category.title,
    title: item.name,
    duration: item.duration,
    minutes: item.minutes,
    description: item.desc,
    guide: item.guide,
  })),
);

export const microSelfCare = [
  { id: "breathing", label: "1-min Breathing", emoji: "Breathe", route: "/activities/breathing" },
  { id: "affirmation", label: "Quick Affirmation", emoji: "Strong", route: "/activities/self-care/affirmation" },
  { id: "calming-audio", label: "Calming Audio", emoji: "Audio", route: "/activities/self-care/calming-audio" },
  { id: "gratitude-pause", label: "Gratitude Pause", emoji: "Thanks", route: "/activities/self-care/gratitude-pause" },
];
