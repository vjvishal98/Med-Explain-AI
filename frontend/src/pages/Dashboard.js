import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(user?.preferred_language || 'en');

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('language', selectedLanguage);

      // Show progress message
      toast.info('Analyzing your medical report with AI... This may take up to 2 minutes.');

      const response = await api.post('/api/reports/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 120000, // 2 minutes for this specific request
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          if (percentCompleted === 100) {
            toast.info('File uploaded successfully. AI is analyzing your report...');
          }
        }
      });

      toast.success('Medical report uploaded and analyzed successfully!');
      console.log('Upload response:', response.data);
      
    } catch (error) {
      console.error('Upload error:', error);
      
      // Provide specific error messages
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        toast.error('Request timed out. The analysis might be taking longer than expected. Please try again or contact support if the issue persists.');
      } else if (error.response?.status === 401) {
        toast.error('Authentication expired. Please sign in again.');
      } else if (error.response?.status === 413) {
        toast.error('File too large. Please upload a smaller file.');
      } else if (error.response?.data?.detail) {
        toast.error(`Upload failed: ${error.response.data.detail}`);
      } else {
        toast.error('Failed to upload and analyze the report. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  }, [selectedLanguage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 1,
    disabled: uploading
  });

  return (
    <div className="container">
      <div className="dashboard-grid">
        <div className="card">
          <h2 className="card-title">Welcome, {user?.full_name}!</h2>
          <p>
            Upload your medical reports to get AI-powered explanations and insights.
            Our system will analyze your reports and provide clear explanations of
            medical terms, values, and any abnormalities found.
          </p>
        </div>

        <div className="card">
          <h3 className="card-title">Quick Stats</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <strong>Language:</strong> {user?.preferred_language?.toUpperCase() || 'EN'}
            </div>
            <div>
              <strong>Account:</strong> Active
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Upload Medical Report</h3>
        
        <div className="form-group">
          <label htmlFor="language" className="form-label">
            Analysis Language
          </label>
          <select
            id="language"
            className="form-select"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            disabled={uploading}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
            <option value="pt">Portuguese</option>
          </select>
        </div>

        <div 
          {...getRootProps()} 
          className={`upload-zone ${isDragActive ? 'active' : ''} ${uploading ? 'uploading' : ''}`}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div>
              <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
              <p><strong>AI Analysis in Progress...</strong></p>
              <p>Please wait while our AI analyzes your medical report.</p>
              <p style={{ fontSize: '0.9em', color: '#666' }}>
                This process may take 1-2 minutes depending on the complexity of your report.
              </p>
            </div>
          ) : isDragActive ? (
            <p>Drop your medical report here...</p>
          ) : (
            <div>
              <p><strong>Click here or drag and drop your medical report</strong></p>
              <p>Supported formats: PDF, DOC, DOCX, JPG, PNG</p>
              <p>Maximum file size: 10MB</p>
              <p style={{ fontSize: '0.9em', color: '#666', marginTop: '0.5rem' }}>
                🤖 Powered by AI for instant medical report analysis
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">How It Works</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div>
            <h4>1. Upload Report</h4>
            <p>Upload your medical or blood test report in supported formats.</p>
          </div>
          <div>
            <h4>2. AI Analysis</h4>
            <p>Our Llama3.2 AI model deeply analyzes your report content and medical data in real-time.</p>
          </div>
          <div>
            <h4>3. Clear Explanations</h4>
            <p>Get AI-generated explanations of medical terms, values, and any abnormalities found.</p>
          </div>
          <div>
            <h4>4. Health Insights</h4>
            <p>Receive AI-powered, personalized health recommendations based on your specific results.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;