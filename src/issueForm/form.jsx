import React, { useState, useRef } from 'react';
import './form.css';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please select only image files (PNG, JPG, GIF)');
        e.target.value = ''; // Clear the input
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
      
      // Clear error when file is selected
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: ''
        }));
      }
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.image) {
      newErrors.image = 'Please upload an image of the infrastructure fault';
    }
    
    if (!formData.faultType.trim()) {
      newErrors.faultType = 'Please select a type of fault';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Please enter the location';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Please provide a description of the issue';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please drop only image files (PNG, JPG, GIF)');
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
      
      // Clear error when file is selected
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: ''
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }
    
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
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

  const handleRemoveImage = () => {
    console.log('Remove button clicked!'); // Debug log
    // Clear the file input using ref
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      console.log('File input cleared'); // Debug log
    }
    // Reset form data
    setFormData(prev => ({
      ...prev,
      image: null,
      imagePreview: null
    }));
    console.log('Form data reset'); // Debug log
  };

  if (isSubmitted) {
    return (
      <div className="form-container card">
        <div className="text-center">
          <div className="success-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="mb-2">Report Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">Your infrastructure issue has been submitted and will be reviewed by our team.</p>
          <button
            onClick={handleBack}
            className="btn btn-primary"
          >
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container card">
      <div className="form-header">
        <h1 className="mb-2">Report an Issue</h1>
        <p className="text-gray-600">Upload an image of the infrastructure fault and provide details.</p>
      </div>

      <form onSubmit={handleSubmit} className="form-spacing">
        {/* Image Upload Section */}
        <div className="form-group">
          <label className="form-label">
            Upload Image *
          </label>
          <div
            className={`upload-area ${dragActive ? 'drag-active' : ''} ${errors.image ? 'error' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpg,image/jpeg,image/gif"
              onChange={handleFileChange}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
            />
            {formData.imagePreview ? (
              <div className="image-preview-container">
                <img 
                  src={formData.imagePreview} 
                  alt="Uploaded infrastructure issue" 
                  className="image-preview"
                />
                <div className="image-info">
                  <p className="file-selected">✓ {formData.image.name}</p>
                  <button 
                    type="button"
                    onClick={handleRemoveImage}
                    className="remove-image-btn"
                  >
                    Remove Image
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p className="upload-text">Click to upload or drag and drop</p>
                <p className="upload-subtext">PNG, JPG, GIF up to 10MB</p>
              </div>
            )}
          </div>
          {errors.image && <div className="error-message">{errors.image}</div>}
        </div>

        {/* Type of Fault Dropdown */}
        <div className="form-group">
          <label htmlFor="faultType" className="form-label">
            Type of Fault *
          </label>
          <select
            id="faultType"
            name="faultType"
            value={formData.faultType}
            onChange={handleChange}
            className={`form-select ${errors.faultType ? 'error' : ''}`}
          >
            <option value="">Select a type...</option>
            <option value="road-damage">Road Damage</option>
            <option value="bridge-issue">Bridge Issue</option>
            <option value="traffic-light">Traffic Light Malfunction</option>
            <option value="street-light">Street Light Outage</option>
            <option value="drainage">Drainage Problem</option>
            <option value="sidewalk">Sidewalk Damage</option>
            <option value="signage">Signage Issue</option>
            <option value="other">Other</option>
          </select>
          {errors.faultType && <div className="error-message">{errors.faultType}</div>}
        </div>

        {/* Location Input */}
        <div className="form-group">
          <label htmlFor="location" className="form-label">
            Location *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={`form-input ${errors.location ? 'error' : ''}`}
            placeholder="e.g., Near City Hall, Main Street"
          />
          {errors.location && <div className="error-message">{errors.location}</div>}
        </div>

        {/* Description Textarea */}
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className={`form-textarea ${errors.description ? 'error' : ''}`}
            placeholder="Provide a brief description of the issue..."
          />
          {errors.description && <div className="error-message">{errors.description}</div>}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="btn btn-primary btn-full"
            style={{ padding: '12px 24px', fontSize: '18px' }}
          >
            Submit Report
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportFormPage;
