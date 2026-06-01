import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Copy,
  Globe,
  HelpCircle,
  Link2,
  QrCode,
  Send,
  Share2,
  Shield,
  Star,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";

const pageMeta: Record<string, { title: string; subtitle: string; icon: typeof Globe }> = {
  "co-parent": { title: "Co-Parent Sync", subtitle: "Share routines, reminders, and care notes", icon: Users },
  language: { title: "Change Language", subtitle: "Choose the language used across Sona", icon: Globe },
  "single-dads": { title: "Support for Single Dads", subtitle: "Community and practical resources", icon: Users },
  help: { title: "Help and Support", subtitle: "FAQ and contact", icon: HelpCircle },
  privacy: { title: "Privacy Policy", subtitle: "Your data safety", icon: Shield },
  rate: { title: "Rate Us", subtitle: "Share your feedback", icon: Star },
  share: { title: "Share with Friends", subtitle: "Invite someone to Sona", icon: Share2 },
};

const ProfileDetailPage = () => {
  const { section = "help" } = useParams();
  const navigate = useNavigate();
  const meta = pageMeta[section] || pageMeta.help;
  const Icon = meta.icon;
  const [language, setLanguage] = useState(localStorage.getItem("sona_language") || "English");
  const [inviteEmail, setInviteEmail] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [rating, setRating] = useState(Number(localStorage.getItem("sona_rating") || 0));
  const [feedback, setFeedback] = useState("");
  const [feedbackSaved, setFeedbackSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const inviteLink = "https://sona.app/invite/mama-sona";

  const { setLanguage: setGlobalLanguage } = useLanguage();

  const confirmation = useMemo(() => {
    if (section === "language") return `Language set to ${language}`;
    if (section === "rate" && rating) return `Thanks for rating Sona ${rating}/5`;
    return "";
  }, [language, rating, section]);

  const saveLanguage = () => {
    setGlobalLanguage(language as any);
  };

  const sendInvite = () => {
    if (!inviteEmail.trim()) return;
    const existing = JSON.parse(localStorage.getItem("sona_coparent_invites") || "[]");
    localStorage.setItem(
      "sona_coparent_invites",
      JSON.stringify([{ email: inviteEmail.trim(), sentAt: new Date().toISOString() }, ...existing]),
    );
    setInviteEmail("");
  };

  const copyInvite = async () => {
    await navigator.clipboard?.writeText(inviteLink);
    setCopied(true);
  };

  const saveRating = (value: number) => {
    setRating(value);
    localStorage.setItem("sona_rating", String(value));
  };

  const submitFeedback = () => {
    const existing = JSON.parse(localStorage.getItem("sona_feedback") || "[]");
    localStorage.setItem(
      "sona_feedback",
      JSON.stringify([{ rating, feedback: feedback.trim(), sentAt: new Date().toISOString() }, ...existing]),
    );
    setFeedback("");
    setFeedbackSaved(true);
  };

  const renderContent = () => {
    if (section === "co-parent") {
      return (
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <button className="rounded-2xl bg-purple-50 p-5 text-left">
              <QrCode className="mb-3 h-6 w-6 text-primary" />
              <p className="font-semibold text-gray-900">QR Invite</p>
              <p className="mt-1 text-sm text-gray-600">Use this when your partner is nearby.</p>
            </button>
            <button onClick={copyInvite} className="rounded-2xl bg-pink-50 p-5 text-left">
              <Link2 className="mb-3 h-6 w-6 text-primary" />
              <p className="font-semibold text-gray-900">{copied ? "Copied" : "Invite Link"}</p>
              <p className="mt-1 text-sm text-gray-600">Copy a link for chat or email.</p>
            </button>
          </div>
          <div className="rounded-2xl border border-gray-100 p-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">Partner or ally email</label>
            <div className="flex gap-2">
              <Input value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} placeholder="name@example.com" />
              <Button onClick={sendInvite} disabled={!inviteEmail.trim()} className="rounded-xl">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="rounded-2xl bg-purple-50 p-5">
            <p className="font-semibold text-gray-900">What syncs</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Appointments", "Reminders", "Care notes", "Feeding logs", "Mood check-ins"].map((item) => (
                <span key={item} className="rounded-full bg-white px-3 py-1 text-sm text-gray-700">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (section === "language") {
      return (
        <div className="space-y-4">
          {["English", "Hindi", "Kannada", "Tamil", "Telugu"].map((option) => (
            <button
              key={option}
              onClick={() => setLanguage(option)}
              className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left ${
                language === option ? "border-primary bg-primary/10" : "border-gray-100 bg-white"
              }`}
            >
              <span className="font-medium text-gray-900">{option}</span>
              {language === option && <Check className="h-5 w-5 text-primary" />}
            </button>
          ))}
          <Button onClick={saveLanguage} className="w-full rounded-xl">Save Language</Button>
        </div>
      );
    }

    if (section === "single-dads") {
      return (
        <div className="space-y-4">
          {[
            ["Newborn routines", "Simple care checklists for feeds, sleep, and appointments."],
            ["Building support", "Ideas for asking family, friends, and professionals for specific help."],
            ["Community prompts", "Conversation starters for finding nearby parent groups."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="font-semibold text-gray-900">{title}</p>
              <p className="mt-1 text-sm text-gray-600">{body}</p>
            </div>
          ))}
        </div>
      );
    }

    if (section === "privacy") {
      return (
        <div className="space-y-4 text-sm leading-6 text-gray-700">
          <p>Sona stores account details, questionnaire answers, and saved wellness entries only to support your app experience.</p>
          <p>You control optional local entries such as reflections, gratitude pauses, ratings, and language preferences on this device.</p>
          <p>Medical or urgent concerns should still be handled with a qualified clinician or emergency service.</p>
        </div>
      );
    }

    if (section === "rate") {
      return (
        <div className="space-y-5">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button key={value} onClick={() => saveRating(value)} className="rounded-full p-2 hover:bg-primary/10">
                <Star className={`h-9 w-9 ${value <= rating ? "fill-primary text-primary" : "text-gray-300"}`} />
              </button>
            ))}
          </div>
          <Textarea
            value={feedback}
            onChange={(event) => {
              setFeedback(event.target.value);
              setFeedbackSaved(false);
            }}
            placeholder="What should we improve next?"
            className="min-h-28 rounded-xl"
          />
          <Button disabled={!rating} onClick={submitFeedback} className="w-full rounded-xl">
            {feedbackSaved ? "Feedback Saved" : "Submit Feedback"}
          </Button>
        </div>
      );
    }

    if (section === "share") {
      return (
        <div className="space-y-4">
          <div className="rounded-2xl bg-primary/10 p-5 text-center">
            <p className="font-semibold text-gray-900">Invite link</p>
            <p className="mt-2 break-all text-sm text-gray-600">{inviteLink}</p>
          </div>
          <Button onClick={copyInvite} className="w-full rounded-xl">
            <Copy className="mr-2 h-4 w-4" />
            {copied ? "Copied" : "Copy Invite Link"}
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {[
          ["How do I complete onboarding?", "Sign up as a mom and finish the questionnaire that appears after account creation."],
          ["Why do I not see the questionnaire on sign in?", "It only appears for new mom signup, then stays complete after saving."],
          ["How do I contact support?", "Send a note below and it will be saved as a local support request."],
        ].map(([question, answer]) => (
          <div key={question} className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="font-semibold text-gray-900">{question}</p>
            <p className="mt-1 text-sm text-gray-600">{answer}</p>
          </div>
        ))}
        <Textarea
          value={supportMessage}
          onChange={(event) => setSupportMessage(event.target.value)}
          placeholder="Tell us what you need help with"
          className="min-h-28 rounded-xl"
        />
        <Button
          disabled={!supportMessage.trim()}
          onClick={() => {
            localStorage.setItem("sona_support_request", supportMessage.trim());
            setSupportMessage("");
          }}
          className="w-full rounded-xl"
        >
          Send Support Request
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="mx-auto max-w-3xl px-6 py-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 font-medium text-purple-700 hover:text-purple-900"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Profile
        </button>

        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Icon className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{meta.title}</h1>
              <p className="text-gray-600">{meta.subtitle}</p>
            </div>
          </div>
          {confirmation && <div className="mb-5 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{confirmation}</div>}
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ProfileDetailPage;
