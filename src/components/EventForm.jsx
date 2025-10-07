import React from "react";

export default function EventForm({ form, editingId, handleChange, handleCreate, handleUpdate, setEditingId }) {
  return (
    <form onSubmit={editingId ? handleUpdate : handleCreate} className="bg-[#18181b] rounded-xl shadow-lg w-full" style={{
      padding: 'clamp(1rem, 4vw, 2rem)',
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: 'clamp(1rem, 3vw, 1.5rem)'
    }}>
      <input
        className="bg-gray-600 rounded-md text-white"
        style={{
          padding: 'clamp(0.75rem, 2vw, 1rem)',
          fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
          minHeight: '44px'
        }}
        name="name"
        placeholder="Event Name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        className="bg-gray-600 rounded-md text-white"
        style={{
          padding: 'clamp(0.75rem, 2vw, 1rem)',
          fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
          minHeight: '44px'
        }}
        name="date"
        type="date"
        value={form.date}
        onChange={handleChange}
        required
      />
      <textarea
        className="bg-gray-600 rounded-md text-white resize-none"
        style={{
          padding: 'clamp(0.75rem, 2vw, 1rem)',
          fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
          minHeight: 'clamp(80px, 15vw, 120px)'
        }}
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        rows={3}
      />
      <div style={{
        display: 'grid',
        gridTemplateColumns: editingId ? '1fr 1fr' : '1fr',
        gap: 'clamp(0.75rem, 2vw, 1rem)'
      }}>
        <button 
          className="bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-lg font-semibold transition" 
          style={{
            padding: 'clamp(0.75rem, 2vw, 1rem)',
            fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
            minHeight: '48px'
          }}
          type="submit"
        >
          {editingId ? "Update Event" : "Add Event"}
        </button>
        {editingId && (
          <button 
            className="bg-[#232323] border border-[#6366f1] text-white rounded-lg font-semibold transition" 
            style={{
              padding: 'clamp(0.75rem, 2vw, 1rem)',
              fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
              minHeight: '48px'
            }}
            type="button" 
            onClick={() => { setEditingId(null); }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
