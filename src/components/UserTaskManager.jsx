import React, { useEffect, useState } from "react";
import { FaTasks } from 'react-icons/fa';
import { apiCall } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const UserTaskManager = ({ eventId }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const API_URL = `https://eventbackend-kb4u.onrender.com/api/events/${eventId}/tasks`;

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await apiCall(API_URL);
      // Only show tasks assigned to the current user (by email match)
      const filtered = data.filter(t => t.assignedAttendee && t.assignedAttendee.email === user.email);
      setTasks(filtered);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleCompleted = async (task) => {
    const updatedTask = { ...task, completed: !task.completed };
    try {
      const result = await apiCall(`${API_URL}/${task.id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...updatedTask,
          assignedAttendee: task.assignedAttendee ? { id: task.assignedAttendee.id } : null,
          deadline: task.deadline || null
        }),
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
                      <div style={{ display: 'flex', gap: '16px', marginTop: '4px', alignItems: 'center', fontSize: '12px', color: '#a5b4fc' }}>
                        {t.deadline && (
                          <span>Deadline: {t.deadline}</span>
                        )}
                        {t.assignedAttendee && (
                          <span>Assigned: {t.assignedAttendee.name} ({t.assignedAttendee.email})</span>
                        )}
                        <span style={{
                          fontSize: '12px',
                          color: t.completed ? '#10b981' : '#f59e0b',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          {t.completed ? 'Complete' : 'Pending'}
                        </span>
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

export default UserTaskManager;
