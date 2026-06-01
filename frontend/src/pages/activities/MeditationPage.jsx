import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Play } from 'lucide-react';
import { activityCategories } from '@/data/activityContent';

const MeditationPage = () => {
  const navigate = useNavigate();
  const meditation = activityCategories.find((category) => category.id === 'meditation');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <div className="mx-auto max-w-5xl px-6 py-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 font-medium text-purple-700 hover:text-purple-900"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Activities
        </button>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Meditation Studio</h1>
          <p className="mt-2 text-gray-600">Guided moments for calm, sleep, and bonding</p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {meditation.items.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(`/activities/session/${item.id}`)}
              className="rounded-2xl bg-white p-6 text-left shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <Play className="h-5 w-5 text-purple-700" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{item.name}</h2>
              <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-sm text-purple-700">
                <Clock className="h-4 w-4" />
                {item.duration}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MeditationPage;
