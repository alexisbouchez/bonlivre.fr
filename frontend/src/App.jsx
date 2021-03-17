import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import './App.scss';

import { AuthProvider } from './AuthContext';
import Navigation from './components/Navbar';
import Router from './Router';
import { CookieNotification } from './components/Notification';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename='/'>
        <CookieNotification />
        <Navigation />
        <Router />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
