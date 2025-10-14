import React, { useEffect, useState } from "react";
import EventForm from "./EventForm";

const API_URL = "http://localhost:8080/api/events";

export default function EventManager() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ name: "", date: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  // Fetch all events
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then(setEvents);
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create event
  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const newEvent = await res.json();
    setEvents([...events, newEvent]);
    setForm({ name: "", date: "", description: "" });
  };

  // Start editing
  const startEdit = (event) => {
    setEditingId(event.id);
    setForm({ name: event.name, date: event.date, description: event.description });
  };

  // Update event
  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const updated = await res.json();
    setEvents(events.map(ev => ev.id === editingId ? updated : ev));
    setEditingId(null);
    setForm({ name: "", date: "", description: "" });
  };

  // Delete event
  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setEvents(events.filter(ev => ev.id !== id));
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #18181b 0%, #232323 50%, #6366f1 100%)',
      padding: 'clamp(1rem, 4vw, 2rem)'
    }}>
      <div style={{
        backgroundColor: '#232323',
        borderRadius: 'clamp(12px, 3vw, 16px)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        maxWidth: 'clamp(320px, 90vw, 600px)',
        width: '100%',
        padding: 'clamp(1.5rem, 5vw, 2.5rem)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'clamp(1.5rem, 4vw, 2.5rem)'
      }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 6vw, 3rem)',
          fontWeight: '800',
          marginBottom: '0',
          color: 'white',
          textAlign: 'center',
          lineHeight: '1.2'
        }}>
          Event Manager
        </h1>
        <EventForm
          form={form}
          editingId={editingId}
          handleChange={handleChange}
          handleCreate={handleCreate}
          handleUpdate={handleUpdate}
          setEditingId={setEditingId}
        />
        <ul style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(1rem, 3vw, 2rem)',
          listStyle: 'none',
          padding: '0',
          margin: '0'
        }}>
          {events.length === 0 ? (
            <li style={{
              textAlign: 'center',
              color: '#a1a1aa',
              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
              padding: 'clamp(1rem, 3vw, 2rem)'
            }}>
              No events yet. Add your first event!
            </li>
          ) : (
            events.map((event) => (
              <li 
                key={event.id} 
                style={{
                  backgroundColor: '#18181b',
                  border: '1px solid #6366f1',
                  borderRadius: 'clamp(8px, 2vw, 12px)',
                  padding: 'clamp(1rem, 3vw, 2rem)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'clamp(1rem, 3vw, 1.5rem)'
                }}
              >
                <div>
                  <div style={{
                    fontWeight: 'bold',
                    fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
                    color: 'white',
                    marginBottom: 'clamp(0.5rem, 1vw, 0.75rem)'
                  }}>
                    {event.name}
                  </div>
                  <div style={{
                    fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                    color: '#a1a1aa',
                    marginBottom: 'clamp(0.5rem, 1vw, 0.75rem)'
                  }}>
                    {event.date}
                  </div>
                  <div style={{
                    color: 'white',
                    fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
                    lineHeight: '1.5'
                  }}>
                    {event.description}
                  </div>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: window.innerWidth > 640 ? '1fr 1fr' : '1fr',
                  gap: 'clamp(0.75rem, 2vw, 1rem)'
                }}>
                  <button 
                    style={{
                      backgroundColor: '#eab308',
                      color: 'white',
                      padding: 'clamp(0.75rem, 2vw, 1rem)',
                      borderRadius: 'clamp(6px, 1.5vw, 8px)',
                      border: 'none',
                      fontWeight: '600',
                      fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      minHeight: '44px'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#ca8a04'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#eab308'}
                    onClick={() => startEdit(event)}
                  >
                    Edit
                  </button>
                  <button 
                    style={{
                      backgroundColor: '#dc2626',
                      color: 'white',
                      padding: 'clamp(0.75rem, 2vw, 1rem)',
                      borderRadius: 'clamp(6px, 1.5vw, 8px)',
                      border: 'none',
                      fontWeight: '600',
                      fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      minHeight: '44px'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
                    onClick={() => handleDelete(event.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
