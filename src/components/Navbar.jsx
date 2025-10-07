import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, signOut, isAdmin: isAdminFunc } = useAuth();
  const isAdmin = isAdminFunc();

  return (
    <nav style={{
      backgroundColor: '#1f2937',
      borderBottom: '1px solid rgba(55, 65, 81, 0.6)',
      padding: '0 clamp(12px, 3vw, 24px)',
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
        minHeight: 'clamp(56px, 10vw, 72px)',
        gap: 'clamp(8px, 2vw, 16px)'
      }}>
        {/* Left side - Logo and title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 16px)', minWidth: '0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 12px)' }}>
            {/* Modern logo icon */}
            <div style={{
              width: 'clamp(32px, 8vw, 40px)',
              height: 'clamp(32px, 8vw, 40px)',
              backgroundColor: '#6366f1',
              borderRadius: 'clamp(6px, 2vw, 10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              flexShrink: '0'
            }}>
              <svg width="clamp(16px, 4vw, 24px)" height="clamp(16px, 4vw, 24px)" fill="white" viewBox="0 0 24 24">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5C3.89 3 3.01 3.9 3.01 5L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
              </svg>
            </div>
            <h1 style={{
              fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
              fontWeight: '800',
              color: 'white',
              margin: '0',
              background: 'linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              Event Manager
            </h1>
          </div>
          
          {/* Admin badge */}
          {isAdmin && (
            <span style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              padding: 'clamp(4px, 1vw, 6px) clamp(8px, 2vw, 16px)',
              borderRadius: 'clamp(12px, 3vw, 20px)',
              fontSize: 'clamp(10px, 2.5vw, 13px)',
              fontWeight: '600',
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              whiteSpace: 'nowrap',
              display: 'clamp(0, 1, 1)' // Hide on very small screens
            }}>
              Admin
            </span>
          )}
        </div>
        
        {/* Right side - User info and actions */}
        {user && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'clamp(8px, 2vw, 20px)',
            minWidth: '0',
            flexShrink: '1'
          }}>
            {/* User profile section */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(6px, 1.5vw, 12px)',
              padding: 'clamp(6px, 1.5vw, 8px) clamp(8px, 2vw, 16px)',
              backgroundColor: 'rgba(55, 65, 81, 0.5)',
              borderRadius: 'clamp(8px, 2vw, 12px)',
              border: '1px solid rgba(55, 65, 81, 0.8)',
              minWidth: '0',
              flexShrink: '1'
            }}>
              {user.picture ? (
                <img 
                  src={user.picture} 
                  alt={user.name} 
                  style={{
                    width: 'clamp(28px, 6vw, 36px)',
                    height: 'clamp(28px, 6vw, 36px)',
                    borderRadius: '50%',
                    border: '2px solid rgba(99, 102, 241, 0.5)',
                    objectFit: 'cover',
                    flexShrink: '0'
                  }}
                />
              ) : (
                <div style={{
                  width: 'clamp(28px, 6vw, 36px)',
                  height: 'clamp(28px, 6vw, 36px)',
                  borderRadius: '50%',
                  backgroundColor: '#6366f1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: 'clamp(12px, 3vw, 16px)',
                  flexShrink: '0'
                }}>
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div style={{ textAlign: 'right', minWidth: '0', overflow: 'hidden' }}>
                <div style={{
                  color: 'white',
                  fontWeight: '600',
                  fontSize: 'clamp(12px, 2.5vw, 15px)',
                  lineHeight: '1.2',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: 'clamp(80px, 20vw, 150px)'
                }}>
                  {user.name}
                </div>
                <div style={{
                  color: '#9ca3af',
                  fontSize: 'clamp(10px, 2vw, 13px)',
                  lineHeight: '1.2',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: 'clamp(80px, 20vw, 150px)'
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
                padding: 'clamp(8px, 2vw, 10px) clamp(12px, 3vw, 20px)',
                borderRadius: 'clamp(6px, 2vw, 10px)',
                border: 'none',
                fontWeight: '600',
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(4px, 1vw, 8px)',
                whiteSpace: 'nowrap',
                minHeight: 'clamp(32px, 6vw, 40px)'
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
              <svg width="clamp(12px, 3vw, 16px)" height="clamp(12px, 3vw, 16px)" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
              </svg>
              <span style={{ 
                display: window.innerWidth > 480 ? 'inline' : 'none' 
              }}>
                Sign Out
              </span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
