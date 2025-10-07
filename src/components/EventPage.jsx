import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import AttendeeManager from "./AttendeeManager";
import TaskManager from "./TaskManager";
import { FaTasks, FaUsers, FaCalendarAlt } from 'react-icons/fa';

import { apiCall } from '../lib/supabase';

const API_URL = "https://eventbackend-kb4u.onrender.com/api/events";

// User Task Manager Component (Read-only with task completion)
const UserTaskManager = ({ eventId }) => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const API_URL = `https://eventbackend-kb4u.onrender.com/api/events/${eventId}/tasks`;

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await apiCall(API_URL);
      setTasks(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleCompleted = async (task) => {
    const updatedTask = { ...task, completed: !task.completed };
    try {
      const result = await apiCall(`${API_URL}/${task.id}`, {
        method: "PUT",
        body: JSON.stringify(updatedTask),
      });
      setTasks(tasks.map(t => t.id === task.id ? result : t));
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
        borderBottom: '2px solid #6366f1',
        paddingBottom: '8px'
      }}>
        <FaTasks className="mr-2" />
        Tasks
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
        overflowY: 'auto',
        paddingRight: '8px',
        scrollbarWidth: 'thin',
        scrollbarColor: '#6366f1 rgba(55, 65, 81, 0.3)'
      }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {tasks.length === 0 ? (
            <li style={{ 
              color: '#9ca3af', 
              textAlign: 'center', 
              padding: '40px 20px',
              fontStyle: 'italic'
            }}>
              No tasks assigned yet.
            </li>
          ) : (
            tasks.map(t => (
              <li key={t.id} style={{ marginBottom: '12px' }}>
                <div style={{
                  backgroundColor: 'rgba(55, 65, 81, 0.6)',
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(75, 85, 99, 0.4)',
                  transition: 'all 0.2s ease-in-out'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.8)';
                  e.currentTarget.style.borderColor = '#6366f1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.6)';
                  e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.4)';
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <input
                      type="checkbox"
                      checked={t.completed}
                      onChange={() => toggleCompleted(t)}
                      style={{
                        width: '20px',
                        height: '20px',
                        accentColor: '#6366f1',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        marginTop: '2px',
                        flexShrink: 0
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontWeight: '600',
                        fontSize: '15px',
                        margin: '0 0 6px 0',
                        color: t.completed ? '#9ca3af' : 'white',
                        textDecoration: t.completed ? 'line-through' : 'none'
                      }}>
                        {t.title}
                      </p>
                      <p style={{
                        color: '#9ca3af',
                        fontSize: '13px',
                        margin: '0 0 8px 0',
                        lineHeight: '1.4'
                      }}>
                        {t.description}
                      </p>
                      <div style={{
                        fontSize: '12px',
                        color: t.completed ? '#10b981' : '#f59e0b',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {t.completed ? '✅ Complete' : '⏳ Pending'}
                      </div>
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

// User Attendee View Component (Read-only)
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

// Reusable API call function
const apiCall = async (url, options = {}) => {
  const token = localStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };


  try {
    const response = await fetch(url, { ...options, headers });
    

    // If we get a 401 (Unauthorized) and we have a token, the token might be invalid
    if (response.status === 401 && token) {
      localStorage.removeItem('authToken');
      // Retry without token
      const retryHeaders = {
        'Content-Type': 'application/json',
        ...options.headers,
      };
      const retryResponse = await fetch(url, { ...options, headers: retryHeaders });
      
      if (retryResponse.ok) {
        // Handle 204 No Content responses (like DELETE operations)
        if (retryResponse.status === 204) {
          return null;
        }
        const data = await retryResponse.json();
        return data;
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    // Handle 204 No Content responses (like DELETE operations)
    if (response.status === 204) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (networkError) {
    console.error('Network error:', networkError);
    // Check if it's a network connectivity issue
    if (networkError.name === 'TypeError' && networkError.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please check if the backend is running on https://eventbackend-kb4u.onrender.com');
    }
    throw networkError;
  }
};

// Event Form Component
const EventForm = ({ form, setForm, handleSubmit, editingId, setEditingId }) => {
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ position: 'sticky', top: '32px' }}>
      <form onSubmit={handleSubmit} style={{
        backgroundColor: '#1f2937',
        padding: '32px',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(55, 65, 81, 0.8)',
        transition: 'all 0.3s ease-in-out'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '800',
          color: '#818cf8',
          borderBottom: '1px solid #374151',
          paddingBottom: '16px',
          marginBottom: '8px'
        }}>
          {editingId ? 'Edit Event' : 'Create New Event'}
        </h2>
        
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Event Name (e.g., Q4 Planning)"
            style={{
              width: '100%',
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
              e.target.style.borderColor = '#6366f1';
              e.target.style.boxShadow = '0 0 0 2px rgba(99, 102, 241, 0.5)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#374151';
              e.target.style.boxShadow = 'none';
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '20px', position: 'relative' }}>
          <div style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            pointerEvents: 'none',
            color: '#9ca3af'
          }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px 12px 12px 44px',
              backgroundColor: '#374151',
              borderRadius: '12px',
              color: 'white',
              border: '1px solid #374151',
              outline: 'none',
              fontSize: '16px',
              transition: 'all 0.15s ease-in-out',
              colorScheme: 'dark'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#6366f1';
              e.target.style.boxShadow = '0 0 0 2px rgba(99, 102, 241, 0.5)';
              e.target.previousSibling.style.color = '#6366f1';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#374151';
              e.target.style.boxShadow = 'none';
              e.target.previousSibling.style.color = '#9ca3af';
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Detailed Event Description"
            rows="4"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#374151',
              borderRadius: '12px',
              color: 'white',
              border: '1px solid #374151',
              outline: 'none',
              fontSize: '16px',
              resize: 'vertical',
              transition: 'all 0.15s ease-in-out'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#6366f1';
              e.target.style.boxShadow = '0 0 0 2px rgba(99, 102, 241, 0.5)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#374151';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '16px', paddingTop: '8px' }}>
          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: '#6366f1',
              color: 'white',
              fontWeight: '600',
              padding: '12px 16px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#4f46e5';
              e.target.style.transform = 'scale(1.01)';
              e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#6366f1';
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            }}
          >
            {editingId ? 'Update Event' : 'Add Event'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({ name: "", date: "", description: "" });
              }}
              style={{
                width: '100%',
                backgroundColor: '#4b5563',
                color: 'white',
                fontWeight: '600',
                padding: '12px 16px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
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
          )}
        </div>
      </form>
    </div>
  );
};

