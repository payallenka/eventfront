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
        padding: 0
      }}>
        <div style={{ 
          color: 'white', 
          fontSize: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid #3b82f6',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          Loading...
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
        padding: '3rem',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(55, 65, 81, 0.6)',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Header with Icon */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#3b82f6',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
            color: 'white',
            fontSize: '32px'
          }}>
            <FaCalendarAlt />
          </div>
          
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '600',
            color: 'white',
            marginBottom: '0.5rem',
            margin: '0 0 0.5rem 0'
          }}>
            Event Manager
          </h1>
          <p style={{
            color: '#9ca3af',
            marginBottom: '2.5rem',
            margin: '0 0 2.5rem 0',
            fontSize: '1rem'
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
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            fontSize: '16px',
            transition: 'all 0.2s ease-in-out',
            boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)'
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
          <FaGoogle style={{ fontSize: '18px' }} />
          Continue with Google
        </button>
        
        {/* Footer */}
        <p style={{
          fontSize: '0.875rem',
          color: '#6b7280',
          marginTop: '2rem',
          margin: '2rem 0 0 0',
          lineHeight: '1.5'
        }}>
          By signing in, you agree to our terms of service and privacy policy
        </p>
      </div>
    </div>
  );
}
