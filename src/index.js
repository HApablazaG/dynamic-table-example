import React from 'react';
import ReactDOM from 'react-dom';
import { configure } from 'mobx';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import App from './App';
import reportWebVitals from './reportWebVitals';

import './index.css';

// Define theme color palette for Material-UI components.
const theme = createTheme({
  palette: {
    background: {
      default: '#BDBDBD'
    }
  }
});

// Mobx Stric Mode
configure({
  enforceActions: 'always'
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
