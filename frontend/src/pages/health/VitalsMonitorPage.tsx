import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Activity, Plus, TrendingUp, TrendingDown, History, Heart, Droplets, X, Sparkles, Moon, Brain, ShieldAlert, Loader2, Thermometer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface VitalRecord {
  id: number;
  date: string;
  systolic?: number;
  diastolic?: number;
  glucose?: number;
  weight?: number;
  heartRate?: number;
  temperature?: number;
  sleepHours?: number;
  stressLevel?: number;
  notes?: string;
}

const normalRanges = {
  systolic: { min: 90, max: 120 },
  diastolic: { min: 60, max: 80 },
  glucose: { min: 70, max: 100 },
  heartRate: { min: 60, max: 100 },
  temperature: { min: 97, max: 99 },
};

export const VitalsMonitorPage: React.FC = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<VitalRecord[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'bp' | 'glucose' | 'weight' | 'all'>('all');
  
  // AI Insights States
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    systolic: '',
    diastolic: '',
    glucose: '',
    weight: '',
    heartRate: '',
    temperature: '',
    sleepHours: '',
    stressLevel: '',
    notes: ''
  });

  // Load records from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('vitals_records');
    if (saved) {
      setRecords(JSON.parse(saved));
    }
    
    // Load existing insights from localStorage if present
    const savedInsights = localStorage.getItem('vitals_ai_insights');
    if (savedInsights) {
      setAiInsights(JSON.parse(savedInsights));
    }
  }, []);

  // Save records to localStorage
  useEffect(() => {
    localStorage.setItem('vitals_records', JSON.stringify(records));
  }, [records]);

  const generateAIInsights = async (recordToAnalyze?: VitalRecord) => {
    const record = recordToAnalyze || records[0];
    if (!record) return;

    setLoadingInsights(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('https://sona-ai-backend.onrender.com/api/health-tracker/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          systolic: record.systolic || null,
          diastolic: record.diastolic || null,
          glucose: record.glucose || null,
          heartRate: record.heartRate || null,
          temperature: record.temperature || null,
          weight: record.weight || null,
          sleep_hours: record.sleepHours || null,
          stress_level: record.stressLevel || null,
          notes: record.notes || ''
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiInsights(data);
        localStorage.setItem('vitals_ai_insights', JSON.stringify(data));
      } else {
        console.error("Failed to generate AI insights");
      }
    } catch (e) {
      console.error("Error generating Sona AI insights:", e);
    } finally {
      setLoadingInsights(false);
    }
  };

  const addRecord = () => {
    const record: VitalRecord = {
      id: Date.now(),
      date: newRecord.date,
      systolic: newRecord.systolic ? parseInt(newRecord.systolic) : undefined,
      diastolic: newRecord.diastolic ? parseInt(newRecord.diastolic) : undefined,
      glucose: newRecord.glucose ? parseInt(newRecord.glucose) : undefined,
      weight: newRecord.weight ? parseFloat(newRecord.weight) : undefined,
      heartRate: newRecord.heartRate ? parseInt(newRecord.heartRate) : undefined,
      temperature: newRecord.temperature ? parseFloat(newRecord.temperature) : undefined,
      sleepHours: newRecord.sleepHours ? parseFloat(newRecord.sleepHours) : undefined,
      stressLevel: newRecord.stressLevel ? parseInt(newRecord.stressLevel) : undefined,
      notes: newRecord.notes
    };

    const updated = [record, ...records];
    setRecords(updated);
    setShowAddModal(false);
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      systolic: '',
      diastolic: '',
      glucose: '',
      weight: '',
      heartRate: '',
      temperature: '',
      sleepHours: '',
      stressLevel: '',
      notes: ''
    });

    // Auto generate insights for this new reading!
    generateAIInsights(record);
  };

  const deleteRecord = (id: number) => {
    const updated = records.filter(r => r.id !== id);
    setRecords(updated);
    if (updated.length === 0) {
      setAiInsights(null);
      localStorage.removeItem('vitals_ai_insights');
    }
  };


  const getStatus = (value: number, type: keyof typeof normalRanges) => {
    const range = normalRanges[type];
    if (value < range.min) return { status: 'low', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (value > range.max) return { status: 'high', color: 'text-red-600', bg: 'bg-red-50' };
    return { status: 'normal', color: 'text-green-600', bg: 'bg-green-50' };
  };

  // Prepare chart data
  const chartData = [...records].reverse().slice(-30).map(r => ({
    date: r.date.slice(5),
    systolic: r.systolic,
    diastolic: r.diastolic,
    glucose: r.glucose,
    weight: r.weight,
    heartRate: r.heartRate
  }));

  const latestRecord = records[0];

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
                <h1 className="text-2xl font-bold text-gray-900">Vitals Monitor</h1>
                <p className="text-sm text-gray-500">BP & Glucose tracking</p>
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

      {/* Latest Readings */}
      {latestRecord && (
        <div className="max-w-4xl mx-auto px-4 mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Latest Readings</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {latestRecord.systolic && latestRecord.diastolic && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-4 shadow-lg border-2 border-purple-100"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-purple-500" />
                  <span className="text-sm text-gray-600">Blood Pressure</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {latestRecord.systolic}/{latestRecord.diastolic}
                </p>
                <p className="text-xs text-gray-500">mmHg</p>
                {(() => {
                  const sysStatus = getStatus(latestRecord.systolic!, 'systolic');
                  const diaStatus = getStatus(latestRecord.diastolic!, 'diastolic');
                  const isNormal = sysStatus.status === 'normal' && diaStatus.status === 'normal';
                  return (
                    <span className={`text-xs px-2 py-1 rounded-full ${isNormal ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {isNormal ? 'Normal' : 'Check'}
                    </span>
                  );
                })()}
              </motion.div>
            )}

            {latestRecord.glucose && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-4 shadow-lg border-2 border-blue-100"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-600">Glucose</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{latestRecord.glucose}</p>
                <p className="text-xs text-gray-500">mg/dL</p>
                {(() => {
                  const status = getStatus(latestRecord.glucose, 'glucose');
                  return (
                    <span className={`text-xs px-2 py-1 rounded-full ${status.bg} ${status.color}`}>
                      {status.status}
                    </span>
                  );
                })()}
              </motion.div>
            )}

            {latestRecord.heartRate && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-4 shadow-lg border-2 border-red-100"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="text-sm text-gray-600">Heart Rate</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{latestRecord.heartRate}</p>
                <p className="text-xs text-gray-500">bpm</p>
              </motion.div>
            )}

            {latestRecord.weight && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-4 shadow-lg border-2 border-green-100"
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">Weight</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{latestRecord.weight}</p>
                <p className="text-xs text-gray-500">kg</p>
              </motion.div>
            )}
          </div>

          {/* Sona AI Insights Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-purple-100 overflow-hidden relative"
          >
            {/* Background glowing gradients */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-300 rounded-full opacity-20 filter blur-xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-300 rounded-full opacity-20 filter blur-xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-50 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-md text-white">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-1.5 font-serif">
                    Sona AI Personalized Insights
                  </h3>
                  <p className="text-xs text-gray-500">Holistic pregnancy & postpartum health advice</p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => generateAIInsights()}
                disabled={loadingInsights}
                className="border-purple-200 hover:border-purple-300 text-purple-700 rounded-xl w-fit"
              >
                {loadingInsights ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Regenerate Insights
                  </>
                )}
              </Button>
            </div>

            {loadingInsights && !aiInsights ? (
              <div className="py-12 text-center">
                <Loader2 className="w-10 h-10 animate-spin text-purple-500 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">Sona AI is analyzing your vitals...</p>
                <p className="text-xs text-gray-500 mt-1">Applying WHO guidelines & patient history</p>
              </div>
            ) : aiInsights ? (
              <div className="space-y-5">
                {/* Overall status and summary */}
                <div className="flex gap-4 items-start bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-blue-50/30 p-4 rounded-2xl border border-purple-100/50">
                  <div className="flex-shrink-0 mt-0.5">
                    {aiInsights.overall_status === 'excellent' ? (
                      <span className="text-3xl">🌟</span>
                    ) : aiInsights.overall_status === 'warning' ? (
                      <ShieldAlert className="w-6 h-6 text-red-500" />
                    ) : (
                      <Brain className="w-6 h-6 text-purple-500 animate-pulse" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        aiInsights.overall_status === 'excellent' ? 'bg-green-100 text-green-700' :
                        aiInsights.overall_status === 'warning' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        Sona Assessment: {aiInsights.overall_status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 leading-relaxed mt-2 font-medium">
                      {aiInsights.summary}
                    </p>
                  </div>
                </div>

                {/* Analysis detail items */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {aiInsights.analysis?.blood_pressure && (
                    <div className="p-3.5 bg-gray-50/80 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 mb-1">
                        <Activity className="w-3.5 h-3.5" />
                        Blood Pressure
                      </div>
                      <p className="text-xs text-gray-600 leading-normal">{aiInsights.analysis.blood_pressure}</p>
                    </div>
                  )}
                  {aiInsights.analysis?.glucose && (
                    <div className="p-3.5 bg-gray-50/80 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 mb-1">
                        <Droplets className="w-3.5 h-3.5" />
                        Blood Glucose
                      </div>
                      <p className="text-xs text-gray-600 leading-normal">{aiInsights.analysis.glucose}</p>
                    </div>
                  )}
                  {aiInsights.analysis?.other_vitals && (
                    <div className="p-3.5 bg-gray-50/80 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 mb-1">
                        <Moon className="w-3.5 h-3.5" />
                        Sleep & Lifestyle
                      </div>
                      <p className="text-xs text-gray-600 leading-normal">{aiInsights.analysis.other_vitals}</p>
                    </div>
                  )}
                </div>

                {/* Recommendations */}
                {aiInsights.recommendations?.length > 0 && (
                  <div className="bg-white rounded-xl p-4 border border-purple-50">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-purple-700 mb-3 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                      Sona Recommendations & Comfort Steps
                    </h4>
                    <ul className="space-y-2">
                      {aiInsights.recommendations.map((rec: string, idx: number) => (
                        <li key={idx} className="text-xs text-gray-700 flex items-start gap-2 leading-relaxed">
                          <span className="text-purple-500 font-bold mt-0.5">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Warnings */}
                {aiInsights.warnings?.length > 0 && (
                  <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-red-700 flex items-center gap-1.5 mb-2">
                      <ShieldAlert className="w-4 h-4 text-red-500" />
                      Warning Red Flags (Call Provider Immediately)
                    </h4>
                    <ul className="space-y-1.5">
                      {aiInsights.warnings.map((warn: string, idx: number) => (
                        <li key={idx} className="text-xs text-red-900 flex items-start gap-2 font-medium">
                          <span className="text-red-500 mt-0.5">⚠️</span>
                          <span>{warn}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                <Brain className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 font-medium">Sona AI Checkup Ready</p>
                <p className="text-xs text-gray-500 mt-1 mb-4">Click below to generate personalized health insights on your logged vitals.</p>
                <Button
                  onClick={() => generateAIInsights()}
                  className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate AI Insights
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}


      {/* Charts */}
      {records.length > 1 && (
        <div className="max-w-4xl mx-auto px-4 mt-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trends (Last 30 records)</h3>
            
            {/* BP Chart */}
            {records.some(r => r.systolic) && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Blood Pressure</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" fontSize={10} />
                      <YAxis domain={[60, 160]} fontSize={10} />
                      <Tooltip />
                      <ReferenceLine y={120} stroke="red" strokeDasharray="3 3" />
                      <ReferenceLine y={80} stroke="red" strokeDasharray="3 3" />
                      <Line type="monotone" dataKey="systolic" stroke="#9333ea" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="diastolic" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Glucose Chart */}
            {records.some(r => r.glucose) && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Blood Glucose</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" fontSize={10} />
                      <YAxis domain={[60, 200]} fontSize={10} />
                      <Tooltip />
                      <ReferenceLine y={100} stroke="red" strokeDasharray="3 3" />
                      <Line type="monotone" dataKey="glucose" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Weight Chart */}
            {records.some(r => r.weight) && (
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">Weight</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" fontSize={10} />
                      <YAxis fontSize={10} />
                      <Tooltip />
                      <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* History List */}
      <div className="max-w-4xl mx-auto px-4 mt-6 pb-20">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">History</h3>
        {records.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No records yet</p>
            <Button 
              onClick={() => setShowAddModal(true)}
              className="mt-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Record
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {records.slice(0, 20).map((record) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-4 shadow-md border border-purple-100"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{record.date}</p>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {record.systolic && (
                        <span className="text-sm bg-purple-50 text-purple-700 px-2 py-1 rounded-lg">
                          BP: {record.systolic}/{record.diastolic}
                        </span>
                      )}
                      {record.glucose && (
                        <span className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded-lg">
                          Glucose: {record.glucose} mg/dL
                        </span>
                      )}
                      {record.weight && (
                        <span className="text-sm bg-green-50 text-green-700 px-2 py-1 rounded-lg">
                          Weight: {record.weight} kg
                        </span>
                      )}
                      {record.heartRate && (
                        <span className="text-sm bg-red-50 text-red-700 px-2 py-1 rounded-lg">
                          HR: {record.heartRate} bpm
                        </span>
                      )}
                    </div>
                    {record.notes && (
                      <p className="text-sm text-gray-500 mt-2">{record.notes}</p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteRecord(record.id)}
                    className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add Record Modal */}
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
                <h3 className="text-xl font-semibold text-gray-900">Add Vital Record</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    value={newRecord.date}
                    onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                    className="w-full mt-1 p-2 border rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Systolic BP</label>
                    <Input 
                      type="number"
                      value={newRecord.systolic}
                      onChange={(e) => setNewRecord({...newRecord, systolic: e.target.value})}
                      placeholder="120"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Diastolic BP</label>
                    <Input 
                      type="number"
                      value={newRecord.diastolic}
                      onChange={(e) => setNewRecord({...newRecord, diastolic: e.target.value})}
                      placeholder="80"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Glucose (mg/dL)</label>
                    <Input 
                      type="number"
                      value={newRecord.glucose}
                      onChange={(e) => setNewRecord({...newRecord, glucose: e.target.value})}
                      placeholder="90"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Weight (kg)</label>
                    <Input 
                      type="number"
                      step="0.1"
                      value={newRecord.weight}
                      onChange={(e) => setNewRecord({...newRecord, weight: e.target.value})}
                      placeholder="65.5"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Heart Rate (bpm)</label>
                    <Input 
                      type="number"
                      value={newRecord.heartRate}
                      onChange={(e) => setNewRecord({...newRecord, heartRate: e.target.value})}
                      placeholder="72"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Temperature (°F)</label>
                    <Input 
                      type="number"
                      step="0.1"
                      value={newRecord.temperature}
                      onChange={(e) => setNewRecord({...newRecord, temperature: e.target.value})}
                      placeholder="98.6"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Sleep (Hours)</label>
                    <Input 
                      type="number"
                      step="0.5"
                      value={newRecord.sleepHours}
                      onChange={(e) => setNewRecord({...newRecord, sleepHours: e.target.value})}
                      placeholder="8"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Stress Level (1-10)</label>
                    <Input 
                      type="number"
                      min="1"
                      max="10"
                      value={newRecord.stressLevel}
                      onChange={(e) => setNewRecord({...newRecord, stressLevel: e.target.value})}
                      placeholder="3"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Notes</label>
                  <Input 
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                    placeholder="Any observations..."
                    className="mt-1"
                  />
                </div>


                <Button
                  onClick={addRecord}
                  className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-6"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Save Record
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VitalsMonitorPage;
