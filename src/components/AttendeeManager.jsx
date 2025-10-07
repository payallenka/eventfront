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

export default function AttendeeManager({ eventId }) {
  const { isAdmin } = useAuth();
  const [attendees, setAttendees] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const API_URL = `http://localhost:8080/api/events/${eventId}/attendees`;

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
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
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (attendee) => {
    setEditingId(attendee.id);
    setForm({ name: attendee.name, email: attendee.email });
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    try {
      await apiCall(`${API_URL}/${id}`, { method: "DELETE" });
      setAttendees(attendees.filter(a => a.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h4 style={{
        fontSize: '20px',
        fontWeight: '700',
        color: 'white',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <FaUsers className="mr-2" />
        Attendee Management
      </h4>
      {error && (
        <div style={{
          backgroundColor: '#7f1d1d',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '20px',
          fontSize: '14px',
          border: '1px solid #dc2626'
        }}>
          {error}
        </div>
      )}
      
      {isAdmin && (
        <div style={{ marginBottom: '32px' }}>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Attendee Name"
            style={{
              flexGrow: 1,
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
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Attendee Email"
            style={{
              flexGrow: 1,
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
          <button 
            type="submit" 
            style={{
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
              e.target.style.boxShadow = '0 10px 15px -1px rgba(0, 0, 0, 0.1)';
            }}
          >
            {editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button 
              type="button" 
              onClick={() => { setEditingId(null); setForm({ name: "", email: "" }); }} 
              style={{
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
          </form>
        </div>
      )}
      
      <div>
        <h5 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#e5e7eb',
          marginBottom: '16px',
          paddingBottom: '8px',
          borderBottom: '1px solid rgba(75, 85, 99, 0.5)'
        }}>
          Registered Attendees
        </h5>
        <div style={{
          maxHeight: '400px',
          overflowY: 'auto',
          paddingRight: '8px',
          scrollbarWidth: 'thin',
          scrollbarColor: '#4b5563 transparent',
          display: 'grid',
          gap: '12px'
        }}>
        {attendees.length === 0 ? (
          <div style={{
            color: '#9ca3af',
            fontSize: '14px',
            fontStyle: 'italic',
            textAlign: 'center',
            padding: '24px',
            backgroundColor: 'rgba(75, 85, 99, 0.1)',
            borderRadius: '12px',
            border: '1px dashed rgba(156, 163, 175, 0.3)'
          }}>
            <FaUsers className="mr-2" />
            No attendees registered yet - Click "Add Attendee" to get started!
          </div>
        ) : (
          attendees.map(a => (
            <div key={a.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'rgba(75, 85, 99, 0.2)',
              padding: '16px',
              borderRadius: '12px',
              border: '2px solid #374151',
              borderLeft: '6px solid #10b981',
              boxShadow: '0 4px 8px -2px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 16px -4px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 8px -2px rgba(0, 0, 0, 0.1)';
            }}
            >
              <div>
                <p className="text-white font-semibold">{a.name}</p>
                <p className="text-gray-400 text-sm">{a.email}</p>
              </div>
              {isAdmin && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => startEdit(a)} 
                    title="Edit Attendee"
                    style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      fontWeight: '600',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#2563eb';
                      e.target.style.transform = 'scale(1.02)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#3b82f6';
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(a.id)} 
                    title="Delete Attendee"
                    style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      fontWeight: '600',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#dc2626';
                      e.target.style.transform = 'scale(1.02)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#ef4444';
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
        </div>
      </div>
    </div>
  );
}
