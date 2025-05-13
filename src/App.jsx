import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import Router from './routes/Router';
import { baselightTheme } from './theme/DefaultColors';
import './assets/css/mobile.css';

function App() {
  return (
    <ThemeProvider theme={baselightTheme}>
      <CssBaseline />
      {/* Xóa bỏ basename="/Modernize-Vite" từ BrowserRouter */}
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;