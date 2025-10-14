import React from "react";

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

export default EventForm;
