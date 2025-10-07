import React from "react";

export default function EventForm({ form, editingId, handleChange, handleCreate, handleUpdate, setEditingId }) {
  return (
    <form onSubmit={editingId ? handleUpdate : handleCreate} className="bg-[#18181b] rounded-xl shadow-lg p-8 w-full grid grid-cols-1 gap-6">
      <input
        className="p-2 bg-gray-600 rounded-md text-white"
        name="name"
        placeholder="Event Name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        className="p-2 bg-gray-600 rounded-md text-white"
        name="date"
        type="date"
        value={form.date}
        onChange={handleChange}
        required
      />
      <textarea
        className="p-2 bg-gray-600 rounded-md text-white resize-none"
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        rows={3}
      />
      <div className="flex gap-4">
        <button className="flex-1 bg-[#6366f1] hover:bg-[#4f46e5] text-white px-4 py-4 rounded-lg font-semibold text-lg transition" type="submit">
          {editingId ? "Update Event" : "Add Event"}
        </button>
        {editingId && (
          <button className="flex-1 bg-[#232323] border border-[#6366f1] text-white px-4 py-4 rounded-lg font-semibold text-lg transition" type="button" onClick={() => { setEditingId(null); }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
