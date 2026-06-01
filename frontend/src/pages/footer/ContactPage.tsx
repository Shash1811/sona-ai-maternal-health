import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Send, Mail, MapPin, Phone, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all the details.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      toast.success("Message sent! Sona support team will reach out shortly.");
      setFormData({ name: '', email: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-purple-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-purple-100 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-6 h-6 text-purple-700" />
            </motion.button>
            <h1 className="text-xl font-bold text-gray-950 font-serif">Contact Sona AI</h1>
          </div>
          <Button onClick={() => navigate('/auth')} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl">
            Get Support
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Info */}
        <div className="space-y-8">
          <div className="space-y-4">
            <span className="text-xs uppercase font-extrabold tracking-widest text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
              Get in Touch
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-950 font-serif leading-tight">
              We're Here to Support You
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Have clinical feedback, account concerns, or custom integration requests? Our team is always ready to connect.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-purple-100">
              <div className="p-3 bg-pink-50 text-pink-700 rounded-xl">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Email Address</p>
                <p className="text-sm font-bold text-gray-950">support@sona.ai</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-purple-100">
              <div className="p-3 bg-purple-50 text-purple-700 rounded-xl">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Emergency Crisis Support</p>
                <p className="text-sm font-bold text-gray-950">1-833-TLC-MAMA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-3xl shadow-xl border border-purple-100"
        >
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
            <h3 className="text-lg font-bold text-gray-950">Submit Support Ticket</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-600">Your Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Emma Watson"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600">Email Address</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="emma@example.com"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600">Your Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="Tell us how we can help..."
                className="w-full mt-1 p-3 bg-white border border-input rounded-md text-sm min-h-[120px] focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-400 resize-none transition-all"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl py-6 mt-4 font-bold shadow-md hover:shadow-lg transition-all"
            >
              {loading ? "Sending..." : <><Send className="w-4 h-4 mr-2" /> Send Message</>}
            </Button>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default ContactPage;
