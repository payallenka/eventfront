import React from 'react';
import EventsPage from './EventsPage';

export default function MainApp() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#111827'
    }}>
      <EventsPage />
    </div>
  );
}
