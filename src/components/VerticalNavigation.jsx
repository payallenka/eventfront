import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaCalendarAlt, FaUsers, FaTasks } from 'react-icons/fa';

export default function VerticalNavigation({ currentPage, onPageChange }) {
  const { isAdmin, user, logout } = useAuth();

  const navItems = [
    { id: 'events', label: 'Events', icon: <FaCalendarAlt /> },
    { id: 'attendees', label: 'Attendees', icon: <FaUsers /> },
    { id: 'tasks', label: 'Tasks', icon: <FaTasks /> },
  ];

  return (
    <nav style={{
      width: '240px',
      height: '100vh',
      backgroundColor: '#1f2937',
      borderRight: '1px solid #374151',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 10
    }}>
      {/* Logo/Header */}
      <div style={{
        padding: '24px 20px',
        borderBottom: '1px solid #374151'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '12px'
        }}>
          <span style={{
            fontSize: '20px',
            fontWeight: '700',
            color: 'white'
          }}>
            Event Manager
          </span>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '16px',
            backgroundColor: '#3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <div style={{
              color: 'white',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {user?.email?.split('@')[0] || 'User'}
            </div>
            {isAdmin && (
              <div style={{
                color: '#3b82f6',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                Administrator
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div style={{
        flex: 1,
        padding: '20px 0'
      }}>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            style={{
              width: '100%',
              backgroundColor: currentPage === item.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
              color: currentPage === item.id ? '#3b82f6' : '#d1d5db',
              border: 'none',
              padding: '16px 20px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease-in-out',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textAlign: 'left',
              borderRight: currentPage === item.id ? '3px solid #3b82f6' : '3px solid transparent'
            }}
            onMouseEnter={(e) => {
              if (currentPage !== item.id) {
                e.target.style.backgroundColor = 'rgba(55, 65, 81, 0.3)';
                e.target.style.color = 'white';
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== item.id) {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#d1d5db';
              }
            }}
          >
            <span style={{ fontSize: '18px' }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Logout Button */}
      <div style={{
        padding: '20px',
        borderTop: '1px solid #374151'
      }}>
        <button
          onClick={logout}
          style={{
            width: '100%',
            backgroundColor: '#374151',
            color: '#d1d5db',
            border: 'none',
            padding: '12px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease-in-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#ef4444';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#374151';
            e.target.style.color = '#d1d5db';
          }}
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
