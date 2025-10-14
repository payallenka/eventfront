import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { FaUsers } from 'react-icons/fa';

const apiCall = async (url, options = {}) => {
  const token = localStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export default function AttendeesPage() {
  const { isAdmin } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      fetchAttendees();
    }
  }, [selectedEventId]);

  const fetchEvents = async () => {
    try {
      const data = await apiCall("https://eventbackend-kb4u.onrender.com/api/events");
      setEvents(data);
      if (data.length > 0 && !selectedEventId) {
        setSelectedEventId(data[0].id);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchAttendees = async () => {
    if (!selectedEventId) return;
    try {
      const data = await apiCall(`https://eventbackend-kb4u.onrender.com/api/events/${selectedEventId}/attendees`);
      setAttendees(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin || !selectedEventId) return;

    // Validation
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address");
      return;
    }

    const url = editingId 
      ? `https://eventbackend-kb4u.onrender.com/api/events/${selectedEventId}/attendees/${editingId}`
      : `https://eventbackend-kb4u.onrender.com/api/events/${selectedEventId}/attendees`;
    const method = editingId ? "PUT" : "POST";

    try {
      const result = await apiCall(url, { method, body: JSON.stringify(form) });
      if (editingId) {
        setAttendees(attendees.map(a => a.id === editingId ? result : a));
      } else {
        setAttendees([...attendees, result]);
      }
      setForm({ name: "", email: "" });
      setEditingId(null);
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (attendee) => {
    setEditingId(attendee.id);
    setForm({ name: attendee.name, email: attendee.email });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (!window.confirm("Are you sure you want to remove this attendee?")) return;

    try {
      await apiCall(`https://eventbackend-kb4u.onrender.com/api/events/${selectedEventId}/attendees/${id}`, { method: "DELETE" });
      setAttendees(attendees.filter(a => a.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", email: "" });
    setShowForm(false);
    setError(null);
  };

  const selectedEvent = events.find(e => e.id === parseInt(selectedEventId));

  return (
    <div>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: 'white',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <FaUsers className="mr-2" />
            Attendee Management
          </h1>
          <p style={{
            color: '#9ca3af',
            fontSize: '16px',
            margin: '8px 0 0 0'
          }}>
            Manage attendees for your events
          </p>
        </div>
        
        {isAdmin && selectedEventId && (
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.2s ease-in-out',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#059669';
              e.target.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#10b981';
              e.target.style.transform = 'scale(1)';
            }}
          >
            <span>{showForm ? '✕' : '+'}</span>
            {showForm ? 'Cancel' : 'Add Attendee'}
          </button>
        )}
      </div>

      {/* Event Selection */}
      <div style={{
        backgroundColor: 'rgba(31, 41, 55, 0.8)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '24px',
        border: '1px solid rgba(55, 65, 81, 0.6)'
      }}>
        <label style={{
          color: 'white',
          fontSize: '16px',
          fontWeight: '600',
          marginBottom: '12px',
          display: 'block'
        }}>
          Select Event
        </label>
        <select
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#374151',
            borderRadius: '12px',
            color: 'white',
            border: '1px solid #374151',
            outline: 'none',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          <option value="">Select an event...</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>
              {event.name} - {event.date ? new Date(event.date).toLocaleDateString() : 'No date set'}
            </option>
          ))}
        </select>
        
        {selectedEvent && (
          <div style={{
            marginTop: '16px',
            padding: '16px',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(99, 102, 241, 0.2)'
          }}>
            <h3 style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: '600',
              margin: '0 0 8px 0'
            }}>
              {selectedEvent.name}
            </h3>
            {selectedEvent.date && (
              <p style={{
                color: '#d1d5db',
                fontSize: '14px',
                margin: '0 0 4px 0'
              }}>
                📅 {new Date(selectedEvent.date).toLocaleDateString()}
              </p>
            )}
            {selectedEvent.location && (
              <p style={{
                color: '#d1d5db',
                fontSize: '14px',
                margin: '0'
              }}>
                📍 {selectedEvent.location}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          backgroundColor: '#7f1d1d',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '12px',
          marginBottom: '24px',
          fontSize: '14px',
          border: '1px solid #dc2626'
        }}>
          {error}
        </div>
      )}

      {/* Add Attendee Form */}
      {isAdmin && showForm && selectedEventId && (
        <div style={{
          backgroundColor: 'rgba(31, 41, 55, 0.8)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          border: '2px solid rgba(16, 185, 129, 0.3)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
        }}>
          <h3 style={{
            color: 'white',
            fontSize: '20px',
            fontWeight: '600',
            marginBottom: '20px',
            margin: '0 0 20px 0'
          }}>
            {editingId ? 'Edit Attendee' : 'Add New Attendee'}
          </h3>
          
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name *"
                style={{
                  padding: '12px',
                  backgroundColor: '#374151',
                  borderRadius: '12px',
                  color: 'white',
                  border: '1px solid #374151',
                  outline: 'none',
                  fontSize: '16px',
                  transition: 'all 0.15s ease-in-out'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#10b981';
                  e.target.style.boxShadow = '0 0 0 2px rgba(16, 185, 129, 0.5)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#374151';
                  e.target.style.boxShadow = 'none';
                }}
                required
              />
              
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address *"
                style={{
                  padding: '12px',
                  backgroundColor: '#374151',
                  borderRadius: '12px',
                  color: 'white',
                  border: '1px solid #374151',
                  outline: 'none',
                  fontSize: '16px',
                  transition: 'all 0.15s ease-in-out'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#10b981';
                  e.target.style.boxShadow = '0 0 0 2px rgba(16, 185, 129, 0.5)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#374151';
                  e.target.style.boxShadow = 'none';
                }}
                required
              />
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={cancelEdit}
                style={{
                  backgroundColor: '#4b5563',
                  color: 'white',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease-in-out'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#374151';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#4b5563';
                }}
              >
                Cancel
              </button>
              
              <button
                type="submit"
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease-in-out'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#059669';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#10b981';
                }}
              >
                {editingId ? 'Update Attendee' : 'Add Attendee'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Attendees List */}
      {selectedEventId ? (
        <div style={{
          backgroundColor: 'rgba(31, 41, 55, 0.8)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(55, 65, 81, 0.6)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{
              color: 'white',
              fontSize: '20px',
              fontWeight: '600',
              margin: 0
            }}>
              Registered Attendees ({attendees.length})
            </h3>
          </div>
          
          {attendees.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '48px',
              backgroundColor: 'rgba(75, 85, 99, 0.1)',
              borderRadius: '12px',
              border: '1px dashed rgba(156, 163, 175, 0.3)'
            }}>
              <h4 style={{
                color: '#9ca3af',
                fontSize: '18px',
                fontWeight: '600',
                margin: '0 0 8px 0'
              }}>
                👥 No attendees registered yet
              </h4>
              <p style={{
                color: '#6b7280',
                fontSize: '14px',
                margin: 0
              }}>
                {isAdmin ? 'Click "Add Attendee" to register the first attendee!' : 'No attendees for this event yet.'}
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gap: '12px',
              maxHeight: '400px',
              overflowY: 'auto',
              paddingRight: '8px',
              scrollbarWidth: 'thin',
              scrollbarColor: '#4b5563 transparent'
            }}>
              {attendees.map(attendee => (
                <div
                  key={attendee.id}
                  style={{
                    backgroundColor: 'rgba(75, 85, 99, 0.3)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(107, 114, 128, 0.4)',
                    transition: 'all 0.2s ease-in-out',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(75, 85, 99, 0.4)';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(75, 85, 99, 0.3)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '16px'
                    }}>
                      {attendee.name.charAt(0).toUpperCase()}
                    </div>
                    
                    <div>
                      <h4 style={{
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: '600',
                        margin: '0 0 4px 0'
                      }}>
                        {attendee.name}
                      </h4>
                      <p style={{
                        color: '#9ca3af',
                        fontSize: '14px',
                        margin: 0
                      }}>
                        {attendee.email}
                      </p>
                    </div>
                  </div>
                  
                  {isAdmin && (
                    <div style={{
                      display: 'flex',
                      gap: '8px'
                    }}>
                      <button
                        onClick={() => startEdit(attendee)}
                        style={{
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600',
                          transition: 'all 0.2s ease-in-out'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#2563eb';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#3b82f6';
                        }}
                        title="Edit Attendee"
                      >
                        ✏️ Edit
                      </button>
                      
                      <button
                        onClick={() => handleDelete(attendee.id)}
                        style={{
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600',
                          transition: 'all 0.2s ease-in-out'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#dc2626';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#ef4444';
                        }}
                        title="Remove Attendee"
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '48px',
          backgroundColor: 'rgba(75, 85, 99, 0.1)',
          borderRadius: '16px',
          border: '1px dashed rgba(156, 163, 175, 0.3)'
        }}>
          <h3 style={{
            color: '#9ca3af',
            fontSize: '20px',
            fontWeight: '600',
            margin: '0 0 8px 0'
          }}>
            🎯 Select an Event
          </h3>
          <p style={{
            color: '#6b7280',
            fontSize: '16px',
            margin: 0
          }}>
            Choose an event from the dropdown above to manage its attendees
          </p>
        </div>
      )}
    </div>
  );
}
