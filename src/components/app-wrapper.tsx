'use client';

import { useEffect, useState } from 'react';

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simple loading state to prevent hydration issues
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a1a1a]"></div>
      </div>
    );
  }

  return <>{children}</>;
}
