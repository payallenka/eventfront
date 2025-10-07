import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, signOut, isAdmin: isAdminFunc } = useAuth();
  const isAdmin = isAdminFunc();

  return (
    <nav style={{
      backgroundColor: '#1f2937',
      borderBottom: '1px solid rgba(55, 65, 81, 0.6)',
      padding: '0 24px',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: '0',
      zIndex: '50',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: '72px'
      }}>
        {/* Left side - Logo and title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Modern logo icon */}
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#6366f1',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
            }}>
              <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5C3.89 3 3.01 3.9 3.01 5L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
              </svg>
            </div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '800',
              color: 'white',
              margin: '0',
              background: 'linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Event Manager
            </h1>
          </div>
          
          {/* Admin badge */}
          {isAdmin && (
            <span style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '600',
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              Admin Access
            </span>
          )}
        </div>
        
        {/* Right side - User info and actions */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* User profile section */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 16px',
              backgroundColor: 'rgba(55, 65, 81, 0.5)',
              borderRadius: '12px',
              border: '1px solid rgba(55, 65, 81, 0.8)'
            }}>
              {user.picture ? (
                <img 
                  src={user.picture} 
                  alt={user.name} 
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '2px solid rgba(99, 102, 241, 0.5)',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#6366f1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '16px'
                }}>
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '15px',
                  lineHeight: '1.2'
                }}>
                  {user.name}
                </div>
                <div style={{
                  color: '#9ca3af',
                  fontSize: '13px',
                  lineHeight: '1.2'
                }}>
                  {user.email}
                </div>
              </div>
            </div>
            
            {/* Sign out button */}
            <button
              onClick={signOut}
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#b91c1c';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#dc2626';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(220, 38, 38, 0.3)';
              }}
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
              </svg>
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
