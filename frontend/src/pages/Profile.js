import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  const getLanguageName = (code) => {
    const languages = {
      'en': 'English',
      'es': 'Spanish', 
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese'
    };
    return languages[code] || code.toUpperCase();
  };

  return (
    <div className="container">
      <div className="dashboard-grid">
        <div className="card">
          <h2 className="card-title">User Profile</h2>
          
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ padding: '0.75rem', backgroundColor: '#f8f9fa', borderRadius: '5px', border: '1px solid #e9ecef' }}>
              {user?.full_name}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Username</label>
            <div style={{ padding: '0.75rem', backgroundColor: '#f8f9fa', borderRadius: '5px', border: '1px solid #e9ecef' }}>
              {user?.username}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ padding: '0.75rem', backgroundColor: '#f8f9fa', borderRadius: '5px', border: '1px solid #e9ecef' }}>
              {user?.email}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Preferred Language</label>
            <div style={{ padding: '0.75rem', backgroundColor: '#f8f9fa', borderRadius: '5px', border: '1px solid #e9ecef' }}>
              {getLanguageName(user?.preferred_language)}
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Account Information</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <strong>Account Status:</strong>
              <span style={{ 
                marginLeft: '0.5rem',
                padding: '0.25rem 0.5rem',
                backgroundColor: '#d4edda',
                color: '#155724',
                borderRadius: '3px',
                fontSize: '0.875rem'
              }}>
                Active
              </span>
            </div>
            
            <div>
              <strong>Member Since:</strong> {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long'
              })}
            </div>
            
            <div>
              <strong>Security:</strong> Password Protected
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Privacy & Data</h3>
        <div style={{ lineHeight: '1.6' }}>
          <h4>Data Security</h4>
          <p>
            Your medical reports and personal information are securely stored and encrypted. 
            We comply with healthcare data protection standards to ensure your privacy.
          </p>
          
          <h4>Data Usage</h4>
          <p>
            Your uploaded reports are analyzed using AI to provide medical explanations and 
            health recommendations. Data is only used for your personal health insights and 
            is not shared with third parties without your consent.
          </p>
          
          <h4>Account Management</h4>
          <p>
            You have full control over your account and data. You can request data deletion 
            or export your information at any time by contacting our support team.
          </p>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Help & Support</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div>
            <h4>Getting Started</h4>
            <p>New to MedExplain AI? Check out our quick start guide to learn how to upload and analyze your medical reports.</p>
          </div>
          
          <div>
            <h4>FAQ</h4>
            <p>Find answers to commonly asked questions about report analysis, supported file formats, and account management.</p>
          </div>
          
          <div>
            <h4>Contact Support</h4>
            <p>Need help? Our support team is here to assist you with any questions or technical issues.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;