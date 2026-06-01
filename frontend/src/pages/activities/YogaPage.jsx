import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Clock } from 'lucide-react';

const YogaPage = () => {
  const navigate = useNavigate();

  // Video data with YouTube video IDs
  const yogaVideos = [
    {
      id: 1,
      title: "10-Min Gentle Stretch",
      description: "Perfect for beginners and daily practice",
      duration: "10:00",
      videoId: "v7AYKMP6rOE", // Free yoga video
      thumbnail: "https://img.youtube.com/vi/v7AYKMP6rOE/maxresdefault.jpg"
    },
    {
      id: 2,
      title: "Hip Openers",
      description: "Deep stretches for hip flexibility and relief",
      duration: "15:30",
      videoId: "oBu-pQg6ATc", // Free hip opening yoga
      thumbnail: "https://img.youtube.com/vi/oBu-pQg6ATc/maxresdefault.jpg"
    },
    {
      id: 3,
      title: "Morning Flow",
      description: "Energizing sequence to start your day",
      duration: "20:00",
      videoId: "t5fS5U3_U_Q", // Free morning yoga flow
      thumbnail: "https://img.youtube.com/vi/t5fS5U3_U_Q/maxresdefault.jpg"
    },
    {
      id: 4,
      title: "Prenatal Gentle Yoga",
      description: "Safe and calming practice for expecting mothers",
      duration: "12:45",
      videoId: "RbsRn8Gn_3c", // Free prenatal yoga
      thumbnail: "https://img.youtube.com/vi/RbsRn8Gn_3c/maxresdefault.jpg"
    },
    {
      id: 5,
      title: "Breathing & Relaxation",
      description: "Focus on breath work and gentle movements",
      duration: "8:30",
      videoId: "inpT4Z5GKgQ", // Free breathing yoga
      thumbnail: "https://img.youtube.com/vi/inpT4Z5GKgQ/maxresdefault.jpg"
    },
    {
      id: 6,
      title: "Bedtime Stretch",
      description: "Calming stretches for better sleep",
      duration: "18:00",
      videoId: "g_tea8ZNk5s", // Free bedtime yoga
      thumbnail: "https://img.youtube.com/vi/g_tea8ZNk5s/maxresdefault.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50 flex flex-col">
      {/* Back Button */}
      <div className="p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Activities
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Prenatal Yoga Studio</h1>
            <p className="text-lg text-gray-600">Safe and gentle yoga practices for expecting mothers</p>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {yogaVideos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
              >
                {/* Video Container */}
                <div className="relative aspect-video bg-gray-100">
                  {/* YouTube Thumbnail */}
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300"
                  />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Play className="w-8 h-8 text-green-600 ml-1" />
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-sm">
                    {video.duration}
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{video.title}</h3>
                  <p className="text-gray-600 mb-4">{video.description}</p>
                  
                  {/* Video Details */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{video.duration}</span>
                    </div>
                    <button
                      onClick={() => {
                        // Open YouTube video in new tab
                        window.open(`https://www.youtube.com/watch?v=${video.videoId}`, '_blank');
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-teal-600 transition-all duration-300"
                    >
                      Watch Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="mt-16 p-8 bg-white/50 backdrop-blur-sm rounded-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">How to Use This Studio</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Before You Start</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Consult your healthcare provider before beginning</li>
                  <li>• Wear comfortable, non-restrictive clothing</li>
                  <li>• Use a yoga mat or soft surface</li>
                  <li>• Keep water nearby and stay hydrated</li>
                  <li>• Listen to your body and rest when needed</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Safety Guidelines</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Avoid deep twists and lying on your back after 20 weeks</li>
                  <li>• Modify poses as your body changes</li>
                  <li>• Focus on gentle stretching, not deep flexibility</li>
                  <li>• Breathe deeply and consistently</li>
                  <li>• Stop if you feel any pain or discomfort</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YogaPage;
