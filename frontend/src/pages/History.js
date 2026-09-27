import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/api/history');
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to fetch patient history');
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
          <p>Loading your medical history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Patient Medical History</h2>
      
      {history.length === 0 ? (
        <div className="card">
          <p>No medical history available yet. Upload medical reports to start building your history.</p>
        </div>
      ) : (
        <div className="card">
          <h3 className="card-title">Medical Timeline</h3>
          <div style={{ position: 'relative' }}>
            {history
              .sort((a, b) => new Date(b.date_recorded) - new Date(a.date_recorded))
              .map((entry, index) => (
                <div 
                  key={entry.id} 
                  className="report-item"
                  style={{ 
                    marginLeft: '2rem',
                    borderLeft: '3px solid #667eea',
                    paddingLeft: '1rem',
                    position: 'relative'
                  }}
                >
                  <div 
                    style={{
                      position: 'absolute',
                      left: '-8px',
                      top: '10px',
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#667eea',
                      borderRadius: '50%'
                    }}
                  />
                  
                  <div className="report-header">
                    <div className="report-date">
                      {formatDate(entry.date_recorded)}
                    </div>
                  </div>
                  
                  <div className="report-summary">
                    <h4 style={{ margin: '0.5rem 0', color: '#333' }}>
                      {entry.summary}
                    </h4>
                    
                    {entry.key_findings && entry.key_findings.length > 0 && (
                      <div>
                        <strong>Key Findings:</strong>
                        <ul style={{ marginTop: '0.5rem' }}>
                          {entry.key_findings.map((finding, findingIndex) => (
                            <li key={findingIndex}>{finding}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
          
          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <h4>Health Summary</h4>
            <p>
              <strong>Total Records:</strong> {history.length}
            </p>
            <p>
              <strong>First Record:</strong> {history.length > 0 ? formatDate(
                history.sort((a, b) => new Date(a.date_recorded) - new Date(b.date_recorded))[0].date_recorded
              ) : 'N/A'}
            </p>
            <p>
              <strong>Latest Record:</strong> {history.length > 0 ? formatDate(
                history.sort((a, b) => new Date(b.date_recorded) - new Date(a.date_recorded))[0].date_recorded
              ) : 'N/A'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;