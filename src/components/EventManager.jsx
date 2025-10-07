import React, { useEffect, useState } from "react";
import EventForm from "./EventForm";

const API_URL = "https://eventbackend-kb4u.onrender.com/api/events";

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
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#18181b] via-[#232323] to-[#6366f1]">
      <div className="bg-[#232323] rounded-2xl shadow-2xl max-w-xl w-full p-10 flex flex-col items-center">
        <h1 className="text-5xl font-extrabold mb-10 text-white text-center">Event Manager</h1>
        <EventForm
          form={form}
          editingId={editingId}
          handleChange={handleChange}
          handleCreate={handleCreate}
          handleUpdate={handleUpdate}
          setEditingId={setEditingId}
        />
        <ul className="w-full space-y-8">
          {events.length === 0 ? (
            <li className="text-center text-[#a1a1aa]">No events yet. Add your first event!</li>
          ) : (
            events.map((event) => (
              <li key={event.id} className="bg-[#18181b] border border-[#6366f1] rounded-lg p-8 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <div className="font-bold text-2xl text-white">{event.name}</div>
                  <div className="text-base text-[#a1a1aa] mb-2">{event.date}</div>
                  <div className="text-white text-lg">{event.description}</div>
                </div>
                <div className="flex gap-4 mt-4 md:mt-0">
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold text-lg transition" onClick={() => startEdit(event)}>Edit</button>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold text-lg transition" onClick={() => handleDelete(event.id)}>Delete</button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
