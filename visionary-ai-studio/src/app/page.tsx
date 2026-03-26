'use client';

import { useAuth } from '@/lib/AuthContext';
import AppShell from "@/components/AppShell";
import AuthPage from "@/components/auth/AuthPage";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#020617',
        flexDirection: 'column',
        gap: '16px',
      }}>
        <div style={{
          width: 48, height: 48,
          border: '3px solid rgba(6,182,212,0.2)',
          borderTopColor: '#06B6D4',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <span style={{ color: '#94A3B8', fontSize: 14, fontWeight: 500 }}>
          جاري التحميل...
        </span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <AppShell />;
}
