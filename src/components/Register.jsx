import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const { registerUser, pendingUserData, signOut } = useAuth();
  const [formData, setFormData] = useState({
    name: pendingUserData?.name || '',
    role: 'USER' // Default to USER
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await registerUser(formData);
    
    if (!result.success) {
      setError(result.error);
      setLoading(false);
    }
    // If successful, AuthContext will handle the state update
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#111827',
      margin: 0,
      padding: 'clamp(0.5rem, 2vw, 1rem)',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#1f2937',
        borderRadius: '0.5rem',
        padding: 'clamp(1.5rem, 4vw, 2rem)',
        width: '100%',
        maxWidth: 'clamp(320px, 90vw, 28rem)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(1rem, 3vw, 2rem)' }}>
          <h1 style={{
            fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '0.5rem',
            margin: '0 0 0.5rem 0'
          }}>
            Complete Your Registration
          </h1>
          <p style={{
            color: '#9ca3af',
            margin: '0 0 1rem 0',
            fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
            lineHeight: '1.5'
          }}>
            Welcome {pendingUserData?.name}! Please complete your registration.
          </p>
          <p style={{
            color: '#6b7280',
            fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
            margin: '0',
            lineHeight: '1.4'
          }}>
            Email: {pendingUserData?.email}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 'clamp(0.75rem, 2vw, 1rem)' }}>
            <label style={{
              display: 'block',
              color: '#d1d5db',
              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }}>
              Display Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: 'clamp(0.625rem, 2vw, 0.75rem)',
                backgroundColor: '#374151',
                border: '1px solid #4b5563',
                borderRadius: '0.375rem',
                color: 'white',
                fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                boxSizing: 'border-box',
                minHeight: '44px'
              }}
              placeholder="Enter your display name"
            />
          </div>

          <div style={{ marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
            <label style={{
              display: 'block',
              color: '#d1d5db',
              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }}>
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: 'clamp(0.625rem, 2vw, 0.75rem)',
                backgroundColor: '#374151',
                border: '1px solid #4b5563',
                borderRadius: '0.375rem',
                color: 'white',
                fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                boxSizing: 'border-box',
                minHeight: '44px'
              }}
            >
              <option value="USER">User (View events only)</option>
              <option value="ADMIN">Admin (Manage events)</option>
            </select>
          </div>

          {error && (
            <div style={{
              backgroundColor: '#dc2626',
              color: 'white',
              padding: 'clamp(0.625rem, 2vw, 0.75rem)',
              borderRadius: '0.375rem',
              marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
              lineHeight: '1.4'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: loading ? '#6b7280' : '#3b82f6',
              color: 'white',
              fontWeight: '500',
              padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(0.75rem, 2vw, 1rem)',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
              marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
              minHeight: '48px',
              transition: 'all 0.2s ease-in-out'
            }}
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>

          <button
            type="button"
            onClick={signOut}
            style={{
              width: '100%',
              backgroundColor: 'transparent',
              color: '#9ca3af',
              border: '1px solid #4b5563',
              padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(0.75rem, 2vw, 1rem)',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
              minHeight: '44px',
              transition: 'all 0.2s ease-in-out'
            }}
          >
            Cancel & Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}
