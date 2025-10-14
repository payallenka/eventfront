import React, { useEffect, useState } from "react";
import { FaUsers } from 'react-icons/fa';
import { apiCall } from '../lib/supabase';

const UserAttendeeView = ({ eventId }) => {
  const [attendees, setAttendees] = useState([]);
  const [error, setError] = useState(null);
  const API_URL = `https://eventbackend-kb4u.onrender.com/api/events/${eventId}/attendees`;

  useEffect(() => {
    fetchAttendees();
  }, []);

  const fetchAttendees = async () => {
    try {
      const data = await apiCall(API_URL);
      setAttendees(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h4 style={{ 
        fontSize: '18px', 
        fontWeight: '700', 
        color: 'white', 
        marginBottom: '16px',
        flexShrink: 0,
        borderBottom: '2px solid #10b981',
        paddingBottom: '8px'
      }}>
        <FaUsers className="mr-2" />
        Attendees
      </h4>
      {error && (
        <div style={{
          backgroundColor: '#7f1d1d',
          color: 'white',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '16px',
          fontSize: '14px',
          flexShrink: 0
        }}>
          {error}
        </div>
      )}
      
      <div style={{
        flex: 1,
        maxHeight: '400px',
        overflowY: 'auto',
        paddingRight: '8px',
        scrollbarWidth: 'thin',
        scrollbarColor: '#10b981 rgba(55, 65, 81, 0.3)'
      }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {attendees.length === 0 ? (
            <li style={{ 
              color: '#9ca3af', 
              textAlign: 'center', 
              padding: '40px 20px',
              fontStyle: 'italic'
            }}>
              No attendees registered yet.
            </li>
          ) : (
            attendees.map(a => (
              <li key={a.id} style={{ marginBottom: '12px' }}>
                <div style={{
                  backgroundColor: 'rgba(55, 65, 81, 0.6)',
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(75, 85, 99, 0.4)',
                  transition: 'all 0.2s ease-in-out'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.8)';
                  e.currentTarget.style.borderColor = '#10b981';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.6)';
                  e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.4)';
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '15px',
                        margin: '0 0 6px 0',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {a.name}
                      </p>
                      <p style={{
                        color: '#9ca3af',
                        fontSize: '13px',
                        margin: '0',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {a.email}
                      </p>
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#10b981',
                      fontWeight: '500',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      flexShrink: 0,
                      marginLeft: '12px'
                    }}>
                      👤 Registered
                    </div>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default UserAttendeeView;
