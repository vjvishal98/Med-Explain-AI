import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get('/api/reports');
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading your reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>My Medical Reports</h2>
      
      {reports.length === 0 ? (
        <div className="card">
          <p>No reports uploaded yet. Visit the dashboard to upload your first medical report.</p>
        </div>
      ) : (
        <div className="dashboard-grid">
          <div className="card">
            <h3 className="card-title">Reports List</h3>
            {reports.map((report) => (
              <div 
                key={report.id} 
                className="report-item"
                onClick={() => setSelectedReport(report)}
                style={{ cursor: 'pointer' }}
              >
                <div className="report-header">
                  <div className="report-filename">{report.filename}</div>
                  <div className="report-date">{formatDate(report.upload_date)}</div>
                </div>
                <div className="report-summary">
                  Language: {report.language.toUpperCase()} | 
                  Click to view analysis
                </div>
              </div>
            ))}
          </div>

          {selectedReport && (
            <div className="card">
              <h3 className="card-title">Report Analysis</h3>
              <h4>{selectedReport.filename}</h4>
              <p><strong>Upload Date:</strong> {formatDate(selectedReport.upload_date)}</p>
              <p><strong>Language:</strong> {selectedReport.language.toUpperCase()}</p>
              
              <div style={{ marginTop: '1rem' }}>
                <h4>Analysis Results</h4>
                {selectedReport.analysis_result?.summary && (
                  <p><strong>Summary:</strong> {selectedReport.analysis_result.summary}</p>
                )}
                
                {selectedReport.analysis_result?.key_findings && (
                  <div>
                    <h5>Key Findings:</h5>
                    <ul>
                      {selectedReport.analysis_result.key_findings.map((finding, index) => (
                        <li key={index}>{finding}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedReport.analysis_result?.abnormalities && (
                  <div>
                    <h5>Abnormalities Found:</h5>
                    {selectedReport.analysis_result.abnormalities.map((abnormality, index) => (
                      <div key={index} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '5px' }}>
                        <p><strong>{abnormality.parameter}:</strong> {abnormality.value}</p>
                        <p><strong>Normal Range:</strong> {abnormality.normal_range}</p>
                        <p><strong>Status:</strong> <span style={{ color: abnormality.status === 'elevated' ? 'red' : 'orange' }}>{abnormality.status}</span></p>
                        <p><strong>Explanation:</strong> {abnormality.explanation}</p>
                      </div>
                    ))}
                  </div>
                )}

                {selectedReport.analysis_result?.medical_terms && (
                  <div>
                    <h5>Medical Terms Explained:</h5>
                    {selectedReport.analysis_result.medical_terms.map((term, index) => (
                      <div key={index} style={{ marginBottom: '1rem' }}>
                        <p><strong>{term.term}:</strong> {term.explanation}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedReport.recommendations && (
                <div style={{ marginTop: '1rem' }}>
                  <h4>Health Recommendations</h4>
                  
                  {selectedReport.recommendations.lifestyle && (
                    <div>
                      <h5>Lifestyle Recommendations:</h5>
                      <ul>
                        {selectedReport.recommendations.lifestyle.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedReport.recommendations.dietary && (
                    <div>
                      <h5>Dietary Recommendations:</h5>
                      <ul>
                        {selectedReport.recommendations.dietary.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedReport.recommendations.follow_up && (
                    <div>
                      <h5>Follow-up:</h5>
                      <ul>
                        {selectedReport.recommendations.follow_up.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedReport.recommendations.next_appointment && (
                    <p><strong>Next Appointment:</strong> {selectedReport.recommendations.next_appointment}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Reports;