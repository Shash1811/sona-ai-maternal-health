import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Video, MessageCircle, ChevronLeft, Star, Clock, Calendar, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  nextAvailable: string;
  languages: string[];
  consultationFee: number;
  available: boolean;
  avatar?: string;
}

const mockDoctors: Doctor[] = [
  { id: 1, name: "Dr. Priya Sharma", specialty: "Obstetrician & Gynecologist", rating: 4.9, experience: "15 years", nextAvailable: "Today, 4:00 PM", languages: ["English", "Hindi"], consultationFee: 800, available: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya" },
  { id: 2, name: "Dr. Rajesh Kumar", specialty: "Pediatrician", rating: 4.8, experience: "12 years", nextAvailable: "Today, 6:30 PM", languages: ["English", "Hindi", "Kannada"], consultationFee: 600, available: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rajesh" },
  { id: 3, name: "Dr. Anjali Desai", specialty: "Mental Health Counselor", rating: 4.9, experience: "10 years", nextAvailable: "Tomorrow, 10:00 AM", languages: ["English", "Hindi"], consultationFee: 700, available: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=anjali" },
  { id: 4, name: "Dr. Michael Chen", specialty: "Nutritionist", rating: 4.7, experience: "8 years", nextAvailable: "Today, 7:00 PM", languages: ["English"], consultationFee: 500, available: false, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael" },
  { id: 5, name: "Dr. Sarah Williams", specialty: "Lactation Consultant", rating: 4.9, experience: "14 years", nextAvailable: "Tomorrow, 2:00 PM", languages: ["English"], consultationFee: 650, available: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah" },
  { id: 6, name: "Dr. Arun Patel", specialty: "General Physician", rating: 4.6, experience: "20 years", nextAvailable: "Today, 5:00 PM", languages: ["English", "Hindi", "Gujarati"], consultationFee: 400, available: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=arun" },
];

export const ContactDoctorsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [consultationType, setConsultationType] = useState<'video' | 'audio' | 'chat'>('video');

  const specialties = ['all', 'obstetrician', 'pediatrician', 'nutritionist', 'mental health', 'lactation', 'general'];

  const filteredDoctors = mockDoctors.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         d.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || d.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase());
    return matchesSearch && matchesSpecialty;
  });

  const handleBookConsultation = (doctor: Doctor) => {
    alert(`Booking ${consultationType} consultation with ${doctor.name} for ${doctor.nextAvailable}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-purple-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
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
              <h1 className="text-2xl font-bold text-gray-900">Contact Doctors</h1>
              <p className="text-sm text-gray-500">Book consultations with specialists</p>
            </div>
          </div>
        </div>
      </header>

      {/* Consultation Type Selector */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Choose consultation type:</p>
          <div className="flex gap-3">
            {(['video', 'audio', 'chat'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setConsultationType(type)}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  consultationType === type 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {type === 'video' && <Video className="w-4 h-4" />}
                  {type === 'audio' && <Phone className="w-4 h-4" />}
                  {type === 'chat' && <MessageCircle className="w-4 h-4" />}
                  <span className="capitalize">{type}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="bg-white rounded-2xl shadow-lg p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search doctors by name or specialty..."
              className="pl-12 rounded-xl border-purple-200"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {specialties.map((specialty) => (
              <button
                key={specialty}
                onClick={() => setSelectedSpecialty(specialty)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedSpecialty === specialty 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {specialty.charAt(0).toUpperCase() + specialty.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Banner */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Phone className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-purple-900">Need immediate help?</p>
              <p className="text-sm text-purple-700">24/7 Emergency consultation available</p>
            </div>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl">
            Call Now
          </Button>
        </motion.div>
      </div>

      {/* Doctors List */}
      <div className="max-w-4xl mx-auto px-4 mt-6 pb-20 space-y-4">
        {filteredDoctors.map((doctor) => (
          <motion.div
            key={doctor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100"
          >
            <div className="flex gap-4">
              <Avatar className="w-20 h-20 border-2 border-purple-200">
                {doctor.avatar ? (
                  <AvatarImage src={doctor.avatar} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-xl">
                    {doctor.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                    <p className="text-sm text-purple-600">{doctor.specialty}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-yellow-700">{doctor.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {doctor.experience}
                  </span>
                  <span>{doctor.languages.join(', ')}</span>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="text-xs text-gray-500">Next Available</p>
                    <p className="text-sm font-medium text-green-600">{doctor.nextAvailable}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">₹{doctor.consultationFee}</p>
                    <p className="text-xs text-gray-500">consultation fee</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <Button
                variant="outline"
                className="flex-1 rounded-xl border-purple-200 hover:bg-purple-50"
                onClick={() => alert(`Viewing ${doctor.name}'s profile and reviews`)}
              >
                View Profile
              </Button>
              <Button
                onClick={() => handleBookConsultation(doctor)}
                disabled={!doctor.available}
                className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white disabled:opacity-50"
              >
                {doctor.available ? 'Book Now' : 'Not Available'}
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ContactDoctorsPage;
