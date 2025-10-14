import React, { useState } from "react";
import { apiCall } from '../lib/supabase';

const UserProfileSection = ({ user }) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: user?.name || '' });
  const [profileError, setProfileError] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState(false);

  const updateProfile = async (e) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(false);
    
    try {
      const response = await apiCall('http://localhost:8080/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileForm)
      });
      
      if (response) {
        setProfileSuccess(true);
        setIsEditingProfile(false);
        setTimeout(() => setProfileSuccess(false), 3000);
      }
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile');
    }
  };

  return (
    <div style={{
      backgroundColor: '#1f2937',
      padding: '32px',
      borderRadius: '16px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      border: '1px solid #374151'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '700',
          color: '#818cf8',
          margin: '0'
        }}>
          Welcome, {profileForm.name || 'User'}!
        </h2>
        <button
          onClick={() => setIsEditingProfile(!isEditingProfile)}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #6366f1',
            color: '#6366f1',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#6366f1';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#6366f1';
          }}
        >
          {isEditingProfile ? 'Cancel' : 'Edit Name'}
        </button>
      </div>

      {isEditingProfile ? (
        <form onSubmit={updateProfile} style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{
                color: '#9ca3af',
                fontSize: '13px',
                fontWeight: '500',
                marginBottom: '6px',
                display: 'block'
              }}>
                Display Name
              </label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ name: e.target.value })}
                placeholder="Enter your display name"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: '#374151',
                  borderRadius: '8px',
                  color: 'white',
                  border: '1px solid #374151',
                  outline: 'none',
                  fontSize: '14px',
                  transition: 'all 0.15s ease-in-out'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6366f1';
                  e.target.style.boxShadow = '0 0 0 2px rgba(99, 102, 241, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#374151';
                  e.target.style.boxShadow = 'none';
                }}
                required
              />
            </div>
            <button
              type="submit"
              style={{
                backgroundColor: '#6366f1',
                color: 'white',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#4f46e5';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#6366f1';
              }}
            >
              Save
            </button>
          </div>
          
          {profileError && (
            <div style={{
              backgroundColor: '#7f1d1d',
              color: '#fca5a5',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '13px',
              marginTop: '8px',
              border: '1px solid #dc2626'
            }}>
              {profileError}
            </div>
          )}
        </form>
      ) : null}

      {profileSuccess && (
        <div style={{
          backgroundColor: '#065f46',
          color: '#a7f3d0',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '13px',
          marginBottom: '16px',
          border: '1px solid #10b981',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span>✅</span>
          Profile updated successfully!
        </div>
      )}

      <p style={{
        color: '#9ca3af',
        marginTop: '8px',
        margin: '8px 0 0 0',
        fontSize: '14px',
        lineHeight: '1.5'
      }}>
        You can view events and track your assigned tasks. Click "Show Event Details" on any event to see tasks and mark them as complete.
      </p>
    </div>
  );
};

export default UserProfileSection;
