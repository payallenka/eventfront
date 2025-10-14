import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import EventFormComponent from "./EventFormComponent";
import EventCard from "./EventCard";
import UserProfileSection from "./UserProfileSection";
import { apiCall } from '../utils/api';

const API_URL = "http://localhost:8080/api/events";

export default function EventPage() {
  const { isAdmin: isAdminFunc, user } = useAuth();
  const isAdmin = isAdminFunc();
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ name: "", date: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
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
              <EventFormComponent
                form={form}
                setForm={setForm}
                handleSubmit={handleSubmit}
                editingId={editingId}
                setEditingId={setEditingId}
              />
            ) : (
              <UserProfileSection user={user} />
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
