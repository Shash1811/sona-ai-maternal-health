import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Save, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

const defaultProfile = {
  name: "Mama Sona",
  age: "28",
  pregnancyWeek: "24",
  gender: "Female",
};

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(defaultProfile);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("sona_profile_details");
    if (stored) setProfile({ ...defaultProfile, ...JSON.parse(stored) });
  }, []);

  const saveProfile = () => {
    localStorage.setItem("sona_profile_details", JSON.stringify(profile));
    setSaved(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="mx-auto max-w-2xl px-6 py-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 font-medium text-purple-700 hover:text-purple-900"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Profile
        </button>

        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <div className="mb-6 flex items-center gap-4">
            <div className="relative h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="h-10 w-10 text-primary" />
              <div className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white">
                <Camera className="h-3.5 w-3.5" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
              <p className="text-gray-600">{user?.email || "Update your Sona profile"}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Display name</label>
              <Input value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Age</label>
              <Input value={profile.age} onChange={(event) => setProfile({ ...profile, age: event.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Pregnancy week</label>
              <Input value={profile.pregnancyWeek} onChange={(event) => setProfile({ ...profile, pregnancyWeek: event.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Gender</label>
              <Input value={profile.gender} onChange={(event) => setProfile({ ...profile, gender: event.target.value })} />
            </div>
          </div>

          <Button onClick={saveProfile} className="mt-6 w-full rounded-xl">
            <Save className="mr-2 h-4 w-4" />
            {saved ? "Saved" : "Save Profile"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditPage;
