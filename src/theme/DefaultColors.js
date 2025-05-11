import { createTheme } from "@mui/material/styles";
import typography from "./Typography";
import { shadows } from "./Shadows";

const baselightTheme = createTheme({
  direction: 'ltr',
  palette: {
    primary: {
      main: '#3f51b5',
      light: '#e8eaf6',
      dark: '#303f9f',
    },
    secondary: {
      main: '#f50057',
      light: '#fce4ec',
      dark: '#c51162',
    },
    success: {
      main: '#4caf50',
      light: '#e8f5e9',
      dark: '#388e3c',
      contrastText: '#ffffff',
    },
    info: {
      main: '#2196f3',
      light: '#e3f2fd',
      dark: '#1976d2',
      contrastText: '#ffffff',
    },
    error: {
      main: '#f44336',
      light: '#ffebee',
      dark: '#d32f2f',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ff9800',
      light: '#fff3e0',
      dark: '#f57c00',
      contrastText: '#ffffff',
    },
    purple: {
      A50: '#e8eaf6',
      A100: '#c5cae9',
      A200: '#9fa8da',
    },
    grey: {
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
    action: {
      disabledBackground: 'rgba(0,0,0,0.12)',
      hoverOpacity: 0.08,
      hover: '#f5f5f5',
    },
    divider: '#e0e0e0',
  },
  typography,
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.1)',
    '0px 4px 8px rgba(0,0,0,0.1)',
    '0px 6px 12px rgba(0,0,0,0.1)',
    '0px 8px 16px rgba(0,0,0,0.1)',
    '0px 10px 20px rgba(0,0,0,0.1)',
    '0px 12px 24px rgba(0,0,0,0.1)',
    '0px 14px 28px rgba(0,0,0,0.1)',
    '0px 16px 32px rgba(0,0,0,0.1)',
    '0px 18px 36px rgba(0,0,0,0.1)',
    '0px 20px 40px rgba(0,0,0,0.1)',
    '0px 22px 44px rgba(0,0,0,0.1)',
    '0px 24px 48px rgba(0,0,0,0.1)',
    '0px 26px 52px rgba(0,0,0,0.1)',
    '0px 28px 56px rgba(0,0,0,0.1)',
    '0px 30px 60px rgba(0,0,0,0.1)',
    '0px 32px 64px rgba(0,0,0,0.1)',
    '0px 34px 68px rgba(0,0,0,0.1)',
    '0px 36px 72px rgba(0,0,0,0.1)',
    '0px 38px 76px rgba(0,0,0,0.1)',
    '0px 40px 80px rgba(0,0,0,0.1)',
    '0px 42px 84px rgba(0,0,0,0.1)',
    '0px 44px 88px rgba(0,0,0,0.1)',
    '0px 46px 92px rgba(0,0,0,0.1)',
    '0px 48px 96px rgba(0,0,0,0.1)',
  ],
},
  
);

export { baselightTheme };
