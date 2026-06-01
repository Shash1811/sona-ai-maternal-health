import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Volume2, Moon, Waves, TreePine, Music } from 'lucide-react';

const RelaxationPage = () => {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  
  // Audio tracks with public domain MP3 URLs
  const audioTracks = [
    {
      id: 1,
      title: "Forest Rain",
      description: "Gentle rain in a peaceful forest",
      duration: "10:00",
      icon: TreePine,
      src: "https://www.soundjay.com/misc/sounds/rain-03.mp3"
    },
    {
      id: 2,
      title: "Ocean Waves",
      description: "Calming ocean waves at sunset",
      duration: "8:30",
      icon: Waves,
      src: "https://www.soundjay.com/misc/sounds/ocean-wave-1.mp3"
    },
    {
      id: 3,
      title: "Deep Sleep Frequencies",
      description: "Low frequency tones for deep relaxation",
      duration: "15:00",
      icon: Moon,
      src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3"
    },
    {
      id: 4,
      title: "Gentle Lullaby",
      description: "Soft melodic tones for peaceful rest",
      duration: "12:00",
      icon: Music,
      src: "https://www.soundjay.com/misc/sounds/music-box-1.mp3"
    }
  ];

  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack]);

  const handleTrackSelect = (track) => {
    setCurrentTrack(track);
    setIsPlaying(false);
    setCurrentTime(0);
    
    if (audioRef.current) {
      audioRef.current.src = track.src;
      audioRef.current.load();
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Back Button */}
      <div className="p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Activities
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Relaxation Sounds
            </h1>
            <p className="text-gray-400">Immerse yourself in calming audio for deep relaxation</p>
          </div>

          {/* Main Player */}
          {currentTrack && (
            <div className="mb-12 p-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border border-slate-700 shadow-2xl">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                  <currentTrack.icon className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-1">{currentTrack.title}</h3>
                  <p className="text-gray-400">{currentTrack.description}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-sm text-gray-400">{formatTime(currentTime)}</span>
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(currentTime / duration) * 100}%, #475569 ${(currentTime / duration) * 100}%, #475569 100%)`
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-400">{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={handlePlayPause}
                  className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-white" />
                  ) : (
                    <Play className="w-8 h-8 text-white ml-1" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Track List */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Choose Your Soundscape</h2>
            <div className="grid gap-4">
              {audioTracks.map((track) => (
                <div
                  key={track.id}
                  onClick={() => handleTrackSelect(track)}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                    currentTrack?.id === track.id
                      ? 'bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500 shadow-lg shadow-purple-500/20'
                      : 'bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                      currentTrack?.id === track.id
                        ? 'bg-gradient-to-br from-purple-500 to-blue-500'
                        : 'bg-slate-700'
                    }`}>
                      <track.icon className={`w-8 h-8 ${currentTrack?.id === track.id ? 'text-white' : 'text-gray-400'}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{track.title}</h3>
                      <p className="text-gray-400 text-sm">{track.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400 mb-2">{track.duration}</div>
                      {currentTrack?.id === track.id && isPlaying && (
                        <div className="flex items-center gap-1 text-purple-400">
                          <Volume2 className="w-4 h-4" />
                          <span className="text-xs">Playing</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          {!currentTrack && (
            <div className="mt-12 p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">How to use:</h3>
              <div className="space-y-2 text-gray-400">
                <p>• Select a track from the list below to load it into the player</p>
                <p>• Use the play/pause button to control playback</p>
                <p>• Drag the progress bar to seek to any position</p>
                <p>• Find your perfect relaxation soundscape</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} />

      {/* Custom Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: #8b5cf6;
          border-radius: 50%;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #8b5cf6;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default RelaxationPage;
