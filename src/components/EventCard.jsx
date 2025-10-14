import React, { useState } from "react";
import AttendeeManager from "./AttendeeManager";
import TaskManager from "./TaskManager";
import UserTaskManager from "./UserTaskManager";
import UserAttendeeView from "./UserAttendeeView";

const EventCard = ({ event, onEdit, onDelete, isAdmin }) => {
  const [showDetails, setShowDetails] = useState(false);
  const formattedDate = new Date(event.date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div 
      style={{
        backgroundColor: '#1f2937',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        border: '1px solid #374151',
        transition: 'all 0.3s ease-in-out'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.5)';
        e.currentTarget.style.borderColor = '#6366f1';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
        e.currentTarget.style.borderColor = '#374151';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: '1', minWidth: '0', paddingRight: '16px' }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '800',
              color: 'white',
              lineHeight: '1.2',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              margin: '0'
            }}>
              {event.name}
            </h3>
            <p style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#818cf8',
              marginTop: '4px',
              margin: '4px 0 0 0'
            }}>
              {formattedDate}
            </p>
          </div>
          {isAdmin && (
            <div style={{ display: 'flex', gap: '12px', marginTop: '4px', flexShrink: '0' }}>
              <button 
                onClick={() => onEdit(event)}
                title="Edit Event"
                style={{
                  color: '#fbbf24',
                  padding: '8px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#f59e0b';
                  e.target.style.backgroundColor = 'rgba(55, 65, 81, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#fbbf24';
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button 
                onClick={() => onDelete(event.id)}
                title="Delete Event"
                style={{
                  color: '#ef4444',
                  padding: '8px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#dc2626';
                  e.target.style.backgroundColor = 'rgba(55, 65, 81, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#ef4444';
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          )}
        </div>
        <p style={{
          marginTop: '16px',
          color: '#d1d5db',
          fontSize: '14px',
          lineHeight: '1.6'
        }}>
          {event.description}
        </p>
        <button
          onClick={() => setShowDetails(!showDetails)}
          style={{
            marginTop: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#818cf8',
            fontWeight: '500',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = '#a5b4fc';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = '#818cf8';
          }}
        >
          {showDetails ? 'Hide Event Details' : isAdmin ? 'Show Management Tools (Admin Only)' : 'Show Event Details'}
          <svg 
            width="16" 
            height="16" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            style={{
              transition: 'transform 0.3s ease-in-out',
              transform: showDetails ? 'rotate(180deg)' : 'rotate(0deg)'
            }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
      </div>
      {showDetails && (
        <div style={{
          backgroundColor: 'rgba(55, 65, 81, 0.3)',
          padding: '24px',
          borderTop: '1px solid #374151'
        }}>
          <h4 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: 'white',
            marginBottom: '32px',
            textAlign: 'center',
            padding: '16px',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(99, 102, 241, 0.2)'
          }}>
            {isAdmin ? 'Event Management Dashboard' : 'Event Information'}
          </h4>
          
          {isAdmin ? (
            // Admin Dashboard with Clear Separation
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '48px',
              minHeight: '600px'
            }}>
              {/* Attendee Management Section */}
              <div style={{
                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                borderRadius: '16px',
                padding: '32px',
                border: '2px solid rgba(99, 102, 241, 0.3)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-1px',
                  left: '32px',
                  right: '32px',
                  height: '3px',
                  background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                  borderRadius: '3px 3px 0 0'
                }} />
                <AttendeeManager eventId={event.id} />
              </div>
              
              {/* Visual Separator */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '24px 0'
              }}>
                <div style={{
                  flex: 1,
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.5), transparent)'
                }} />
                <div style={{
                  padding: '8px 24px',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  borderRadius: '20px',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  color: '#a5b4fc',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  TASK MANAGEMENT
                </div>
                <div style={{
                  flex: 1,
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.5), transparent)'
                }} />
              </div>
              
              {/* Task Management Section */}
              <div style={{
                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                borderRadius: '16px',
                padding: '32px',
                border: '2px solid rgba(16, 185, 129, 0.3)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-1px',
                  left: '32px',
                  right: '32px',
                  height: '3px',
                  background: 'linear-gradient(90deg, #10b981, #06d6a0)',
                  borderRadius: '3px 3px 0 0'
                }} />
                <TaskManager eventId={event.id} />
              </div>
            </div>
          ) : (
            // User Dashboard
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '32px', 
              minHeight: '500px' 
            }}>
              <div style={{
                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                borderRadius: '16px',
                padding: '32px',
                border: '2px solid rgba(16, 185, 129, 0.3)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <UserTaskManager eventId={event.id} />
              </div>
              <div style={{
                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                borderRadius: '16px',
                padding: '32px',
                border: '2px solid rgba(99, 102, 241, 0.3)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <UserAttendeeView eventId={event.id} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventCard;
