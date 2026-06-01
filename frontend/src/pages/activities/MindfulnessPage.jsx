import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Calendar, Trash2 } from 'lucide-react';

const MindfulnessPage = () => {
  const navigate = useNavigate();
  const [currentEntry, setCurrentEntry] = useState('');
  const [entries, setEntries] = useState([]);

  // Load entries from localStorage on component mount
  useEffect(() => {
    const storedEntries = localStorage.getItem('gratitudeJournal');
    if (storedEntries) {
      try {
        const parsedEntries = JSON.parse(storedEntries);
        setEntries(parsedEntries);
      } catch (error) {
        console.error('Error loading journal entries:', error);
      }
    }
  }, []);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('gratitudeJournal', JSON.stringify(entries));
    }
  }, [entries]);

  const handleSaveEntry = () => {
    if (currentEntry.trim() === '') return;

    const newEntry = {
      id: Date.now().toString(),
      text: currentEntry.trim(),
      date: new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      timestamp: Date.now()
    };

    setEntries([newEntry, ...entries]);
    setCurrentEntry('');
  };

  const handleDeleteEntry = (id) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 flex flex-col">
      {/* Back Button */}
      <div className="p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Activities
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pb-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Gratitude Journal</h1>
            <p className="text-lg text-gray-600">Take a moment to reflect on what you're grateful for today</p>
          </div>

          {/* Input Section */}
          <div className="mb-12">
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-orange-500" fill="currentColor" />
                <h2 className="text-xl font-semibold text-gray-900">What are you grateful for today?</h2>
              </div>
              
              <textarea
                value={currentEntry}
                onChange={(e) => setCurrentEntry(e.target.value)}
                placeholder="I'm grateful for..."
                className="w-full h-32 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-gray-900 placeholder-gray-400"
              />

              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500">
                  {currentEntry.length} characters
                </span>
                <button
                  onClick={handleSaveEntry}
                  disabled={currentEntry.trim() === ''}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    currentEntry.trim() === ''
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-lg hover:shadow-xl'
                  }`}
                >
                  Save Entry
                </button>
              </div>
            </div>
          </div>

          {/* Entries History */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Gratitude Journey</h2>
              <span className="text-sm text-gray-500">
                {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
              </span>
            </div>

            {entries.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-orange-400" />
                </div>
                <p className="text-gray-500 mb-2">No gratitude entries yet</p>
                <p className="text-sm text-gray-400">Start your journey by writing your first entry above</p>
              </div>
            ) : (
              <div className="space-y-4">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-medium text-gray-600">{entry.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{formatTime(entry.timestamp)}</span>
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {entry.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stats Section */}
          {entries.length > 0 && (
            <div className="mt-12 p-6 bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl">
              <h3 className="text-lg font-semibold text-orange-800 mb-4">Your Gratitude Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{entries.length}</div>
                  <div className="text-sm text-orange-700">Total Entries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {entries.reduce((total, entry) => total + entry.text.split(' ').length, 0)}
                  </div>
                  <div className="text-sm text-orange-700">Words Written</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MindfulnessPage;
