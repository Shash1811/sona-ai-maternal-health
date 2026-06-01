import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, CalendarDays, Plus, Clock, MapPin, Bell, X, ChevronLeft as ChevronLeftIcon, ChevronRight, Video, Stethoscope, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';


interface Appointment {
  id: number;
  title: string;
  doctor: string;
  doctor_id?: number;
  doctor_name?: string;
  date: string;
  time: string;
  location: string;
  type: 'checkup' | 'ultrasound' | 'vaccination' | 'test' | 'consult' | 'other';
  notes?: string;
  meeting_url?: string;
  status?: string;
}

const appointmentTypes = {
  checkup: { color: 'bg-blue-100 text-blue-700', icon: '🩺' },
  ultrasound: { color: 'bg-purple-100 text-purple-700', icon: '📡' },
  vaccination: { color: 'bg-green-100 text-green-700', icon: '💉' },
  test: { color: 'bg-yellow-100 text-yellow-700', icon: '🧪' },
  consult: { color: 'bg-indigo-100 text-indigo-700', icon: '💻' },
  other: { color: 'bg-gray-100 text-gray-700', icon: '📋' }
};

export const HealthCalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  
  // Professional scheduling states
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isBookingConsult, setIsBookingConsult] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | ''>('');

  const [newAppointment, setNewAppointment] = useState({
    title: '',
    doctor: '',
    time: '',
    location: '',
    type: 'checkup' as const,
    notes: ''
  });

  // Load data on mount
  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://127.0.0.1:8000/api/health-tracker/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        const formatted = data.map((a: any) => ({
          id: a.id,
          title: a.title,
          doctor: a.doctor_name || '',
          doctor_id: a.doctor_id,
          doctor_name: a.doctor_name,
          date: a.date,
          time: a.time,
          location: a.location || '',
          type: a.type,
          notes: a.notes || '',
          meeting_url: a.meeting_url || '',
          status: a.status
        }));
        setAppointments(formatted);
      } else {
        // Fallback to local storage if API fails or token is missing
        const saved = localStorage.getItem('health_appointments');
        if (saved) {
          setAppointments(JSON.parse(saved));
        }
      }
    } catch (e) {
      console.error("Error fetching appointments:", e);
      const saved = localStorage.getItem('health_appointments');
      if (saved) {
        setAppointments(JSON.parse(saved));
      }
    }
  };

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://127.0.0.1:8000/api/health-tracker/doctors', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      }
    } catch (e) {
      console.error("Error fetching doctors:", e);
    }
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getAppointmentsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return appointments.filter(a => a.date === dateStr);
  };

  const handleDateClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setShowAddModal(true);
  };

  const handleAddAppointment = async () => {
    if (!newAppointment.title || !newAppointment.time) return;

    let doctorName = newAppointment.doctor;
    let doctorId: number | null = null;
    
    if (isBookingConsult && selectedDoctorId) {
      const doc = doctors.find(d => d.id === selectedDoctorId);
      if (doc) {
        doctorName = `${doc.professional_title} ${doc.first_name} ${doc.last_name || doc.username}`;
        doctorId = doc.id;
      }
    }

    const payload = {
      title: newAppointment.title,
      doctor_id: doctorId,
      doctor_name: doctorName || null,
      date: selectedDate,
      time: newAppointment.time,
      location: isBookingConsult ? "Telehealth Video Call" : newAppointment.location,
      type: isBookingConsult ? "consult" : newAppointment.type,
      notes: newAppointment.notes
    };

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://127.0.0.1:8000/api/health-tracker/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        fetchAppointments();
        setShowAddModal(false);
        setNewAppointment({ title: '', doctor: '', time: '', location: '', type: 'checkup', notes: '' });
        setSelectedDoctorId('');
        setIsBookingConsult(false);
      } else {
        console.error("Failed to add appointment to server");
      }
    } catch (e) {
      console.error("Error booking appointment:", e);
      // Local fallback
      const localAppt: Appointment = {
        id: Date.now(),
        title: newAppointment.title,
        doctor: doctorName,
        date: selectedDate,
        time: newAppointment.time,
        location: newAppointment.location,
        type: isBookingConsult ? 'consult' : newAppointment.type as any,
        notes: newAppointment.notes
      };
      const updated = [...appointments, localAppt];
      setAppointments(updated);
      localStorage.setItem('health_appointments', JSON.stringify(updated));
      setShowAddModal(false);
    }
  };

  const handleDeleteAppointment = async (id: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://127.0.0.1:8000/api/health-tracker/appointments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        fetchAppointments();
      } else {
        console.error("Failed to cancel appointment");
      }
    } catch (e) {
      console.error("Error cancelling appointment:", e);
      const updated = appointments.filter(a => a.id !== id);
      setAppointments(updated);
      localStorage.setItem('health_appointments', JSON.stringify(updated));
    }
  };

  // Get upcoming appointments (next 7 days)
  const upcomingAppointments = appointments.filter(a => {
    const appDate = new Date(a.date);
    const today = new Date();
    today.setHours(0,0,0,0);
    const diffTime = appDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());


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
                <h1 className="text-2xl font-bold text-gray-900">Health Calendar</h1>
                <p className="text-sm text-gray-500">Track appointments & reminders</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Calendar Navigation */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {monthNames[month]} {year}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayAppointments = getAppointmentsForDate(day);
              const hasAppointments = dayAppointments.length > 0;
              const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

              return (
                <motion.button
                  key={day}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDateClick(day)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all ${
                    isToday 
                      ? 'bg-purple-100 border-2 border-purple-400' 
                      : hasAppointments 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <span className={`text-sm font-medium ${isToday ? 'text-purple-700' : 'text-gray-700'}`}>
                    {day}
                  </span>
                  {hasAppointments && (
                    <div className="flex gap-0.5 mt-1">
                      {dayAppointments.slice(0, 3).map((a, idx) => (
                        <div 
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full ${appointmentTypes[a.type].color.split(' ')[0].replace('bg-', 'bg-').replace('100', '400')}`} 
                        />
                      ))}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Upcoming (7 days)</h3>
          <span className="text-sm text-gray-500">{upcomingAppointments.length} appointments</span>
        </div>

        {upcomingAppointments.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No upcoming appointments</p>
            <Button 
              onClick={() => setShowAddModal(true)}
              className="mt-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Appointment
            </Button>
          </div>
        ) : (
          <div className="space-y-3 pb-20">
            {upcomingAppointments.map((appointment) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-5 shadow-lg border border-purple-100"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${appointmentTypes[appointment.type].color}`}>
                    {appointmentTypes[appointment.type].icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{appointment.title}</h4>
                        <p className="text-sm text-gray-600">{appointment.doctor}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteAppointment(appointment.id)}
                        className="p-1 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-4 h-4" />
                        {new Date(appointment.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {appointment.time}
                      </span>
                    </div>
                    {appointment.location && (
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {appointment.location}
                      </p>
                    )}
                    {appointment.meeting_url && (
                      <motion.a
                        href={appointment.meeting_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-xs font-bold rounded-xl shadow-md transition-all animate-pulse"
                      >
                        <Video className="w-4 h-4" />
                        Join Telehealth Video Call
                      </motion.a>
                    )}
                    {appointment.notes && (
                      <p className="text-sm text-gray-500 mt-2 bg-gray-50 p-2 rounded-lg">
                        {appointment.notes}
                      </p>
                    )}

                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add Appointment Modal */}
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
                <h3 className="text-xl font-semibold text-gray-900">Add Appointment</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Personal vs. Professional Switch Tabs */}
              <div className="grid grid-cols-2 gap-2 bg-purple-50 p-1 rounded-2xl mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setIsBookingConsult(false);
                    setNewAppointment({ ...newAppointment, type: 'checkup', title: '' });
                  }}
                  className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    !isBookingConsult 
                      ? 'bg-white text-purple-700 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  Personal Event
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsBookingConsult(true);
                    setNewAppointment({ ...newAppointment, type: 'consult', title: 'Clinical Consultation' });
                  }}
                  className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    isBookingConsult 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  Book Consult
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Date</label>
                  <Input value={selectedDate} disabled className="mt-1 bg-gray-50" />
                </div>

                {!isBookingConsult ? (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Title</label>
                      <Input 
                        value={newAppointment.title}
                        onChange={(e) => setNewAppointment({...newAppointment, title: e.target.value})}
                        placeholder="e.g., Blood pressure check"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Doctor / Clinician (Optional)</label>
                      <Input 
                        value={newAppointment.doctor}
                        onChange={(e) => setNewAppointment({...newAppointment, doctor: e.target.value})}
                        placeholder="e.g., Dr. Smith"
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Time</label>
                        <Input 
                          type="time"
                          value={newAppointment.time}
                          onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">Type</label>
                        <select
                          value={newAppointment.type}
                          onChange={(e) => setNewAppointment({...newAppointment, type: e.target.value as any})}
                          className="w-full mt-1 p-2 border rounded-xl bg-white h-10 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
                        >
                          {Object.entries(appointmentTypes).map(([key, value]) => (
                            <option key={key} value={key}>
                              {value.icon} {key.charAt(0).toUpperCase() + key.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Location</label>
                      <Input 
                        value={newAppointment.location}
                        onChange={(e) => setNewAppointment({...newAppointment, location: e.target.value})}
                        placeholder="e.g., Hospital clinic or Home"
                        className="mt-1"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Select Clinical Specialist</label>
                      <select
                        value={selectedDoctorId}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedDoctorId(val ? parseInt(val) : '');
                          const doc = doctors.find(d => d.id === parseInt(val));
                          if (doc) {
                            setNewAppointment(prev => ({
                              ...prev,
                              title: `Consultation with ${doc.professional_title} ${doc.first_name} ${doc.last_name || doc.username}`
                            }));
                          }
                        }}
                        className="w-full mt-1 p-2 border rounded-xl bg-white h-10 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
                      >
                        <option value="">-- Choose Medical Provider --</option>
                        {doctors.map((doc) => (
                          <option key={doc.id} value={doc.id}>
                            {doc.professional_title} {doc.first_name} {doc.last_name || doc.username} ({doc.specialization})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Appointment Title</label>
                      <Input 
                        value={newAppointment.title}
                        onChange={(e) => setNewAppointment({...newAppointment, title: e.target.value})}
                        placeholder="e.g., Video Consultation"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Time</label>
                      <Input 
                        type="time"
                        value={newAppointment.time}
                        onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 font-serif text-purple-700 flex items-center gap-1.5">
                        <Video className="w-4 h-4" />
                        Consultation Mode
                      </label>
                      <div className="mt-1 p-3 bg-purple-50 rounded-xl text-xs text-purple-800 leading-normal border border-purple-100 flex items-start gap-2">
                        <span>💡</span>
                        <span>This is a Telehealth Consultation. Sona AI will automatically generate a secure, end-to-end encrypted video meeting room link for you and the clinician.</span>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-700">Notes / Symptoms</label>
                  <Input 
                    value={newAppointment.notes}
                    onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                    placeholder="Any details you wish to share..."
                    className="mt-1"
                  />
                </div>

                <Button
                  onClick={handleAddAppointment}
                  className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-6 mt-4"
                >
                  {isBookingConsult ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Book & Generate Video Link
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Save Personal Event
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HealthCalendarPage;
