import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              MedExplain AI
              <span className="hero-subtitle">Healthcare Assistance Platform</span>
            </h1>
            <p className="hero-description">
              Transform complex medical reports into clear, understandable insights. 
              Get AI-powered explanations of your medical tests, blood work, and health reports 
              in your preferred language.
            </p>
            <div className="hero-buttons">
              {user ? (
                <Link to="/dashboard" className="btn btn-primary btn-large">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/signup" className="btn btn-primary btn-large">
                    Get Started Free
                  </Link>
                  <Link to="/signin" className="btn btn-secondary btn-large">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hero-image">
            <div className="medical-illustration">
              <div className="medical-icon">🏥</div>
              <div className="ai-icon">🤖</div>
              <div className="report-icon">📊</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">How MedExplain AI Helps You</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Understand Medical Terms</h3>
              <p>
                Get clear explanations of complex medical terminology, abbreviations, 
                and technical jargon found in your reports.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Interpret Test Results</h3>
              <p>
                Understand what your blood test values, vital signs, and other 
                medical measurements mean for your health.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🚨</div>
              <h3>Identify Abnormalities</h3>
              <p>
                Quickly spot values that are outside normal ranges and understand 
                their potential significance.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Multi-Language Support</h3>
              <p>
                Receive explanations in your preferred language: English, Spanish, 
                French, German, Italian, and Portuguese.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💡</div>
              <h3>Health Recommendations</h3>
              <p>
                Get personalized lifestyle and dietary suggestions based on your 
                medical report findings.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Medical History Tracking</h3>
              <p>
                Keep track of your medical reports over time and monitor health 
                trends and improvements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Upload Your Report</h3>
                <p>
                  Simply drag and drop or select your medical report files. 
                  We support PDF, Word documents, and medical images.
                </p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>AI Analysis</h3>
                <p>
                  Our advanced AI analyzes your report, identifying key medical 
                  terms, values, and potential abnormalities.
                </p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Get Clear Explanations</h3>
                <p>
                  Receive easy-to-understand explanations of your medical data 
                  in your preferred language.
                </p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Health Insights</h3>
                <p>
                  Get personalized health recommendations and track your medical 
                  history over time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <h2 className="section-title">Why Choose MedExplain AI?</h2>
          <div className="benefits-grid">
            <div className="benefit-item">
              <h3>🔐 Secure & Private</h3>
              <p>Your medical data is encrypted and stored securely. We prioritize your privacy above all.</p>
            </div>
            
            <div className="benefit-item">
              <h3>⚡ Instant Results</h3>
              <p>Get immediate explanations of your medical reports without waiting for appointments.</p>
            </div>
            
            <div className="benefit-item">
              <h3>🎯 Accurate AI</h3>
              <p>Powered by advanced AI trained on medical literature and terminology.</p>
            </div>
            
            <div className="benefit-item">
              <h3>👨‍⚕️ Healthcare Support</h3>
              <p>Better understand your health to have more informed discussions with your doctor.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Files Section */}
      <section className="supported-files-section">
        <div className="container">
          <h2 className="section-title">Supported Report Types</h2>
          <div className="file-types-grid">
            <div className="file-type">
              <div className="file-icon">📄</div>
              <h4>Blood Test Reports</h4>
              <p>Complete blood count, lipid panels, metabolic panels, and more</p>
            </div>
            
            <div className="file-type">
              <div className="file-icon">🫀</div>
              <h4>Cardiac Reports</h4>
              <p>EKG results, echocardiograms, stress tests, and cardiac enzymes</p>
            </div>
            
            <div className="file-type">
              <div className="file-icon">🧬</div>
              <h4>Laboratory Results</h4>
              <p>Hormone tests, genetic panels, allergy tests, and pathology reports</p>
            </div>
            
            <div className="file-type">
              <div className="file-icon">🔬</div>
              <h4>Imaging Reports</h4>
              <p>X-ray, MRI, CT scan, and ultrasound reports and findings</p>
            </div>
          </div>
          
          <div className="file-formats">
            <h3>Supported File Formats</h3>
            <div className="formats-list">
              <span className="format-tag">PDF</span>
              <span className="format-tag">DOC</span>
              <span className="format-tag">DOCX</span>
              <span className="format-tag">JPG</span>
              <span className="format-tag">PNG</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to Understand Your Health Better?</h2>
              <p>Join thousands of users who trust MedExplain AI to decode their medical reports.</p>
              <div className="cta-buttons">
                <Link to="/signup" className="btn btn-primary btn-large">
                  Start Your Free Account
                </Link>
                <Link to="/signin" className="btn btn-outline btn-large">
                  Already have an account?
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="home-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>MedExplain AI</h4>
              <p>Making healthcare information accessible to everyone.</p>
            </div>
            
            <div className="footer-section">
              <h4>Features</h4>
              <ul>
                <li>Medical Report Analysis</li>
                <li>Multi-Language Support</li>
                <li>Health Recommendations</li>
                <li>Medical History</li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li>Help Center</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Contact Us</li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Languages</h4>
              <ul>
                <li>🇺🇸 English</li>
                <li>🇪🇸 Español</li>
                <li>🇫🇷 Français</li>
                <li>🇩🇪 Deutsch</li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2026 MedExplain AI. All rights reserved.</p>
            <p className="disclaimer">
              <strong>Disclaimer:</strong> This tool provides educational information only and 
              should not replace professional medical advice. Always consult with healthcare 
              providers for medical decisions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;