// Event Card Component
const EventCard = ({ event, onEdit, onDelete, isAdmin }) => {
  const [showDetails, setShowDetails] = useState(false);
  const formattedDate = new Date(event.date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div 
      style={{
        backgroundColor: '#1f2937',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        border: '1px solid #374151',
        transition: 'all 0.3s ease-in-out'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.5)';
        e.currentTarget.style.borderColor = '#6366f1';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
        e.currentTarget.style.borderColor = '#374151';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: '1', minWidth: '0', paddingRight: '16px' }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '800',
              color: 'white',
              lineHeight: '1.2',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              margin: '0'
            }}>
              {event.name}
            </h3>
            <p style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#818cf8',
              marginTop: '4px',
              margin: '4px 0 0 0'
            }}>
              {formattedDate}
            </p>
          </div>
          {isAdmin && (
            <div style={{ display: 'flex', gap: '12px', marginTop: '4px', flexShrink: '0' }}>
              <button 
                onClick={() => onEdit(event)}
                title="Edit Event"
                style={{
                  color: '#fbbf24',
                  padding: '8px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#f59e0b';
                  e.target.style.backgroundColor = 'rgba(55, 65, 81, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#fbbf24';
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button 
                onClick={() => onDelete(event.id)}
                title="Delete Event"
                style={{
                  color: '#ef4444',
                  padding: '8px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#dc2626';
                  e.target.style.backgroundColor = 'rgba(55, 65, 81, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#ef4444';
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          )}
        </div>
        <p style={{
          marginTop: '16px',
          color: '#d1d5db',
          fontSize: '14px',
          lineHeight: '1.6'
        }}>
          {event.description}
        </p>
        <button
          onClick={() => setShowDetails(!showDetails)}
          style={{
            marginTop: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#818cf8',
            fontWeight: '500',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = '#a5b4fc';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = '#818cf8';
          }}
        >
          {showDetails ? 'Hide Event Details' : isAdmin ? 'Show Management Tools (Admin Only)' : 'Show Event Details'}
          <svg 
            width="16" 
            height="16" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            style={{
              transition: 'transform 0.3s ease-in-out',
              transform: showDetails ? 'rotate(180deg)' : 'rotate(0deg)'
            }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
      </div>
      {showDetails && (
        <div style={{
          backgroundColor: 'rgba(55, 65, 81, 0.3)',
          padding: '24px',
          borderTop: '1px solid #374151'
        }}>
          <h4 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: 'white',
            marginBottom: '32px',
            textAlign: 'center',
            padding: '16px',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(99, 102, 241, 0.2)'
          }}>
            {isAdmin ? 'Event Management Dashboard' : 'Event Information'}
          </h4>
          
          {isAdmin ? (
            // Admin Dashboard with Clear Separation
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '48px',
              minHeight: '600px'
            }}>
              {/* Attendee Management Section */}
              <div style={{
                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                borderRadius: '16px',
                padding: '32px',
                border: '2px solid rgba(99, 102, 241, 0.3)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-1px',
                  left: '32px',
                  right: '32px',
                  height: '3px',
                  background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                  borderRadius: '3px 3px 0 0'
                }} />
                <AttendeeManager eventId={event.id} />
              </div>
              
              {/* Visual Separator */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '24px 0'
              }}>
                <div style={{
                  flex: 1,
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.5), transparent)'
                }} />
                <div style={{
                  padding: '8px 24px',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  borderRadius: '20px',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  color: '#a5b4fc',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  TASK MANAGEMENT
                </div>
                <div style={{
                  flex: 1,
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.5), transparent)'
                }} />
              </div>
              
              {/* Task Management Section */}
              <div style={{
                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                borderRadius: '16px',
                padding: '32px',
                border: '2px solid rgba(16, 185, 129, 0.3)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-1px',
                  left: '32px',
                  right: '32px',
                  height: '3px',
                  background: 'linear-gradient(90deg, #10b981, #06d6a0)',
                  borderRadius: '3px 3px 0 0'
                }} />
                <TaskManager eventId={event.id} />
              </div>
            </div>
          ) : (
            // User Dashboard
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '32px', 
              minHeight: '500px' 
            }}>
              <div style={{
                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                borderRadius: '16px',
                padding: '32px',
                border: '2px solid rgba(16, 185, 129, 0.3)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <UserTaskManager eventId={event.id} />
              </div>
              <div style={{
                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                borderRadius: '16px',
                padding: '32px',
                border: '2px solid rgba(99, 102, 241, 0.3)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <UserAttendeeView eventId={event.id} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function EventPage() {
  const { isAdmin: isAdminFunc, user } = useAuth();
  const isAdmin = isAdminFunc();
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ name: "", date: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // User profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: user?.name || '' });
  const [profileError, setProfileError] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    setProfileForm({ name: user?.name || '' });
  }, [user]);

  const updateProfile = async (e) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(false);
    
    try {
      const response = await apiCall('https://eventbackend-kb4u.onrender.com/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileForm)
      });
      
      if (response) {
        setProfileSuccess(true);
        setIsEditingProfile(false);
        setTimeout(() => setProfileSuccess(false), 3000);
        // For now, we'll just show success message
      }
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile');
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      // First try without authentication to see if that works
      const token = localStorage.getItem('authToken');
      
      const data = await apiCall(API_URL);
      const formattedData = data.map(event => ({
        ...event,
        date: event.date.split('T')[0]
      }));
      setEvents(formattedData);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError(err.message || "Failed to fetch events from the backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      setError("Only administrators can perform this action.");
      return;
    }
    setError(null);
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
    const method = editingId ? "PUT" : "POST";
    try {
      const result = await apiCall(url, { method, body: JSON.stringify(form) });
      const newEvent = { ...result, date: (result.date || form.date).split('T')[0] };
      if (editingId) {
        setEvents(events.map(ev => ev.id === editingId ? newEvent : ev));
      } else {
        setEvents([...events, newEvent]);
      }
      setForm({ name: "", date: "", description: "" });
      setEditingId(null);
    } catch (err) {
      setError(err.message || "Failed to save event. Check your API configuration.");
    }
  };

  const startEdit = (event) => {
    const formattedDate = event.date.split('T')[0];
    setEditingId(event.id);
    setForm({ name: event.name, date: formattedDate, description: event.description });
  };

  const handleDelete = async (id) => {
    if (!isAdmin) {
      setError("Only administrators can perform this action.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;
    setError(null);
    try {
      await apiCall(`${API_URL}/${id}`, { method: "DELETE" });
      setEvents(events.filter(ev => ev.id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete event.");
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#111827',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '24px 16px'
      }}>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '40px'
        }}>
          <div>
            {isAdmin ? (
              <EventForm
                form={form}
                setForm={setForm}
                handleSubmit={handleSubmit}
                editingId={editingId}
                setEditingId={setEditingId}
              />
            ) : (
              <div style={{
                backgroundColor: '#1f2937',
                padding: '32px',
                borderRadius: '16px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: '1px solid #374151'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <h2 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#818cf8',
                    margin: '0'
                  }}>
                    Welcome, {profileForm.name || 'User'}!
                  </h2>
                  <button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid #6366f1',
                      color: '#6366f1',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#6366f1';
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#6366f1';
                    }}
                  >
                    {isEditingProfile ? 'Cancel' : 'Edit Name'}
                  </button>
                </div>

                {isEditingProfile ? (
                  <form onSubmit={updateProfile} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{
                          color: '#9ca3af',
                          fontSize: '13px',
                          fontWeight: '500',
                          marginBottom: '6px',
                          display: 'block'
                        }}>
                          Display Name
                        </label>
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ name: e.target.value })}
                          placeholder="Enter your display name"
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            backgroundColor: '#374151',
                            borderRadius: '8px',
                            color: 'white',
                            border: '1px solid #374151',
                            outline: 'none',
                            fontSize: '14px',
                            transition: 'all 0.15s ease-in-out'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#6366f1';
                            e.target.style.boxShadow = '0 0 0 2px rgba(99, 102, 241, 0.3)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#374151';
                            e.target.style.boxShadow = 'none';
                          }}
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        style={{
                          backgroundColor: '#6366f1',
                          color: 'white',
                          border: 'none',
                          padding: '10px 16px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#4f46e5';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#6366f1';
                        }}
                      >
                        Save
                      </button>
                    </div>
                    
                    {profileError && (
                      <div style={{
                        backgroundColor: '#7f1d1d',
                        color: '#fca5a5',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        marginTop: '8px',
                        border: '1px solid #dc2626'
                      }}>
                        {profileError}
                      </div>
                    )}
                  </form>
                ) : null}

                {profileSuccess && (
                  <div style={{
                    backgroundColor: '#065f46',
                    color: '#a7f3d0',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    marginBottom: '16px',
                    border: '1px solid #10b981',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span>✅</span>
                    Profile updated successfully!
                  </div>
                )}

                <p style={{
                  color: '#9ca3af',
                  marginTop: '8px',
                  margin: '8px 0 0 0',
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>
                  You can view events and track your assigned tasks. Click "Show Event Details" on any event to see tasks and mark them as complete.
                </p>
              </div>
            )}
          </div>
          
          <div style={{ gridColumn: 'span 2' }}>
            <h2 style={{
              fontSize: '30px',
              fontWeight: '700',
              color: 'white',
              marginBottom: '24px',
              borderBottom: '1px solid #374151',
              paddingBottom: '12px'
            }}>
              Event Catalog
            </h2>
            
            {error && (
              <div style={{
                backgroundColor: '#7f1d1d',
                border: '1px solid #dc2626',
                color: 'white',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '24px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}>
                <span style={{ fontWeight: '700' }}>Error:</span> {error}
              </div>
            )}
            
            {loading ? (
              <div style={{
                color: '#9ca3af',
                fontSize: '18px',
                padding: '24px',
                backgroundColor: '#1f2937',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
              }}>
                <svg style={{ animation: 'spin 1s linear infinite' }} width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <circle style={{ opacity: '0.25' }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path style={{ opacity: '0.75' }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p style={{ margin: '0' }}>Fetching events securely...</p>
              </div>
            ) : events.length === 0 ? (
              <div style={{
                color: '#9ca3af',
                fontSize: '18px',
                padding: '32px',
                backgroundColor: '#1f2937',
                borderRadius: '12px',
                border: '2px dashed #374151',
                textAlign: 'center'
              }}>
                <p style={{
                  fontWeight: '600',
                  color: 'white',
                  margin: '0 0 8px 0'
                }}>
                  No Upcoming Events Found
                </p>
                <p style={{
                  marginTop: '8px',
                  fontSize: '14px',
                  fontStyle: 'italic',
                  margin: '8px 0 0 0'
                }}>
                  {isAdmin ? "Use the 'Create New Event' panel to start scheduling." : "Please check back later, or ask an administrator to add events."}
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onEdit={startEdit}
                    onDelete={handleDelete}
                    isAdmin={isAdmin}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
