import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useWebSocket } from "../hooks/useWebSocket";
import { 
  FaCalendarAlt, 
  FaPlus, 
  FaWifi,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaSignOutAlt
} from 'react-icons/fa';

const apiCall = async (url, options = {}) => {
  const token = localStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };
  
  try {
    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
      
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        alert('Session expired. Please log in again.');
        window.location.href = '/login';
        return;
      }
      
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    if (options.method === 'DELETE' && response.status === 200) {
      return { success: true };
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    } else {
      return { success: true };
    }
  } catch (error) {
    throw error;
  }
};

// Calendar View Component
export default function EventsPage({ onEventSelect }) {
  const { isAdmin, user, logout } = useAuth();
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", location: "", date: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [eventTasks, setEventTasks] = useState([]);
  const [eventAttendees, setEventAttendees] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showAttendeeModal, setShowAttendeeModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingAttendee, setEditingAttendee] = useState(null);
  const [taskForm, setTaskForm] = useState({ title: '', description: '' });
  const [attendeeForm, setAttendeeForm] = useState({ name: '', email: '' });
  const API_URL = "https://eventbackend-kb4u.onrender.com/api/events";

  const handleWebSocketMessage = (message) => {
    try {
      switch (message.type) {
        case 'TASK_UPDATE':
          handleRealTimeTaskUpdate(message.eventId, message.data);
          break;
        case 'TASK_CREATE':
          handleRealTimeTaskCreation(message.eventId, message.data);
          break;
        case 'TASK_DELETE':
          handleRealTimeTaskDeletion(message.eventId, message.taskId);
          break;
        case 'EVENT_UPDATE':
          handleRealTimeEventUpdate(message.data);
          break;
        case 'EVENT_CREATE':
          handleRealTimeEventCreation(message.data);
          break;
        case 'EVENT_DELETE':
          handleRealTimeEventDeletion(message.eventId);
          break;
        case 'ATTENDEE_UPDATE':
          handleRealTimeAttendeeUpdate(message.eventId, message.data);
          break;
        case 'ATTENDEE_CREATE':
          handleRealTimeAttendeeCreation(message.eventId, message.data);
          break;
        case 'ATTENDEE_DELETE':
          handleRealTimeAttendeeDeletion(message.eventId, message.attendeeId);
          break;
        case 'PING':
          break;
        case 'SYSTEM_STATUS':
          if (message.status === 'TEST') {
            showNotification(`WebSocket Test: ${message.message}`);
          }
          break;
        default:
          console.warn('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  };

  const {
    connectionStatus,
    lastMessage,
    error: wsError,
    sendMessage,
    isConnected
  } = useWebSocket('wss://eventbackend-kb4u.onrender.com/ws/events', {
    onMessage: handleWebSocketMessage,
    onError: (error) => {
      console.error('WebSocket error:', error);
    },
    shouldReconnect: true,
    maxReconnectAttempts: 5,
    reconnectInterval: 3000
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await apiCall(API_URL);
      setEvents(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateEntityState = (entityState, setEntityState, updatedEntity, isEventEntity = false) => {
    setEntityState(prevEntities => {
      const entityList = isEventEntity ? prevEntities : prevEntities;
      const hasEntity = entityList.some(entity => 
        entity.id.toString() === updatedEntity.id.toString()
      );
      
      if (!hasEntity && entityList.length > 0 && !isEventEntity) {
        return prevEntities;
      }
      
      const existingIndex = entityList.findIndex(entity => 
        entity.id.toString() === updatedEntity.id.toString()
      );
      
      if (existingIndex >= 0) {
        return entityList.map(entity => 
          entity.id.toString() === updatedEntity.id.toString() 
            ? { ...updatedEntity, justUpdated: true } 
            : entity
        );
      } else {
        return [...entityList, { ...updatedEntity, justUpdated: true }];
      }
    });
    
    setTimeout(() => {
      setEntityState(prevEntities => 
        prevEntities.map(entity => 
          entity.id.toString() === updatedEntity.id.toString() 
            ? { ...entity, justUpdated: false } 
            : entity
        )
      );
    }, 600);
  };

  const handleRealTimeTaskUpdate = (eventId, updatedTask) => {
    updateEntityState(eventTasks, setEventTasks, updatedTask);
    if (updatedTask.completed) {
      showNotification(`Task "${updatedTask.title}" completed!`);
    }
  };

  const handleRealTimeTaskCreation = (eventId, newTask) => {
    if (eventTasks.length > 0 || (selectedEvent && selectedEvent.id.toString() === eventId.toString())) {
      updateEntityState(eventTasks, setEventTasks, newTask);
      showNotification(`New task "${newTask.title}" added successfully.`);
    }
  };

  const handleRealTimeTaskDeletion = (eventId, taskId) => {
    setEventTasks(prevTasks => {
      const taskExists = prevTasks.some(task => task.id.toString() === taskId.toString());
      if (taskExists) {
        showNotification('Task deleted successfully.');
        return prevTasks.filter(task => task.id.toString() !== taskId.toString());
      }
      return prevTasks;
    });
  };

  const handleRealTimeEventUpdate = (updatedEvent) => {
    updateEntityState(events, setEvents, updatedEvent, true);
    if (selectedEvent && selectedEvent.id.toString() === updatedEvent.id.toString()) {
      setSelectedEvent({ ...updatedEvent, justUpdated: true });
      setTimeout(() => {
        setSelectedEvent(prev => ({ ...prev, justUpdated: false }));
      }, 600);
    }
    showNotification(`Event "${updatedEvent.name}" updated successfully.`);
  };

  const handleRealTimeEventCreation = (newEvent) => {
    updateEntityState(events, setEvents, newEvent, true);
    showNotification(`New event "${newEvent.name}" created successfully.`);
  };

  const handleRealTimeEventDeletion = (eventId) => {
    setEvents(prevEvents => {
      const eventExists = prevEvents.some(event => event.id.toString() === eventId.toString());
      if (eventExists) {
        return prevEvents.filter(event => event.id.toString() !== eventId.toString());
      }
      return prevEvents;
    });
    
    if (selectedEvent && selectedEvent.id.toString() === eventId.toString()) {
      setSelectedEvent(null);
      setShowEventDetails(false);
      setEventTasks([]);
      setEventAttendees([]);
    }
    
    showNotification('Event deleted successfully.');
  };

  const handleRealTimeAttendeeUpdate = (eventId, updatedAttendee) => {
    updateEntityState(eventAttendees, setEventAttendees, updatedAttendee);
    showNotification(`Attendee "${updatedAttendee.name}" updated successfully.`);
  };

  const handleRealTimeAttendeeCreation = (eventId, newAttendee) => {
    if (eventAttendees.length > 0 || (selectedEvent && selectedEvent.id.toString() === eventId.toString())) {
      updateEntityState(eventAttendees, setEventAttendees, newAttendee);
      showNotification(`New attendee "${newAttendee.name}" added successfully.`);
    }
  };

  const handleRealTimeAttendeeDeletion = (eventId, attendeeId) => {
    setEventAttendees(prevAttendees => {
      const attendeeExists = prevAttendees.some(attendee => attendee.id.toString() === attendeeId.toString());
      if (attendeeExists) {
        showNotification('Attendee removed successfully.');
        return prevAttendees.filter(attendee => attendee.id.toString() !== attendeeId.toString());
      }
      return prevAttendees;
    });
  };

  const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      z-index: 9999;
      font-weight: 500;
      font-size: 14px;
      animation: slideIn 0.3s ease-out;
      max-width: 300px;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideIn 0.3s ease-out reverse';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
        if (style.parentNode) {
          style.parentNode.removeChild(style);
        }
      }, 300);
    }, 3000);
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
        setEvents(events.map(e => e.id === editingId ? result : e));
        if (selectedEvent && selectedEvent.id === editingId) {
          setSelectedEvent(result);
        }
      } else {
        setEvents([...events, result]);
      }
      setForm({ name: "", description: "", location: "", date: "" });
      setEditingId(null);
      setShowEventModal(false);
      
      if (editingId && selectedEvent && selectedEvent.id === editingId) {
        setShowEventDetails(false);
        setTimeout(() => {
          openEventDetails(result);
        }, 100);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!isAdmin) return;
    
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await apiCall(`${API_URL}/${id}`, { method: "DELETE" });
        setEvents(events.filter(e => e.id !== id));
        
        if (selectedEvent && selectedEvent.id === id) {
          setSelectedEvent(null);
          setShowEventDetails(false);
        }
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const startEdit = (event, e) => {
    e.stopPropagation();
    setEditingId(event.id);
    setForm({
      name: event.name,
      description: event.description,
      location: event.location || "",
      date: event.date
    });
    setShowEventModal(true);
  };

  // Calendar utility functions
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return isSameDay(eventDate, date);
    });
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const navigateToToday = () => {
    setCurrentDate(new Date());
  };

  const openNewEventModal = (date = null) => {
    if (!isAdmin) return;
    
    setEditingId(null);
    setForm({
      name: "",
      description: "",
      location: "",
      date: date ? date.toISOString().split('T')[0] : ""
    });
    setShowEventModal(true);
  };

  const openEventDetails = async (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
    
    setEventTasks([]);
    setEventAttendees([]);
    
    Promise.all([
      apiCall(`https://eventbackend-kb4u.onrender.com/api/events/${event.id}/tasks`).then(data => {
        setEventTasks(data);
      }).catch(err => {
        console.error('Error fetching tasks:', err);
        setEventTasks([]);
      }),
      
      apiCall(`https://eventbackend-kb4u.onrender.com/api/events/${event.id}/attendees`).then(data => {
        setEventAttendees(data);
      }).catch(err => {
        console.error('Error fetching attendees:', err);
        setEventAttendees([]);
      })
    ]);
  };

  const calculateProgress = () => {
    if (eventTasks.length === 0) return 0;
    const completedTasks = eventTasks.filter(task => task.completed).length;
    return Math.round((completedTasks / eventTasks.length) * 100);
  };

  const toggleTaskCompletion = async (taskId, currentStatus) => {
    if (!selectedEvent) return;
    
    try {
      const currentTask = eventTasks.find(task => task.id === taskId);
      if (!currentTask) {
        setError('Task not found');
        return;
      }
      
      const taskUpdate = {
        title: currentTask.title,
        description: currentTask.description,
        completed: !currentStatus
      };
      
      await apiCall(`https://eventbackend-kb4u.onrender.com/api/events/${selectedEvent.id}/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(taskUpdate)
      });
      
      setEventTasks(eventTasks.map(task => 
        task.id === taskId ? { ...task, completed: !currentStatus } : task
      ));
    } catch (err) {
      setError('Failed to update task: ' + err.message);
    }
  };

  const addNewTask = () => {
    if (!isAdmin || !selectedEvent) return;
    
    setEditingTask(null);
    setTaskForm({ title: '', description: '' });
    setShowTaskModal(true);
  };

  const addNewAttendee = () => {
    if (!isAdmin || !selectedEvent) return;
    
    setEditingAttendee(null);
    setAttendeeForm({ name: '', email: '' });
    setShowAttendeeModal(true);
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin || !selectedEvent) return;
    
    try {
      if (editingTask) {
        // Update existing task
        const updatedTask = await apiCall(`https://eventbackend-kb4u.onrender.com/api/events/${selectedEvent.id}/tasks/${editingTask.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            title: taskForm.title,
            description: taskForm.description,
            completed: editingTask.completed
          })
        });
        
        setEventTasks(eventTasks.map(task => 
          task.id === editingTask.id ? updatedTask : task
        ));
      } else {
        // Create new task
        const newTask = await apiCall(`https://eventbackend-kb4u.onrender.com/api/events/${selectedEvent.id}/tasks`, {
          method: 'POST',
          body: JSON.stringify({
            title: taskForm.title,
            description: taskForm.description,
            completed: false
          })
        });
        
        setEventTasks([...eventTasks, newTask]);
      }
      
      setShowTaskModal(false);
      setTaskForm({ title: '', description: '' });
      setEditingTask(null);
    } catch (err) {
      setError('Failed to save task: ' + err.message);
    }
  };

  const handleAttendeeSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin || !selectedEvent) return;
    
    try {
      if (editingAttendee) {
        // Update existing attendee
        const updatedAttendee = await apiCall(`https://eventbackend-kb4u.onrender.com/api/events/${selectedEvent.id}/attendees/${editingAttendee.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            name: attendeeForm.name,
            email: attendeeForm.email,
            status: editingAttendee.status
          })
        });
        
        setEventAttendees(eventAttendees.map(attendee => 
          attendee.id === editingAttendee.id ? updatedAttendee : attendee
        ));
      } else {
        // Create new attendee
        const newAttendee = await apiCall(`https://eventbackend-kb4u.onrender.com/api/events/${selectedEvent.id}/attendees`, {
          method: 'POST',
          body: JSON.stringify({
            name: attendeeForm.name,
            email: attendeeForm.email,
            status: 'pending'
          })
        });
        
        setEventAttendees([...eventAttendees, newAttendee]);
      }
      
      setShowAttendeeModal(false);
      setAttendeeForm({ name: '', email: '' });
      setEditingAttendee(null);
    } catch (err) {
      setError('Failed to save attendee: ' + err.message);
    }
  };

  const editTask = (task) => {
    if (!isAdmin) return;
    
    setEditingTask(task);
    setTaskForm({ title: task.title, description: task.description || '' });
    setShowTaskModal(true);
  };

  const editAttendee = (attendee) => {
    if (!isAdmin) return;
    
    setEditingAttendee(attendee);
    setAttendeeForm({ name: attendee.name, email: attendee.email });
    setShowAttendeeModal(true);
  };

  const deleteTask = async (taskId) => {
    if (!isAdmin || !selectedEvent) return;
    
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await apiCall(`https://eventbackend-kb4u.onrender.com/api/events/${selectedEvent.id}/tasks/${taskId}`, {
          method: 'DELETE'
        });
        
        // Update the local state immediately
        setEventTasks(eventTasks.filter(task => task.id !== taskId));
      } catch (err) {
        setError('Failed to delete task: ' + err.message);
      }
    }
  };

  const deleteAttendee = async (attendeeId) => {
    if (!isAdmin || !selectedEvent) return;
    
    if (window.confirm('Are you sure you want to remove this attendee?')) {
      try {
        await apiCall(`https://eventbackend-kb4u.onrender.com/api/events/${selectedEvent.id}/attendees/${attendeeId}`, {
          method: 'DELETE'
        });
        
        // Update the local state immediately
        setEventAttendees(eventAttendees.filter(attendee => attendee.id !== attendeeId));
      } catch (err) {
        setError('Failed to remove attendee: ' + err.message);
      }
    }
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const days = [];

    // Previous month's trailing days
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
    const prevMonthDays = prevMonth.getDate();
    
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, day);
      days.push({ date, isCurrentMonth: false });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      days.push({ date, isCurrentMonth: true });
    }

    // Next month's leading days
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day);
      days.push({ date, isCurrentMonth: false });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const today = new Date();

  return (
    <>
      {/* CSS Animations for real-time effects */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          .task-update-animation {
            animation: taskPulse 0.6s ease-in-out;
          }
          
          @keyframes taskPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); background-color: rgba(59, 130, 246, 0.3); }
            100% { transform: scale(1); }
          }

          /* Responsive grid styles */
          .dashboard-grid {
            display: grid;
            gap: 20px;
            grid-template-columns: 1fr 1fr;
          }

          .event-manager-label {
            font-size: clamp(14px, 3vw, 16px);
            font-weight: 500;
            color: #9ca3af;
            display: block;
          }

          /* Calendar responsive styles */
          .calendar-container {
            background-color: rgba(31, 41, 55, 0.4);
            border-radius: clamp(8px, 2vw, 12px);
            padding: clamp(12px, 3vw, 20px);
            border: 1px solid rgba(55, 65, 81, 0.3);
          }

          .calendar-day-headers {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: clamp(1px, 0.5vw, 2px);
            margin-bottom: clamp(8px, 2vw, 12px);
          }

          .calendar-day-header {
            text-align: center;
            padding: clamp(6px, 2vw, 12px);
            font-weight: 600;
            color: #9ca3af;
            font-size: clamp(10px, 2.5vw, 14px);
            background-color: rgba(55, 65, 81, 0.3);
            border-radius: clamp(3px, 1vw, 6px);
          }

          .calendar-days-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: clamp(1px, 0.5vw, 2px);
          }

          .calendar-day {
            min-height: clamp(80px, 15vw, 120px);
            padding: clamp(4px, 1.5vw, 8px);
            border-radius: clamp(3px, 1vw, 6px);
            cursor: pointer;
            transition: all 0.2s ease-in-out;
            display: flex;
            flex-direction: column;
          }

          .calendar-day-number {
            font-weight: 600;
            font-size: clamp(10px, 2.5vw, 14px);
            margin-bottom: clamp(3px, 1vw, 6px);
          }

          .calendar-events {
            display: flex;
            flex-direction: column;
            gap: clamp(1px, 0.3vw, 2px);
            flex: 1;
          }

          .calendar-event-item {
            font-size: clamp(8px, 2vw, 11px);
            padding: clamp(2px, 0.8vw, 3px) clamp(3px, 1.2vw, 6px);
            color: white;
            border-radius: clamp(2px, 0.5vw, 3px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: pointer;
            font-weight: 500;
          }

          .calendar-event-more {
            font-size: clamp(7px, 1.8vw, 10px);
            color: #9ca3af;
            font-style: italic;
            padding: clamp(1px, 0.5vw, 2px);
          }

          /* Navigation responsive styles */
          .calendar-navigation {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: clamp(16px, 4vw, 24px);
            background-color: rgba(55, 65, 81, 0.3);
            padding: clamp(12px, 3vw, 16px) clamp(16px, 4vw, 20px);
            border-radius: clamp(8px, 2vw, 12px);
            flex-wrap: wrap;
            gap: clamp(8px, 2vw, 12px);
          }

          .calendar-nav-button {
            background-color: rgba(55, 65, 81, 0.5);
            color: white;
            border: none;
            padding: clamp(6px, 1.5vw, 8px) clamp(12px, 3vw, 16px);
            border-radius: clamp(4px, 1vw, 6px);
            cursor: pointer;
            font-size: clamp(12px, 2.5vw, 14px);
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: clamp(4px, 1vw, 6px);
          }

          .calendar-nav-title {
            display: flex;
            align-items: center;
            gap: clamp(8px, 2vw, 12px);
            flex-wrap: wrap;
            justify-content: center;
          }

          .calendar-month-title {
            font-size: clamp(14px, 3.5vw, 18px);
            font-weight: 600;
            color: white;
            margin: 0;
          }

          .calendar-today-button {
            background-color: #3b82f6;
            color: white;
            border: none;
            padding: clamp(3px, 1vw, 4px) clamp(6px, 1.5vw, 8px);
            border-radius: clamp(3px, 1vw, 4px);
            cursor: pointer;
            font-size: clamp(10px, 2vw, 12px);
            font-weight: 500;
          }

          @media (max-width: 768px) {
            .dashboard-grid {
              grid-template-columns: 1fr;
            }
            
            .calendar-navigation {
              flex-direction: column;
              text-align: center;
            }
            
            .calendar-nav-title {
              order: -1;
              width: 100%;
              justify-content: center;
            }
          }

          @media (max-width: 480px) {
            .event-manager-label {
              display: none;
            }
            
            .calendar-day {
              min-height: clamp(60px, 12vw, 80px);
            }
            
            .calendar-day-header {
              padding: clamp(4px, 1vw, 6px);
            }
            
            .calendar-navigation {
              gap: clamp(6px, 1.5vw, 8px);
            }
          }

          @media (max-width: 320px) {
            .calendar-day {
              min-height: clamp(50px, 10vw, 60px);
            }
            
            .calendar-event-item {
              font-size: clamp(7px, 1.5vw, 8px);
              padding: 1px 2px;
            }
            
            .calendar-day-header {
              font-size: clamp(8px, 2vw, 10px);
              padding: clamp(3px, 0.8vw, 4px);
            }
          }
        `}
      </style>
      
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 50%, #0f172a 100%)',
        color: 'white'
      }}>
      {/* Header with User Info and Add Event Button */}
      <div style={{
        padding: 'clamp(16px, 4vw, 24px) clamp(16px, 4vw, 32px)',
        borderBottom: '1px solid rgba(55, 65, 81, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 'clamp(12px, 3vw, 16px)'
      }}>
        {/* Left Side - App Title and Event Manager */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'clamp(12px, 3vw, 24px)',
          minWidth: '0',
          flex: '1 1 auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 16px)', minWidth: '0' }}>
            <h1 style={{
              fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
              fontWeight: '600',
              color: 'white',
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              <FaCalendarAlt style={{ marginRight: 'clamp(6px, 1.5vw, 8px)', verticalAlign: 'middle' }} />
              Events Calendar
            </h1>
            
            {/* Real-time Connection Status */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(4px, 1vw, 8px)',
              padding: 'clamp(3px, 1vw, 4px) clamp(6px, 1.5vw, 8px)',
              borderRadius: '12px',
              backgroundColor: connectionStatus === 'connected' ? 'rgba(16, 185, 129, 0.2)' : 
                             connectionStatus === 'error' ? 'rgba(239, 68, 68, 0.2)' : 
                             'rgba(156, 163, 175, 0.2)',
              border: `1px solid ${connectionStatus === 'connected' ? '#10b981' : 
                                  connectionStatus === 'error' ? '#ef4444' : '#9ca3af'}`,
              cursor: 'pointer',
              minWidth: 'fit-content'
            }}
            onClick={() => {
              
              // Test basic connectivity
              fetch('https://eventbackend-kb4u.onrender.com/api/events')
                .then(response => {
                  return response.json();
                })
                .then(data => {
                })
                .catch(error => {
                  console.error('❌ Backend REST API test failed:', error);
                });
            }}
            title="Connection status"
            >
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: connectionStatus === 'connected' ? '#10b981' : 
                               connectionStatus === 'error' ? '#ef4444' : '#9ca3af',
                animation: connectionStatus === 'connected' ? 'pulse 2s infinite' : 'none'
              }} />
              <span style={{
                fontSize: '11px',
                color: connectionStatus === 'connected' ? '#10b981' : 
                       connectionStatus === 'error' ? '#ef4444' : '#9ca3af',
                fontWeight: '500'
              }}>
                {connectionStatus === 'connected' ? 'Live' : 
                 connectionStatus === 'connecting' ? 'Connecting...' :
                 connectionStatus === 'error' ? 'Error' : 'Offline'}
              </span>
            </div>
          </div>
          
          {/* Event Manager Label */}
          <div className="event-manager-label">
            Event Manager
          </div>
        </div>

        {/* Right Side - User Info and Actions */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'clamp(8px, 2vw, 16px)',
          flexShrink: 0
        }}>
          {/* User Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 12px)' }}>
            <div style={{
              width: 'clamp(32px, 8vw, 40px)',
              height: 'clamp(32px, 8vw, 40px)',
              borderRadius: '50%',
              backgroundColor: '#6366f1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: '600',
              fontSize: 'clamp(12px, 3vw, 16px)'
            }}>
              {user?.email ? user.email.charAt(0).toUpperCase() : 'P'}
            </div>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              minWidth: '0'
            }}>
              <span style={{
                color: 'white',
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                fontWeight: '500',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: 'clamp(80px, 20vw, 150px)'
              }}>
                {user?.email || 'payalm.lenka'}
              </span>
              <span style={{
                fontSize: 'clamp(10px, 2vw, 12px)',
                padding: 'clamp(1px, 0.5vw, 2px) clamp(6px, 1.5vw, 8px)',
                borderRadius: '12px',
                backgroundColor: isAdmin ? '#10b981' : '#f59e0b',
                color: 'white',
                fontWeight: '500',
                whiteSpace: 'nowrap'
              }}>
                {isAdmin ? 'Admin' : 'User'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'clamp(6px, 1.5vw, 12px)',
            flexWrap: 'wrap'
          }}>
            {isAdmin && (
              <button
                onClick={() => openNewEventModal()}
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  fontWeight: '600',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s ease-in-out',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#2563eb';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#3b82f6';
                }}
              >
                <FaPlus />
                Add Event
              </button>
            )}
            
            {/* Logout Button */}
            <button
              onClick={logout}
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                fontWeight: '600',
                padding: '10px 16px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s ease-in-out',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#dc2626';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#ef4444';
              }}
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          backgroundColor: '#7f1d1d',
          color: 'white',
          padding: '12px 16px',
          margin: '16px 32px',
          borderRadius: '8px',
          fontSize: '14px',
          border: '1px solid #dc2626'
        }}>
          {error}
        </div>
      )}

      <div style={{ padding: 'clamp(12px, 3vw, 32px) clamp(16px, 4vw, 32px)' }}>
        {/* Calendar Navigation */}
        <div className="calendar-navigation">
          <button
            onClick={() => navigateMonth(-1)}
            className="calendar-nav-button"
          >
            <FaChevronLeft />
            <span style={{ display: window.innerWidth > 380 ? 'inline' : 'none' }}>Previous</span>
          </button>

          <div className="calendar-nav-title">
            <h2 className="calendar-month-title">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            
            <button
              onClick={navigateToToday}
              className="calendar-today-button"
            >
              Today
            </button>
          </div>

          <button
            onClick={() => navigateMonth(1)}
            className="calendar-nav-button"
          >
            <span style={{ display: window.innerWidth > 380 ? 'inline' : 'none' }}>Next</span>
            <FaChevronRight />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="calendar-container">
          {/* Day Headers */}
          <div className="calendar-day-headers">
            {dayNames.map(day => (
              <div
                key={day}
                className="calendar-day-header"
              >
                {window.innerWidth > 480 ? day : day.substring(0, 1)}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="calendar-days-grid">
            {calendarDays.map(({ date, isCurrentMonth }, index) => {
              const dayEvents = getEventsForDate(date);
              const isToday = isSameDay(date, today);
              const hasSelectedEvent = selectedEvent && dayEvents.some(event => event.id === selectedEvent.id);

              return (
                <div
                  key={index}
                  className="calendar-day"
                  title={isAdmin ? "Click to view events • Double-click to create event" : "Click to view events"}
                  onClick={(e) => {
                    // Only process if clicking directly on the day container or date number
                    const isEventElement = e.target.closest('[data-event-item="true"]');
                    if (!isEventElement) {
                      setSelectedDate(date);
                      if (dayEvents.length === 1) {
                        openEventDetails(dayEvents[0]);
                      } else if (dayEvents.length === 0) {
                        setSelectedEvent(null);
                      }
                      // If multiple events, keep current selectedEvent and let user choose
                    }
                  }}
                  onDoubleClick={() => isAdmin && openNewEventModal(date)}
                  style={{
                    backgroundColor: isCurrentMonth 
                      ? (isToday ? 'rgba(59, 130, 246, 0.2)' : 'rgba(55, 65, 81, 0.2)')
                      : 'rgba(31, 41, 55, 0.2)',
                    border: hasSelectedEvent ? '2px solid #3b82f6' : '1px solid rgba(55, 65, 81, 0.3)',
                    opacity: isCurrentMonth ? 1 : 0.4
                  }}
                  onMouseEnter={(e) => {
                    if (isCurrentMonth) {
                      e.target.style.backgroundColor = 'rgba(55, 65, 81, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = isCurrentMonth 
                      ? (isToday ? 'rgba(59, 130, 246, 0.2)' : 'rgba(55, 65, 81, 0.2)')
                      : 'rgba(31, 41, 55, 0.2)';
                  }}
                >
                  {/* Date Number */}
                  <div className="calendar-day-number" style={{
                    color: isToday ? '#3b82f6' : (isCurrentMonth ? '#e5e7eb' : '#6b7280')
                  }}>
                    {date.getDate()}
                  </div>

                  {/* Events for this date */}
                  <div className="calendar-events">
                    {dayEvents.slice(0, window.innerWidth > 480 ? 4 : 2).map((event, i) => (
                      <div
                        key={event.id}
                        data-event-item="true"
                        className="calendar-event-item"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEventDetails(event);
                        }}
                        style={{
                          backgroundColor: i % 4 === 0 ? '#3b82f6' : 
                                         i % 4 === 1 ? '#10b981' : 
                                         i % 4 === 2 ? '#f59e0b' : '#ef4444'
                        }}
                        title={isAdmin ? 
                          `${event.name}\n${event.description || ''}\nClick to view details` : 
                          `${event.name}\n${event.description || ''}\nClick to view details (read-only)`
                        }
                      >
                        {event.name}
                      </div>
                    ))}
                    {dayEvents.length > (window.innerWidth > 480 ? 4 : 2) && (
                      <div className="calendar-event-more">
                        +{dayEvents.length - (window.innerWidth > 480 ? 4 : 2)} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

        {/* Event Creation/Edit Modal */}
        {showEventModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: '#1f2937',
              borderRadius: '12px',
              padding: '24px',
              width: '90%',
              maxWidth: '500px',
              border: '1px solid #374151',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
              <h3 style={{
                color: 'white',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '20px',
                margin: '0 0 20px 0'
              }}>
                {editingId ? 'Edit Event' : 'Create New Event'}
              </h3>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Event Name"
                  required
                  style={{
                    padding: '12px',
                    backgroundColor: '#374151',
                    borderRadius: '6px',
                    color: 'white',
                    border: '1px solid #4b5563',
                    outline: 'none',
                    fontSize: '14px'
                  }}
                />

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Event Description"
                  rows="3"
                  style={{
                    padding: '12px',
                    backgroundColor: '#374151',
                    borderRadius: '6px',
                    color: 'white',
                    border: '1px solid #4b5563',
                    outline: 'none',
                    fontSize: '14px',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />

                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Location (Optional)"
                  style={{
                    padding: '12px',
                    backgroundColor: '#374151',
                    borderRadius: '6px',
                    color: 'white',
                    border: '1px solid #4b5563',
                    outline: 'none',
                    fontSize: '14px'
                  }}
                />

                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  style={{
                    padding: '12px',
                    backgroundColor: '#374151',
                    borderRadius: '6px',
                    color: 'white',
                    border: '1px solid #4b5563',
                    outline: 'none',
                    fontSize: '14px'
                  }}
                />

                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button
                    type="submit"
                    style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      fontWeight: '600',
                      padding: '12px 20px',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      flex: 1
                    }}
                  >
                    {editingId ? 'Update Event' : 'Create Event'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setShowEventModal(false);
                      setEditingId(null);
                      setForm({ name: "", description: "", location: "", date: "" });
                    }}
                    style={{
                      backgroundColor: '#4b5563',
                      color: 'white',
                      fontWeight: '600',
                      padding: '12px 20px',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Event Details Dashboard Modal */}
        {showEventDetails && selectedEvent && (
          <div 
            onClick={(e) => {
              // Only close if clicking on the backdrop, not the modal content
              if (e.target === e.currentTarget) {
                setShowEventDetails(false);
                // selectedEvent is preserved - do NOT clear it
              }
            }}
            style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: '#1f2937',
              borderRadius: '12px',
              padding: '24px',
              width: '100%',
              maxWidth: '800px',
              maxHeight: '90vh',
              overflowY: 'auto',
              border: '1px solid #374151',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '24px'
              }}>
                <div>
                  <h2 style={{
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: '600',
                    margin: '0 0 8px 0'
                  }}>
                    {selectedEvent.name}
                  </h2>
                  <p style={{
                    color: '#9ca3af',
                    fontSize: '14px',
                    margin: '0 0 4px 0'
                  }}>
                    <FaCalendarAlt className="mr-1" />
                    {new Date(selectedEvent.date).toLocaleDateString()}
                  </p>
                  {selectedEvent.location && selectedEvent.location.trim() !== '' && (
                    <p style={{
                      color: '#9ca3af',
                      fontSize: '14px',
                      margin: '0 0 4px 0'
                    }}>
                      Location: {selectedEvent.location}
                    </p>
                  )}
                  {(!selectedEvent.location || selectedEvent.location.trim() === '') && (
                    <p style={{
                      color: '#6b7280',
                      fontSize: '14px',
                      margin: '0 0 4px 0',
                      fontStyle: 'italic'
                    }}>
                      No location specified
                    </p>
                  )}
                </div>
                
                  <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowEventDetails(false);
                  }}
                  style={{
                    backgroundColor: '#374151',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  Close
                </button>
              </div>

              {/* Description */}
              {selectedEvent.description && (
                <div style={{
                  backgroundColor: '#374151',
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '24px'
                }}>
                  <h3 style={{
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                    margin: '0 0 8px 0'
                  }}>
                    Description
                  </h3>
                  <p style={{
                    color: '#d1d5db',
                    fontSize: '14px',
                    margin: '0',
                    lineHeight: '1.5'
                  }}>
                    {selectedEvent.description}
                  </p>
                </div>
              )}

              {/* Progress Bar */}
              <div style={{
                backgroundColor: '#374151',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '24px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <h3 style={{
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                    margin: '0'
                  }}>
                    Event Progress
                  </h3>
                  {connectionStatus === 'connected' && (
                    <span style={{
                      fontSize: '11px',
                      color: '#10b981',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      padding: '2px 6px',
                      borderRadius: '10px',
                      fontWeight: '500'
                    }}>
                      <FaWifi className="mr-1" />
                      Live Updates
                    </span>
                  )}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    flex: 1,
                    backgroundColor: '#4b5563',
                    borderRadius: '8px',
                    height: '8px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${calculateProgress()}%`,
                      height: '100%',
                      backgroundColor: calculateProgress() === 100 ? '#10b981' : '#3b82f6',
                      transition: 'width 0.5s ease-in-out',
                      position: 'relative'
                    }}>
                      {/* Animated shimmer effect for real-time updates */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                        animation: connectionStatus === 'connected' ? 'shimmer 2s infinite' : 'none'
                      }} />
                    </div>
                  </div>
                  <span style={{
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    minWidth: '40px'
                  }}>
                    {calculateProgress()}%
                  </span>
                </div>
              </div>

              {/* Dashboard Grid */}
              <div className="dashboard-grid">
                {/* Tasks Section */}
                <div style={{
                  backgroundColor: '#374151',
                  padding: '16px',
                  borderRadius: '8px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px'
                  }}>
                    <h3 style={{
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '600',
                      margin: '0'
                    }}>
                      Tasks ({eventTasks.filter(t => t.completed).length}/{eventTasks.length})
                    </h3>
                    {isAdmin && (
                      <button 
                        onClick={addNewTask}
                        style={{
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}>
                        + Add
                      </button>
                    )}
                  </div>
                  
                  <div style={{
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}>
                    {eventTasks.map(task => (
                      <div 
                        key={task.id} 
                        className={task.justUpdated ? 'task-update-animation' : ''}
                        style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px',
                        padding: '12px',
                        borderBottom: '1px solid #4b5563',
                        backgroundColor: task.justUpdated ? 'rgba(59, 130, 246, 0.2)' : 'rgba(55, 65, 81, 0.3)',
                        borderRadius: '6px',
                        marginBottom: '8px',
                        transition: 'all 0.3s ease-in-out',
                        border: task.justUpdated ? '1px solid #3b82f6' : '1px solid transparent'
                      }}>
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTaskCompletion(task.id, task.completed)}
                          style={{
                            accentColor: '#3b82f6',
                            cursor: 'pointer',
                            marginTop: '2px'
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{
                            color: task.completed ? '#9ca3af' : '#d1d5db',
                            fontSize: '14px',
                            fontWeight: '500',
                            textDecoration: task.completed ? 'line-through' : 'none'
                          }}>
                            {task.title || 'Untitled Task'}
                          </div>
                          {task.description && (
                            <div style={{
                              color: task.completed ? '#6b7280' : '#9ca3af',
                              fontSize: '12px',
                              marginTop: '2px',
                              textDecoration: task.completed ? 'line-through' : 'none'
                            }}>
                              {task.description}
                            </div>
                          )}
                        </div>
                        {(() => {
                          return isAdmin;
                        })() && (
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              onClick={() => editTask(task)}
                              style={{
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '4px 6px',
                                cursor: 'pointer',
                                fontSize: '10px',
                                fontWeight: '500'
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteTask(task.id)}
                              style={{
                                backgroundColor: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '4px 6px',
                                cursor: 'pointer',
                                fontSize: '10px',
                                fontWeight: '500'
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* User Permission Info */}
                  {!isAdmin && (
                    <div style={{
                      marginTop: '12px',
                      padding: '8px',
                      backgroundColor: 'rgba(75, 85, 99, 0.3)',
                      borderRadius: '4px',
                      fontSize: '11px',
                      color: '#9ca3af',
                      textAlign: 'center'
                    }}>
                      You can mark tasks as completed by checking the boxes
                    </div>
                  )}
                </div>

                {/* Attendees Section */}
                <div style={{
                  backgroundColor: '#374151',
                  padding: '16px',
                  borderRadius: '8px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px'
                  }}>
                    <h3 style={{
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '600',
                      margin: '0'
                    }}>
                      Attendees ({eventAttendees.length})
                    </h3>
                    {isAdmin && (
                      <button 
                        onClick={addNewAttendee}
                        style={{
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}>
                        + Add
                      </button>
                    )}
                  </div>
                  
                  <div style={{
                    maxHeight: '200px',
                    overflowY: 'auto',
                    overflowX: 'hidden'
                  }}>
                    {eventAttendees.map(attendee => (
                      <div 
                        key={attendee.id} 
                        className={attendee.justUpdated ? 'attendee-update-animation' : ''}
                        style={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '12px',
                        borderBottom: '1px solid #4b5563',
                        backgroundColor: attendee.justUpdated ? 'rgba(59, 130, 246, 0.2)' : 'rgba(55, 65, 81, 0.3)',
                        borderRadius: '6px',
                        marginBottom: '8px',
                        minWidth: 0,
                        border: attendee.justUpdated ? '1px solid #3b82f6' : '1px solid transparent',
                        transition: 'all 0.3s ease-in-out'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'flex-start',
                          marginBottom: '8px'
                        }}>
                          <div style={{ flex: 1, minWidth: 0, marginRight: '8px' }}>
                            <div style={{
                              color: '#d1d5db',
                              fontSize: '14px',
                              fontWeight: '500',
                              wordBreak: 'break-word',
                              lineHeight: '1.4',
                              position: 'relative'
                            }}>
                              {attendee.name}
                            </div>
                            <div style={{
                              color: '#9ca3af',
                              fontSize: '12px',
                              wordBreak: 'break-all',
                              lineHeight: '1.3'
                            }}>
                              {attendee.email}
                            </div>
                          </div>
                          <span style={{
                            fontSize: '10px',
                            padding: '2px 6px',
                            borderRadius: '10px',
                            backgroundColor: attendee.status === 'confirmed' ? '#10b981' : '#f59e0b',
                            color: 'white',
                            fontWeight: '500',
                            whiteSpace: 'nowrap',
                            flexShrink: 0
                          }}>
                            {attendee.status}
                          </span>
                        </div>
                        {isAdmin && (
                          <div style={{ 
                            display: 'flex', 
                            gap: '4px',
                            justifyContent: 'flex-end'
                          }}>
                            <button
                              onClick={() => editAttendee(attendee)}
                              style={{
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                cursor: 'pointer',
                                fontSize: '10px',
                                fontWeight: '500'
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteAttendee(attendee.id)}
                              style={{
                                backgroundColor: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                cursor: 'pointer',
                                fontSize: '10px',
                                fontWeight: '500'
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* User Permission Info for Attendees */}
                  {!isAdmin && (
                    <div style={{
                      marginTop: '12px',
                      padding: '8px',
                      backgroundColor: 'rgba(75, 85, 99, 0.3)',
                      borderRadius: '4px',
                      fontSize: '11px',
                      color: '#9ca3af',
                      textAlign: 'center'
                    }}>
                      <FaEye className="mr-1" />
                      View-only access to attendee information
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {(() => {
                return isAdmin;
              })() && (
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  marginTop: '24px',
                  paddingTop: '20px',
                  borderTop: '1px solid #374151'
                }}>
                  <button
                    onClick={() => {
                      const eventToEdit = selectedEvent;
                      setShowEventDetails(false);
                      startEdit(eventToEdit, { stopPropagation: () => {} });
                    }}
                    style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      fontWeight: '600',
                      padding: '10px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Edit Event
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowEventDetails(false);
                      handleDelete(selectedEvent.id, { stopPropagation: () => {} });
                    }}
                    style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      fontWeight: '600',
                      padding: '10px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Delete Event
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Task Modal */}
        {showTaskModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001
          }}>
            <div style={{
              backgroundColor: '#1f2937',
              borderRadius: '12px',
              padding: '24px',
              width: '90%',
              maxWidth: '500px',
              border: '1px solid #374151',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
              <h3 style={{
                color: 'white',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '20px',
                margin: '0 0 20px 0'
              }}>
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h3>

              <form onSubmit={handleTaskSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input
                  name="title"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="Task Title"
                  required
                  style={{
                    padding: '12px',
                    backgroundColor: '#374151',
                    borderRadius: '6px',
                    color: 'white',
                    border: '1px solid #4b5563',
                    outline: 'none',
                    fontSize: '14px'
                  }}
                />

                <textarea
                  name="description"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  placeholder="Task Description (Optional)"
                  rows="3"
                  style={{
                    padding: '12px',
                    backgroundColor: '#374151',
                    borderRadius: '6px',
                    color: 'white',
                    border: '1px solid #4b5563',
                    outline: 'none',
                    fontSize: '14px',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />

                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button
                    type="submit"
                    style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      fontWeight: '600',
                      padding: '12px 20px',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      flex: 1
                    }}
                  >
                    {editingTask ? 'Update Task' : 'Add Task'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setShowTaskModal(false);
                      setTaskForm({ title: '', description: '' });
                      setEditingTask(null);
                    }}
                    style={{
                      backgroundColor: '#4b5563',
                      color: 'white',
                      fontWeight: '600',
                      padding: '12px 20px',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Attendee Modal */}
        {showAttendeeModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001
          }}>
            <div style={{
              backgroundColor: '#1f2937',
              borderRadius: '12px',
              padding: '24px',
              width: '90%',
              maxWidth: '500px',
              border: '1px solid #374151',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
              <h3 style={{
                color: 'white',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '20px',
                margin: '0 0 20px 0'
              }}>
                {editingAttendee ? 'Edit Attendee' : 'Add New Attendee'}
              </h3>

              <form onSubmit={handleAttendeeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input
                  name="name"
                  value={attendeeForm.name}
                  onChange={(e) => setAttendeeForm({ ...attendeeForm, name: e.target.value })}
                  placeholder="Attendee Name"
                  required
                  style={{
                    padding: '12px',
                    backgroundColor: '#374151',
                    borderRadius: '6px',
                    color: 'white',
                    border: '1px solid #4b5563',
                    outline: 'none',
                    fontSize: '14px'
                  }}
                />

                <input
                  type="email"
                  name="email"
                  value={attendeeForm.email}
                  onChange={(e) => setAttendeeForm({ ...attendeeForm, email: e.target.value })}
                  placeholder="Attendee Email"
                  required
                  style={{
                    padding: '12px',
                    backgroundColor: '#374151',
                    borderRadius: '6px',
                    color: 'white',
                    border: '1px solid #4b5563',
                    outline: 'none',
                    fontSize: '14px'
                  }}
                />

                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button
                    type="submit"
                    style={{
                      backgroundColor: '#10b981',
                      color: 'white',
                      fontWeight: '600',
                      padding: '12px 20px',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      flex: 1
                    }}
                  >
                    {editingAttendee ? 'Update Attendee' : 'Add Attendee'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setShowAttendeeModal(false);
                      setAttendeeForm({ name: '', email: '' });
                      setEditingAttendee(null);
                    }}
                    style={{
                      backgroundColor: '#4b5563',
                      color: 'white',
                      fontWeight: '600',
                      padding: '12px 20px',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
    </div>
    </>
  );
}

