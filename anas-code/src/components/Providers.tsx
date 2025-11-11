'use client';

import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '@/lib/theme';
import { Analytics } from '@vercel/analytics/react';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
      <Analytics />
    </ThemeProvider>
  );
}
