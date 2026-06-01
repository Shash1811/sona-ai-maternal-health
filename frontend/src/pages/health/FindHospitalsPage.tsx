import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Search, ChevronLeft, Navigation, Clock, Star, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Hospital {
  id: number;
  name: string;
  address: string;
  distance: string;
  rating: number;
  phone: string;
  type: string;
  open: string;
  emergency: boolean;
}

const mockHospitals: Hospital[] = [
  { id: 1, name: "Motherhood Hospital", address: "123 Wellness Avenue, Bangalore", distance: "1.2 km", rating: 4.8, phone: "+91 80 1234 5678", type: "Maternity", open: "Open 24/7", emergency: true },
  { id: 2, name: "Rainbow Children's Hospital", address: "456 Care Street, Bangalore", distance: "2.5 km", rating: 4.9, phone: "+91 80 2345 6789", type: "Pediatric", open: "Open 24/7", emergency: true },
  { id: 3, name: "Fortis La Femme", address: "789 Health Road, Bangalore", distance: "3.1 km", rating: 4.7, phone: "+91 80 3456 7890", type: "Women's Care", open: "8 AM - 8 PM", emergency: false },
  { id: 4, name: "Apollo Cradle", address: "321 Mother Lane, Bangalore", distance: "4.2 km", rating: 4.6, phone: "+91 80 4567 8901", type: "Maternity", open: "Open 24/7", emergency: true },
  { id: 5, name: "Cloudnine Hospital", address: "654 Baby Street, Bangalore", distance: "5.0 km", rating: 4.9, phone: "+91 80 5678 9012", type: "Maternity", open: "Open 24/7", emergency: true },
  { id: 6, name: "Manipal Hospitals", address: "987 Care Avenue, Bangalore", distance: "6.3 km", rating: 4.5, phone: "+91 80 6789 0123", type: "General", open: "Open 24/7", emergency: true },
];

export const FindHospitalsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const handleGetLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation(`${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}`);
          setIsLocating(false);
        },
        () => {
          setUserLocation("Bangalore, India");
          setIsLocating(false);
        }
      );
    } else {
      setUserLocation("Bangalore, India");
      setIsLocating(false);
    }
  };

  useEffect(() => {
    handleGetLocation();
  }, []);

  const filteredHospitals = mockHospitals.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         h.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || h.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleNavigate = (address: string) => {
    window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`, '_blank');
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
              <h1 className="text-2xl font-bold text-gray-900">Find Hospitals</h1>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {userLocation || "Detecting location..."}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Search & Filter */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="bg-white rounded-2xl shadow-lg p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hospitals, clinics..."
              className="pl-12 rounded-xl border-purple-200"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['all', 'maternity', 'pediatric', 'general'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  filterType === type 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
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
          className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Phone className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="font-semibold text-red-900">Emergency?</p>
              <p className="text-sm text-red-700">Call 108 for immediate ambulance</p>
            </div>
          </div>
          <Button 
            onClick={() => handleCall("108")}
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
          >
            Call Now
          </Button>
        </motion.div>
      </div>

      {/* Hospitals List */}
      <div className="max-w-4xl mx-auto px-4 mt-6 pb-20 space-y-4">
        {filteredHospitals.map((hospital) => (
          <motion.div
            key={hospital.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">{hospital.name}</h3>
                  {hospital.emergency && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                      24/7 Emergency
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">{hospital.type}</p>
              </div>
              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-yellow-700">{hospital.rating}</span>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                {hospital.address}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Navigation className="w-4 h-4" />
                {hospital.distance} away • {hospital.open}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => handleCall(hospital.phone)}
                variant="outline"
                className="flex-1 rounded-xl border-purple-200 hover:bg-purple-50"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call
              </Button>
              <Button
                onClick={() => handleNavigate(hospital.address)}
                className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Navigate
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FindHospitalsPage;
