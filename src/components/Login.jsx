import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaCalendarAlt, FaGoogle } from 'react-icons/fa';

export default function Login() {
  const { signInWithGoogle, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 50%, #0f172a 100%)',
        margin: 0,
        padding: '1rem'
      }}>
        <div style={{ 
          color: 'white', 
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: 'clamp(16px, 4vw, 20px)',
            height: 'clamp(16px, 4vw, 20px)',
            border: '2px solid #3b82f6',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          Loading...
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1f2937 0%, #111827 50%, #0f172a 100%)',
      margin: 0,
      padding: '1rem',
      fontFamily: 'system-ui, sans-serif',
      color: 'white'
    }}>
      <div style={{
        backgroundColor: 'rgba(31, 41, 55, 0.9)',
        borderRadius: '16px',
        padding: 'clamp(1.5rem, 5vw, 3rem)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(55, 65, 81, 0.6)',
        backdropFilter: 'blur(10px)',
        margin: '0 1rem'
      }}>
        {/* Header with Icon */}
        <div style={{ marginBottom: 'clamp(1rem, 4vw, 2rem)' }}>
          <div style={{
            width: 'clamp(60px, 15vw, 80px)',
            height: 'clamp(60px, 15vw, 80px)',
            backgroundColor: '#3b82f6',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
            color: 'white',
            fontSize: 'clamp(24px, 6vw, 32px)'
          }}>
            <FaCalendarAlt />
          </div>
          
                    <h1 style={{
            fontSize: 'clamp(1.5rem, 5vw, 2rem)',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '0.5rem',
            margin: '0 0 0.5rem 0'
          }}>
            Event Manager
          </h1>
          <p style={{
            color: '#9ca3af',
            marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)',
            margin: '0 0 clamp(1.5rem, 4vw, 2.5rem) 0',
            fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
            lineHeight: '1.5'
          }}>
            Professional event management platform
          </p>
        </div>
        
        {/* Sign In Button */}
        <button
          onClick={signInWithGoogle}
          style={{
            width: '100%',
            backgroundColor: '#3b82f6',
            color: 'white',
            fontWeight: '600',
            padding: 'clamp(12px, 3vw, 16px) clamp(16px, 4vw, 24px)',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(8px, 2vw, 12px)',
            fontSize: 'clamp(14px, 3vw, 16px)',
            transition: 'all 0.2s ease-in-out',
            boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)',
            minHeight: '48px'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#2563eb';
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 6px 20px 0 rgba(59, 130, 246, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#3b82f6';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 14px 0 rgba(59, 130, 246, 0.39)';
          }}
        >
          <FaGoogle style={{ fontSize: 'clamp(16px, 3vw, 20px)' }} />
          Sign in with Google
        </button>

        {/* Footer */}
        <div style={{
          marginTop: 'clamp(1.5rem, 4vw, 2rem)',
          padding: 'clamp(1rem, 3vw, 1.5rem) 0 0 0',
          borderTop: '1px solid rgba(55, 65, 81, 0.6)'
        }}>
          <p style={{
            color: '#6b7280',
            fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
            margin: 0,
            lineHeight: '1.5'
          }}>
            Secure authentication powered by Google
          </p>
        </div>
      </div>
    </div>
  );
}
