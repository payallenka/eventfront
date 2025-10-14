import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

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

export default function TasksPage() {
  const { isAdmin } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", completed: false });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all'); // all, pending, completed

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      fetchTasks();
    }
  }, [selectedEventId]);

  const fetchEvents = async () => {
    try {
      const data = await apiCall("http://localhost:8080/api/events");
      setEvents(data);
      if (data.length > 0 && !selectedEventId) {
        setSelectedEventId(data[0].id);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchTasks = async () => {
    if (!selectedEventId) return;
    try {
      const data = await apiCall(`http://localhost:8080/api/events/${selectedEventId}/tasks`);
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
    if (!isAdmin || !selectedEventId) return;

    // Validation
    if (!form.title.trim()) {
      setError("Task title is required");
      return;
    }

    const url = editingId 
      ? `http://localhost:8080/api/events/${selectedEventId}/tasks/${editingId}`
      : `http://localhost:8080/api/events/${selectedEventId}/tasks`;
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
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setForm({ title: task.title, description: task.description || "", completed: task.completed });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await apiCall(`http://localhost:8080/api/events/${selectedEventId}/tasks/${id}`, { method: "DELETE" });
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleCompleted = async (task) => {
    if (!isAdmin && !task.completed) return; // Users can only mark as completed, not uncomplete
    
    const updatedTask = { ...task, completed: !task.completed };
    try {
      const result = await apiCall(`http://localhost:8080/api/events/${selectedEventId}/tasks/${task.id}`, {
        method: "PUT",
        body: JSON.stringify(updatedTask),
      });
      setTasks(tasks.map(t => t.id === task.id ? result : t));
    } catch (err) {
      setError(err.message);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ title: "", description: "", completed: false });
    setShowForm(false);
    setError(null);
  };

  const selectedEvent = events.find(e => e.id === parseInt(selectedEventId));
  
  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.filter(t => !t.completed).length;

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
            Task Tracker
          </h1>
          <p style={{
            color: '#9ca3af',
            fontSize: '16px',
            margin: '8px 0 0 0'
          }}>
            Track and manage tasks for your events
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
            <span>{showForm ? 'Cancel' : 'Add Task'}</span>
          </button>
        )}
      </div>

      {/* Event Selection & Stats */}
      <div style={{
        backgroundColor: 'rgba(31, 41, 55, 0.8)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '24px',
        border: '1px solid rgba(55, 65, 81, 0.6)'
      }}>
        <div style={{ display: 'grid', gap: '20px' }}>
          <div>
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
          </div>

          {selectedEvent && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px'
            }}>
              {/* Event Info */}
              <div style={{
                padding: '16px',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(99, 102, 241, 0.2)'
              }}>
                <h3 style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0 0 8px 0'
                }}>
                  Event: {selectedEvent.name}
                </h3>
                {selectedEvent.date && (
                  <p style={{
                    color: '#d1d5db',
                    fontSize: '14px',
                    margin: '0 0 4px 0'
                  }}>
                    Date: {new Date(selectedEvent.date).toLocaleDateString()}
                  </p>
                )}
                {selectedEvent.location && (
                  <p style={{
                    color: '#d1d5db',
                    fontSize: '14px',
                    margin: '0'
                  }}>
                    Location: {selectedEvent.location}
                  </p>
                )}
              </div>

              {/* Task Stats */}
              <div style={{
                padding: '16px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                <h3 style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0 0 8px 0'
                }}>
                  📊 Task Overview
                </h3>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div>
                    <span style={{
                      color: '#10b981',
                      fontSize: '20px',
                      fontWeight: '700'
                    }}>
                      {completedCount}
                    </span>
                    <span style={{
                      color: '#d1d5db',
                      fontSize: '14px',
                      marginLeft: '4px'
                    }}>
                      Done
                    </span>
                  </div>
                  <div>
                    <span style={{
                      color: '#f59e0b',
                      fontSize: '20px',
                      fontWeight: '700'
                    }}>
                      {pendingCount}
                    </span>
                    <span style={{
                      color: '#d1d5db',
                      fontSize: '14px',
                      marginLeft: '4px'
                    }}>
                      Pending
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
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

      {/* Add Task Form */}
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
            {editingId ? 'Edit Task' : 'Create New Task'}
          </h3>
          
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Task Title *"
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
              rows="4"
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
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                name="completed"
                type="checkbox"
                checked={form.completed}
                onChange={handleChange}
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: '#10b981',
                  cursor: 'pointer'
                }}
              />
              <label style={{
                color: 'white',
                fontSize: '16px',
                cursor: 'pointer'
              }}>
                Mark as completed
              </label>
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
                {editingId ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tasks List */}
      {selectedEventId ? (
        <div style={{
          backgroundColor: 'rgba(31, 41, 55, 0.8)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(55, 65, 81, 0.6)'
        }}>
          {/* Filter Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <h3 style={{
              color: 'white',
              fontSize: '20px',
              fontWeight: '600',
              margin: 0
            }}>
              Tasks ({filteredTasks.length})
            </h3>
            
            <div style={{
              display: 'flex',
              gap: '8px',
              backgroundColor: 'rgba(75, 85, 99, 0.3)',
              padding: '4px',
              borderRadius: '10px'
            }}>
              {['all', 'pending', 'completed'].map(filterType => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  style={{
                    backgroundColor: filter === filterType ? '#10b981' : 'transparent',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.2s ease-in-out',
                    textTransform: 'capitalize'
                  }}
                >
                  {filterType}
                </button>
              ))}
            </div>
          </div>
          
          {filteredTasks.length === 0 ? (
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
                No {filter !== 'all' ? filter : ''} tasks
              </h4>
              <p style={{
                color: '#6b7280',
                fontSize: '14px',
                margin: 0
              }}>
                {filter === 'all' && isAdmin ? 'Click "Add Task" to create the first task!' : 
                 filter === 'pending' ? 'All tasks are completed!' :
                 filter === 'completed' ? 'No tasks completed yet.' :
                 'No tasks for this event yet.'}
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gap: '12px'
            }}>
              {filteredTasks.map(task => (
                <div
                  key={task.id}
                  style={{
                    backgroundColor: 'rgba(75, 85, 99, 0.2)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: `2px solid ${task.completed ? '#10b981' : '#374151'}`,
                    borderLeft: `6px solid ${task.completed ? '#10b981' : '#f59e0b'}`,
                    boxShadow: '0 4px 8px -2px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s ease-in-out',
                    opacity: task.completed ? 0.8 : 1
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
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    justifyContent: 'space-between'
                  }}>
                    {/* Left Side - Checkbox + Content */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleCompleted(task)}
                        disabled={!isAdmin && task.completed}
                        style={{
                          width: '18px',
                          height: '18px',
                          accentColor: '#10b981',
                          cursor: 'pointer',
                          flexShrink: 0
                        }}
                      />
                      
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                          <h6 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: task.completed ? '#9ca3af' : 'white',
                            textDecoration: task.completed ? 'line-through' : 'none',
                            margin: 0,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {task.title}
                          </h6>
                          
                          <span style={{
                            backgroundColor: task.completed ? '#10b981' : '#f59e0b',
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '10px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            flexShrink: 0
                          }}>
                            {task.completed ? 'Done' : 'Pending'}
                          </span>
                        </div>
                        
                        {task.description && (
                          <p style={{
                            color: task.completed ? '#6b7280' : '#d1d5db',
                            fontSize: '13px',
                            margin: 0,
                            textDecoration: task.completed ? 'line-through' : 'none',
                            opacity: task.completed ? 0.7 : 0.9,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {task.description}
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
                        <button 
                          onClick={() => toggleCompleted(task)} 
                          title={task.completed ? "Mark as Pending" : "Mark as Complete"}
                          style={{
                            backgroundColor: task.completed ? '#f59e0b' : '#10b981',
                            color: 'white',
                            fontWeight: '600',
                            padding: '6px 10px',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '12px',
                            transition: 'all 0.2s ease-in-out',
                            minWidth: '70px'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = task.completed ? '#d97706' : '#059669';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = task.completed ? '#f59e0b' : '#10b981';
                          }}
                        >
                          {task.completed ? 'Undo' : 'Done'}
                        </button>
                        
                        <button 
                          onClick={() => startEdit(task)} 
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
                            transition: 'all 0.2s ease-in-out'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#2563eb';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#3b82f6';
                          }}
                        >
                          ✏️
                        </button>
                        
                        <button 
                          onClick={() => handleDelete(task.id)} 
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
                            transition: 'all 0.2s ease-in-out'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#dc2626';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#ef4444';
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
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
            Choose an event from the dropdown above to manage its tasks
          </p>
        </div>
      )}
    </div>
  );
}
