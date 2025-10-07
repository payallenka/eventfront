import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaCalendarAlt, FaUsers, FaTasks, FaChartBar } from 'react-icons/fa';

export default function Navigation({ currentPage, onPageChange }) {
  const { isAdmin, user, logout } = useAuth();

  const navItems = [
    { id: 'events', label: 'Events', icon: <FaCalendarAlt /> },
    { id: 'attendees', label: 'Attendees', icon: <FaUsers /> },
    { id: 'tasks', label: 'Tasks', icon: <FaTasks /> },
    ...(isAdmin ? [{ id: 'dashboard', label: 'Dashboard', icon: <FaChartBar /> }] : [])
  ];

  return (
    <nav style={{
      backgroundColor: 'rgba(31, 41, 55, 0.9)',
      borderRadius: '16px',
      padding: '16px',
      marginBottom: '24px',
      border: '1px solid rgba(55, 65, 81, 0.6)',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Logo/Title */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{
            fontSize: '24px',
            fontWeight: '700',
            color: 'white'
          }}>
            Event Manager
          </span>
          {isAdmin && (
            <span style={{
              backgroundColor: '#6366f1',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              ADMIN
            </span>
          )}
        </div>

        {/* Navigation Items */}
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              style={{
                backgroundColor: currentPage === item.id ? '#6366f1' : 'rgba(75, 85, 99, 0.3)',
                color: 'white',
                border: 'none',
                padding: '12px 16px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s ease-in-out',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== item.id) {
                  e.target.style.backgroundColor = 'rgba(99, 102, 241, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== item.id) {
                  e.target.style.backgroundColor = 'rgba(75, 85, 99, 0.3)';
                }
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* User Info & Logout */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{
            color: '#d1d5db',
            fontSize: '14px'
          }}>
            {user?.email}
          </span>
          <button
            onClick={logout}
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
              transition: 'all 0.2s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#dc2626';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#ef4444';
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
