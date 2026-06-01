import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Pill, Plus, Clock, Check, X, Bell, Calendar, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  time: string[];
  startDate: string;
  endDate?: string;
  taken: Record<string, boolean>;
  notes?: string;
  color: string;
}

const medicationColors = [
  'bg-blue-100 border-blue-300',
  'bg-purple-100 border-purple-300',
  'bg-pink-100 border-pink-300',
  'bg-green-100 border-green-300',
  'bg-yellow-100 border-yellow-300',
  'bg-orange-100 border-orange-300',
];

export const MedicationTrackerPage: React.FC = () => {
  const navigate = useNavigate();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    time: ['08:00'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    notes: ''
  });

  // Load medications from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('medications');
    if (saved) {
      setMedications(JSON.parse(saved));
    }
  }, []);

  // Save medications to localStorage
  useEffect(() => {
    localStorage.setItem('medications', JSON.stringify(medications));
  }, [medications]);

  const addMedication = () => {
    if (!newMed.name || !newMed.dosage) return;

    const med: Medication = {
      id: Date.now(),
      name: newMed.name,
      dosage: newMed.dosage,
      frequency: newMed.frequency,
      time: newMed.time,
      startDate: newMed.startDate,
      endDate: newMed.endDate || undefined,
      taken: {},
      notes: newMed.notes,
      color: medicationColors[medications.length % medicationColors.length]
    };

    setMedications([...medications, med]);
    setShowAddModal(false);
    setNewMed({
      name: '',
      dosage: '',
      frequency: 'daily',
      time: ['08:00'],
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      notes: ''
    });
  };

  const toggleTaken = (medId: number, time: string) => {
    const key = `${selectedDate}-${time}`;
    setMedications(medications.map(med => {
      if (med.id === medId) {
        return {
          ...med,
          taken: { ...med.taken, [key]: !med.taken[key] }
        };
      }
      return med;
    }));
  };

  const deleteMedication = (id: number) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  const addTime = () => {
    setNewMed({ ...newMed, time: [...newMed.time, '12:00'] });
  };

  const removeTime = (index: number) => {
    setNewMed({ ...newMed, time: newMed.time.filter((_, i) => i !== index) });
  };

  const updateTime = (index: number, value: string) => {
    const newTimes = [...newMed.time];
    newTimes[index] = value;
    setNewMed({ ...newMed, time: newTimes });
  };

  // Calculate stats
  const today = new Date().toISOString().split('T')[0];
  const todaysMeds = medications.filter(med => {
    if (med.startDate > today) return false;
    if (med.endDate && med.endDate < today) return false;
    return true;
  });

  const takenCount = todaysMeds.reduce((acc, med) => {
    return acc + med.time.filter(time => med.taken[`${today}-${time}`]).length;
  }, 0);

  const totalCount = todaysMeds.reduce((acc, med) => acc + med.time.length, 0);
  const progress = totalCount > 0 ? (takenCount / totalCount) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-purple-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full hover:bg-purple-100 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-6 h-6 text-purple-700" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Medication Tracker</h1>
                <p className="text-sm text-gray-500">Never miss a dose</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white shadow-lg"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Progress Card */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Today's Progress</h2>
              <p className="text-sm text-gray-500">{takenCount} of {totalCount} doses taken</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
              {Math.round(progress)}%
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
            />
          </div>
        </motion.div>
      </div>

      {/* Date Selector */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="flex-1 p-2 border border-gray-200 rounded-xl"
            />
            <button
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl font-medium"
            >
              Today
            </button>
          </div>
        </div>
      </div>

      {/* Medications List */}
      <div className="max-w-4xl mx-auto px-4 mt-6 pb-20 space-y-4">
        {medications.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <Pill className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No medications added yet</p>
            <Button 
              onClick={() => setShowAddModal(true)}
              className="mt-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Medication
            </Button>
          </div>
        ) : (
          medications.map((med) => (
            <motion.div
              key={med.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl p-5 border-2 ${med.color}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Pill className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{med.name}</h3>
                    <p className="text-sm text-gray-600">{med.dosage}</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteMedication(med.id)}
                  className="p-2 rounded-full hover:bg-white/50 text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {med.time.map((time) => {
                  const takenKey = `${selectedDate}-${time}`;
                  const isTaken = med.taken[takenKey];
                  const isPast = selectedDate < today || (selectedDate === today && time < new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }));
                  const isMissed = isPast && !isTaken && selectedDate === today;

                  return (
                    <motion.button
                      key={time}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => selectedDate <= today && toggleTaken(med.id, time)}
                      disabled={selectedDate > today}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                        isTaken 
                          ? 'bg-green-100 border-2 border-green-300' 
                          : isMissed
                            ? 'bg-red-50 border-2 border-red-200'
                            : 'bg-white/50 border-2 border-transparent hover:bg-white'
                      } ${selectedDate > today ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isTaken ? 'bg-green-500' : isMissed ? 'bg-red-400' : 'bg-gray-200'
                        }`}>
                          {isTaken ? (
                            <Check className="w-5 h-5 text-white" />
                          ) : isMissed ? (
                            <AlertCircle className="w-5 h-5 text-white" />
                          ) : (
                            <Clock className="w-4 h-4 text-gray-500" />
                          )}
                        </div>
                        <span className={`font-medium ${isTaken ? 'text-green-800' : isMissed ? 'text-red-800' : 'text-gray-700'}`}>
                          {time}
                        </span>
                      </div>
                      <span className={`text-sm ${
                        isTaken ? 'text-green-600' : isMissed ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {isTaken ? 'Taken' : isMissed ? 'Missed' : 'Pending'}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {med.notes && (
                <p className="text-sm text-gray-500 mt-3 bg-white/50 p-2 rounded-lg">
                  {med.notes}
                </p>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Add Medication Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Add Medication</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Medication Name</label>
                  <Input 
                    value={newMed.name}
                    onChange={(e) => setNewMed({...newMed, name: e.target.value})}
                    placeholder="e.g., Prenatal Vitamins"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Dosage</label>
                  <Input 
                    value={newMed.dosage}
                    onChange={(e) => setNewMed({...newMed, dosage: e.target.value})}
                    placeholder="e.g., 1 tablet, 500mg"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Frequency</label>
                  <select
                    value={newMed.frequency}
                    onChange={(e) => setNewMed({...newMed, frequency: e.target.value})}
                    className="w-full mt-1 p-2 border rounded-xl"
                  >
                    <option value="daily">Daily</option>
                    <option value="twice_daily">Twice daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="as_needed">As needed</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Reminder Times</label>
                  <div className="space-y-2 mt-2">
                    {newMed.time.map((time, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="time"
                          value={time}
                          onChange={(e) => updateTime(index, e.target.value)}
                          className="flex-1 p-2 border rounded-xl"
                        />
                        {newMed.time.length > 1 && (
                          <button
                            onClick={() => removeTime(index)}
                            className="p-2 rounded-xl bg-red-100 text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={addTime}
                      className="w-full py-2 rounded-xl border-2 border-dashed border-purple-300 text-purple-600 hover:bg-purple-50"
                    >
                      <Plus className="w-4 h-4 inline mr-1" />
                      Add Time
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Start Date</label>
                    <input
                      type="date"
                      value={newMed.startDate}
                      onChange={(e) => setNewMed({...newMed, startDate: e.target.value})}
                      className="w-full mt-1 p-2 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">End Date (Optional)</label>
                    <input
                      type="date"
                      value={newMed.endDate}
                      onChange={(e) => setNewMed({...newMed, endDate: e.target.value})}
                      className="w-full mt-1 p-2 border rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Notes (Optional)</label>
                  <Input 
                    value={newMed.notes}
                    onChange={(e) => setNewMed({...newMed, notes: e.target.value})}
                    placeholder="Take with food, etc."
                    className="mt-1"
                  />
                </div>

                <Button
                  onClick={addMedication}
                  disabled={!newMed.name || !newMed.dosage}
                  className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-6 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Medication
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MedicationTrackerPage;
