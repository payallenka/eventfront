import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { FaTasks, FaEdit, FaTrash } from 'react-icons/fa';

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

export default function TaskManager({ eventId }) {
  const { isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", completed: false });
  const [editingId, setEditingId] = useState(null);
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
    const method = editingId ? "PUT" : "POST";

    try {
      const result = await apiCall(url, { method, body: JSON.stringify(form) });
      if (editingId) {
        setTasks(tasks.map(t => t.id === editingId ? result : t));
      } else {
        setTasks([...tasks, result]);
      }
      setForm({ title: "", description: "", completed: false });
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setForm({ title: task.title, description: task.description, completed: task.completed });
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    try {
      await apiCall(`${API_URL}/${id}`, { method: "DELETE" });
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleCompleted = async (task) => {
    if (!isAdmin) return;
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
        Task Management
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
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Task Title"
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
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Task Description"
              rows="3"
              style={{
                padding: '12px',
                backgroundColor: '#374151',
                borderRadius: '12px',
                color: 'white',
                border: '1px solid #374151',
                outline: 'none',
                fontSize: '16px',
                transition: 'all 0.15s ease-in-out',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#10b981';
                e.target.style.boxShadow = '0 0 0 2px rgba(16, 185, 129, 0.5)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#374151';
                e.target.style.boxShadow = 'none';
              }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                type="submit" 
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  fontWeight: '600',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s ease-in-out',
                  flex: 1
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#059669';
                  e.target.style.transform = 'scale(1.01)';
                  e.target.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#10b981';
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                }}
              >
                {editingId ? "Update Task" : "Add Task"}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={() => { setEditingId(null); setForm({ title: "", description: "", completed: false }); }} 
                  style={{
                    backgroundColor: '#4b5563',
                    color: 'white',
                    fontWeight: '600',
                    padding: '12px 20px',
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
          Task List
        </h5>
        <div style={{ 
          display: 'grid', 
          gap: '12px',
          maxHeight: '400px',
          overflowY: 'auto',
          paddingRight: '8px',
          scrollbarWidth: 'thin',
          scrollbarColor: '#4b5563 transparent'
        }}>
        {tasks.length === 0 ? (
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
            <FaTasks className="mr-2" />
            No tasks created yet - Click "Add Task" to get started!
          </div>
        ) : (
          tasks.map(t => (
            <div key={t.id} style={{
              backgroundColor: 'rgba(75, 85, 99, 0.2)',
              borderRadius: '12px',
              padding: '16px',
              border: `2px solid ${t.completed ? '#10b981' : '#374151'}`,
              borderLeft: `6px solid ${t.completed ? '#10b981' : '#f59e0b'}`,
              boxShadow: '0 4px 8px -2px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease-in-out',
              position: 'relative',
              opacity: t.completed ? 0.8 : 1
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
              {/* Main Content - Single Row Layout */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                justifyContent: 'space-between'
              }}>
                {/* Left Side - Checkbox + Content */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                  {isAdmin && (
                    <input
                      type="checkbox"
                      checked={t.completed}
                      onChange={() => toggleCompleted(t)}
                      style={{
                        width: '18px',
                        height: '18px',
                        accentColor: '#10b981',
                        cursor: 'pointer',
                        flexShrink: 0
                      }}
                    />
                  )}
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <h6 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: t.completed ? '#9ca3af' : 'white',
                        textDecoration: t.completed ? 'line-through' : 'none',
                        margin: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {t.title}
                      </h6>
                      
                      {/* Compact Status Badge */}
                      <span style={{
                        backgroundColor: t.completed ? '#10b981' : '#f59e0b',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        flexShrink: 0
                      }}>
                        {t.completed ? 'Done' : 'Pending'}
                      </span>
                    </div>
                    
                    {t.description && (
                      <p style={{
                        color: t.completed ? '#6b7280' : '#d1d5db',
                        fontSize: '13px',
                        margin: 0,
                        textDecoration: t.completed ? 'line-through' : 'none',
                        opacity: t.completed ? 0.7 : 0.9,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {t.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Side - Action Buttons */}
                {isAdmin && (
                  <div style={{
                    display: 'flex',
                    gap: '6px',
                    flexShrink: 0
                  }}>
                    {/* Quick Toggle Button */}
                    <button 
                      onClick={() => toggleCompleted(t)} 
                      title={t.completed ? "Mark as Pending" : "Mark as Complete"}
                      style={{
                        backgroundColor: t.completed ? '#f59e0b' : '#10b981',
                        color: 'white',
                        fontWeight: '600',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '12px',
                        transition: 'all 0.2s ease-in-out',
                        display: 'flex',
                        alignItems: 'center',
                        minWidth: '70px',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = t.completed ? '#d97706' : '#059669';
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = t.completed ? '#f59e0b' : '#10b981';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      {t.completed ? 'Undo' : 'Done'}
                    </button>
                    
                    {/* Edit Button */}
                    <button 
                      onClick={() => startEdit(t)} 
                      title="Edit Task"
                      style={{
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        fontWeight: '600',
                        padding: '6px 8px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '12px',
                        transition: 'all 0.2s ease-in-out',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#2563eb';
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#3b82f6';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      <FaEdit />
                    </button>
                    
                    {/* Delete Button */}
                    <button 
                      onClick={() => handleDelete(t.id)} 
                      title="Delete Task"
                      style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        fontWeight: '600',
                        padding: '6px 8px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '12px',
                        transition: 'all 0.2s ease-in-out',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#dc2626';
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#ef4444';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        </div>
      </div>
    </div>
  );
}
