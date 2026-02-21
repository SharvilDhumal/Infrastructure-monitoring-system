import React, { useState, useRef, useEffect, useCallback } from 'react';
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

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);

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

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
    } catch (err) {
      console.error("Camera access error:", err);
      toast.error("Could not access camera. Please check permissions.");
    }
  };

  // Callback ref to handle video stream assignment precisely when element mounts
  const videoCallbackRef = useCallback((node) => {
    videoRef.current = node;
    if (node && stream) {
      node.srcObject = stream;
    }
  }, [stream]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Match canvas dimensions to video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/jpeg');

      // Create a file-like object from data URL
      fetch(dataUrl)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
          setFormData(prev => ({
            ...prev,
            image: file,
            imagePreview: dataUrl
          }));
          stopCamera();
          if (errors.image) setErrors(prev => ({ ...prev, image: '' }));
        });
    }
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

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
      <div className="min-h-[calc(100vh-80px)] w-full bg-white flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full mx-auto bg-white p-8 md:p-12 border border-gray-200 border-t-4 border-t-[#002147] shadow-sm text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-700 border border-green-200">
              <CheckCircle2 size={40} />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Report Successfully Submitted</h2>
          <p className="text-gray-700 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
            Thank you for your report. Your infrastructure fault has been recorded and an incident tracking number has been generated. Our relevant department has been notified.
          </p>
          <button
            onClick={handleBack}
            className="inline-flex py-4 px-8 bg-[#002147] hover:bg-[#003366] text-white text-lg font-medium rounded transition-colors"
          >
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center py-12 px-4">
      <div className="max-w-3xl w-full mx-auto">
        <div className="mb-10 border-b border-gray-200 pb-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-[#002147] mb-3 tracking-tight">
            Infrastructure Fault Report Form
          </h1>
          <p className="text-gray-700 text-lg max-w-2xl">
            Please use this official form to report issues regarding public infrastructure. Provide accurate details to ensure a prompt response.
          </p>
        </div>

        <div className="bg-white p-6 md:p-10 border border-gray-300 shadow-sm relative rounded-md">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-gray-900 font-semibold flex items-center gap-2">
                <Camera size={18} /> Evidence Image
              </label>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFile(e.dataTransfer.files[0]); }}
                className={`relative h-64 border-2 border-dashed transition-all duration-300 group overflow-hidden bg-gray-50 ${dragActive ? 'border-[#002147] bg-[#002147]/5' :
                  errors.image ? 'border-red-500 bg-red-50' :
                    formData.imagePreview ? 'border-gray-300' : 'border-gray-300 hover:border-gray-400'
                  }`}
              >
                {/* Hidden Canvas for capture */}
                <canvas ref={canvasRef} className="hidden" />

                {!isCameraOpen && (
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                )}

                <AnimatePresence mode="wait">
                  {isCameraOpen ? (
                    <motion.div
                      key="camera"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black flex flex-col items-center justify-center"
                    >
                      <video
                        ref={videoCallbackRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-4 flex gap-4 z-30">
                        <button
                          type="button"
                          onClick={capturePhoto}
                          className="p-4 bg-white text-blue-600 rounded-full shadow-lg hover:scale-110 transition-transform"
                          title="Capture Photo"
                        >
                          <Camera size={24} />
                        </button>
                        <button
                          type="button"
                          onClick={stopCamera}
                          className="p-4 bg-red-600 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                          title="Close Camera"
                        >
                          <X size={24} />
                        </button>
                      </div>
                    </motion.div>
                  ) : formData.imagePreview ? (
                    <motion.div
                      key="preview"
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
                        {formData.image?.name || 'Captured Photo'}
                      </div>
                    </motion.div>
                  ) : (
                    <div key="upload" className="h-full flex flex-col items-center justify-center text-center p-6">
                      <div className="flex gap-4 mb-4">
                        <div className="w-14 h-14 bg-gray-200 flex items-center justify-center text-gray-700 shadow-sm border border-gray-300">
                          <Upload size={24} />
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); startCamera(); }}
                          className="w-14 h-14 bg-[#002147] flex items-center justify-center text-white hover:bg-[#003366] transition-colors shadow-sm border border-[#002147] z-30"
                        >
                          <Camera size={24} />
                        </button>
                      </div>
                      <p className="text-gray-900 font-medium mb-1">Click/Drag to upload or use Camera</p>
                      <p className="text-gray-600 text-sm">Clear images help authorities respond faster.</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
              {errors.image && <p className="text-red-400 text-xs mt-1 flex items-center gap-1 ml-1"><AlertCircle size={12} /> {errors.image}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Fault Type */}
              <div className="space-y-2">
                <label htmlFor="faultType" className="text-gray-900 font-semibold flex items-center gap-2">
                  <AlertCircle size={18} /> Type of Issue
                </label>
                <div className="relative">
                  <select
                    id="faultType"
                    name="faultType"
                    value={formData.faultType}
                    onChange={handleChange}
                    className={`w-full bg-white border py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#002147] focus:border-[#002147] appearance-none cursor-pointer ${errors.faultType ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                      }`}
                  >
                    <option value="">Select a category</option>
                    {FAULT_TYPES.map(type => (
                      <option key={type.id} value={type.id}>{type.label}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <ChevronRight size={16} className="rotate-90" />
                  </div>
                </div>
                {errors.faultType && <p className="text-red-600 text-sm mt-1">{errors.faultType}</p>}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label htmlFor="location" className="text-gray-900 font-semibold flex items-center gap-2">
                  <MapPin size={18} /> Incident Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Where is the fault?"
                  className={`w-full bg-white border py-3 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#002147] focus:border-[#002147] ${errors.location ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                    }`}
                />
                {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-gray-900 font-semibold flex items-center gap-2">
                <MessageSquare size={18} /> Detailed Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Provide specific details about the issue..."
                className={`w-full bg-white border py-3 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#002147] focus:border-[#002147] resize-none ${errors.description ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                  }`}
              />
              {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#002147] hover:bg-[#003366] text-white font-medium py-4 px-8 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                'Submit Official Report'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportFormPage;
