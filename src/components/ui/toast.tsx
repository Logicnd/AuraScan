'use client';

import { Toaster as Sonner } from 'sonner';

export function Toaster() {
  return (
    <Sonner
      theme="system"
      position="top-center"
      toastOptions={{
        classNames: {
          toast: 'rounded-xl border-2 backdrop-blur-md',
          success: 'border-ethics-safe bg-ethics-safe/10',
          error: 'border-ethics-danger bg-ethics-danger/10',
          warning: 'border-ethics-warning bg-ethics-warning/10',
          info: 'border-primary bg-primary/10',
        },
      }}
      richColors
    />
  );
}
