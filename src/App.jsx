import React from 'react';
import Login from "./components/Login";
import Register from "./components/Register";
import MainApp from "./pages/MainApp";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

function AppContent() {
  const { user, loading, needsRegistration } = useAuth();
  
  console.log('App state:', { user, loading, needsRegistration });

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#111827',
        color: 'white'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '32px',
          backgroundColor: 'rgba(31, 41, 55, 0.8)',
          borderRadius: '16px',
          border: '1px solid rgba(55, 65, 81, 0.6)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(99, 102, 241, 0.3)',
            borderTop: '4px solid #6366f1',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <div style={{ fontSize: '18px', fontWeight: '600' }}>
            Loading Event Manager...
          </div>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (needsRegistration) {
    return <Register />;
  }

  if (!user) {
    return <Login />;
  }

  return <MainApp />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
