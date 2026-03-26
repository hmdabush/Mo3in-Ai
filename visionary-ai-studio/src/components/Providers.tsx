'use client';

import { AuthProvider } from '@/lib/AuthContext';
import { SubscriptionProvider } from '@/lib/SubscriptionContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        {children}
      </SubscriptionProvider>
    </AuthProvider>
  );
}
