// components/AccessibilityProvider.tsx
'use client';

import { useEffect, ReactNode } from 'react';

interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  useEffect(() => {
    // Only run axe-core in development
    if (process.env.NODE_ENV === 'development') {
      Promise.all([
        import('@axe-core/react'),
        import('react'),
        import('react-dom')
      ]).then(([axe, React, ReactDOM]) => {
        // Initialize axe-core with basic configuration
        axe.default(React, ReactDOM, 1000);
      }).catch(() => {
        // Silently fail if axe-core isn't available
        console.log('Accessibility monitoring not available in this environment');
      });
    }
  }, []);

  return <>{children}</>;
}
