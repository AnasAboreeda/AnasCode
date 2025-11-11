import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#1d3557' },
    secondary: { main: '#C62939' },
    error: { main: '#e63946' },
    warning: { main: '#eab308' },
    success: { main: '#22c55e' },
    background: { default: '#f1faee', paper: '#dde2e5' },
    grey: {
      50: '#f8f9fa',
      100: '#dde2e5',
      200: '#acb5bd',
      300: '#495057',
    },
  },
  typography: {
    fontFamily: 'Montserrat',
    h1: { fontFamily: 'Montserrat', fontSize: '3.75rem' },
    h2: { fontFamily: 'Montserrat', fontSize: '3rem' },
    h3: { fontFamily: 'Montserrat', fontSize: '2.25rem' },
    h4: { fontFamily: 'Montserrat', fontSize: '1.875rem' },
    h5: { fontFamily: 'Montserrat', fontSize: '1.5rem' },
    h6: { fontFamily: 'Montserrat', fontSize: '1.25rem' },
    subtitle1: { fontFamily: 'Lato', fontSize: '1.125rem', fontWeight: 500 },
    subtitle2: { fontFamily: 'Lato', fontSize: '1rem', fontWeight: 500 },
    body1: { fontSize: '0.875rem' },
    body2: { fontSize: '0.75rem' },
  },
  shape: { borderRadius: 4 },
});

export default theme;
