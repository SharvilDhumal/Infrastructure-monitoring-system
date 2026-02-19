import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  Upload, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Type, 
  ChevronRight,
  Camera,
  MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';

const FAULT_TYPES = [
  { id: 'road-damage', label: 'Road Damage' },
  { id: 'bridge-issue', label: 'Bridge Issue' },
  { id: 'traffic-light', label: 'Traffic Light Malfunction' },
  { id: 'street-light', label: 'Street Light Outage' },
  { id: 'drainage', label: 'Drainage Problem' },
  { id: 'sidewalk', label: 'Sidewalk Damage' },
  { id: 'signage', label: 'Signage Issue' },
  { id: 'other', label: 'Other' },
];

const ReportFormPage = () => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    image: null,
    imagePreview: null,
    faultType: '',
    location: '',
    description: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  const handleFile = (file) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, GIF)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: e.target.result
      }));
    };
    reader.readAsDataURL(file);
    if (errors.image) setErrors(prev => ({ ...prev, image: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.image) newErrors.image = 'Image is required';
    if (!formData.faultType) newErrors.faultType = 'Select a fault type';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check authentication
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');

    if (!token) {
      toast.error('Login first to report an issue');
      return;
    }

    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/issues';
      
      const response = await axios.post(API_URL, {
        title: formData.faultType, // Using faultType as title for now, or could combine
        faultType: formData.faultType,
        location: formData.location,
        description: formData.description,
        imageUrl: formData.imagePreview // For now sending base64 preview, in prod use S3/Cloudinary
      }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setIsSubmitted(true);
        toast.success('Report submitted successfully!');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit report');
    } finally {
      setIsLoading(true); // Wait, should be false, but simulated was false.
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setIsSubmitted(false);
    setFormData({
      image: null,
      imagePreview: null,
      faultType: '',
      location: '',
      description: ''
    });
    setErrors({});
  };

  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto bg-white dark:bg-white/5 backdrop-blur-2xl p-8 rounded-3xl border border-gray-200 dark:border-white/10 text-center shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500" />
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
            <CheckCircle2 size={40} />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Submission Received</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Your infrastructure report has been recorded. Our response team will be notified immediately.
        </p>
        <button
          onClick={handleBack}
          className="w-full py-4 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group"
        >
          Submit New Report
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
          Report <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Infrastructure</span> Fault
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-lg mx-auto">
          Help us maintain your city. Provide details about the issue and we'll handle the rest.
        </p>
      </div>

      <div className="bg-white dark:bg-white/5 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full" />

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-gray-700 dark:text-gray-400 font-medium ml-1 flex items-center gap-2">
              <Camera size={18} /> Evidence Image
            </label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFile(e.dataTransfer.files[0]); }}
              className={`relative h-64 border-2 border-dashed rounded-3xl transition-all duration-300 group overflow-hidden ${
                dragActive ? 'border-blue-500 bg-blue-500/10' : 
                errors.image ? 'border-red-500/50 bg-red-500/5' : 
                formData.imagePreview ? 'border-gray-200 dark:border-white/20' : 'border-gray-200 dark:border-white/10 hover:border-blue-400/50 dark:hover:border-white/30 hover:bg-gray-50 dark:hover:bg-white/5 '
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
              
              <AnimatePresence mode="wait">
                {formData.imagePreview ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 p-4"
                  >
                    <img 
                      src={formData.imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover rounded-2xl"
                    />
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setFormData(prev => ({ ...prev, image: null, imagePreview: null })); }}
                      className="absolute top-6 right-6 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors z-30 backdrop-blur-md border border-white/10"
                    >
                      <X size={20} />
                    </button>
                    <div className="absolute bottom-6 left-6 right-6 p-3 bg-black/40 backdrop-blur-md rounded-xl text-white text-xs font-medium border border-white/10 truncate">
                      {formData.image.name}
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-transparent">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300 shadow-xl border border-blue-500/20">
                      <Upload size={28} />
                    </div>
                    <p className="text-gray-900 dark:text-white font-semibold text-lg mb-1">Click or drag photo here</p>
                    <p className="text-gray-500 text-sm">Clear captures help us respond faster</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
            {errors.image && <p className="text-red-400 text-xs mt-1 flex items-center gap-1 ml-1"><AlertCircle size={12} /> {errors.image}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Fault Type */}
            <div className="space-y-2">
              <label htmlFor="faultType" className="text-gray-700 dark:text-gray-400 font-medium ml-1 flex items-center gap-2">
                <AlertCircle size={18} /> Type of Issue
              </label>
              <div className="relative">
                <select
                  id="faultType"
                  name="faultType"
                  value={formData.faultType}
                  onChange={handleChange}
                  className={`w-full bg-gray-50 dark:bg-white/5 border rounded-2xl py-4 px-5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 ${
                    errors.faultType ? 'border-red-500/50' : 'border-gray-200 dark:border-white/10'
                  }`}
                >
                  <option value="" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Select a category</option>
                  {FAULT_TYPES.map(type => (
                    <option key={type.id} value={type.id} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">{type.label}</option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
              {errors.faultType && <p className="text-red-400 text-xs mt-1 flex items-center gap-1 ml-1"><AlertCircle size={12} /> {errors.faultType}</p>}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label htmlFor="location" className="text-gray-700 dark:text-gray-400 font-medium ml-1 flex items-center gap-2">
                <MapPin size={18} /> Incident Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Where is the fault?"
                className={`w-full bg-gray-50 dark:bg-white/5 border rounded-2xl py-4 px-5 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:bg-gray-100 dark:hover:bg-white/10 ${
                  errors.location ? 'border-red-500/50' : 'border-gray-200 dark:border-white/10'
                }`}
              />
              {errors.location && <p className="text-red-400 text-xs mt-1 flex items-center gap-1 ml-1"><AlertCircle size={12} /> {errors.location}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-gray-700 dark:text-gray-400 font-medium ml-1 flex items-center gap-2">
              <MessageSquare size={18} /> Detailed Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Tell us what's wrong..."
              className={`w-full bg-gray-50 dark:bg-white/5 border rounded-[1.5rem] py-4 px-5 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:bg-gray-100 dark:hover:bg-white/10 resize-none ${
                errors.description ? 'border-red-500/50' : 'border-gray-200 dark:border-white/10'
              }`}
            />
            {errors.description && <p className="text-red-400 text-xs mt-1 flex items-center gap-1 ml-1"><AlertCircle size={12} /> {errors.description}</p>}
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group disabled:opacity-70 disabled:hover:scale-100"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 size={24} className="group-hover:rotate-12 transition-transform" />
                Submit Infrastructure Report
              </>
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default ReportFormPage;
