import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import './App.scss';

import { AuthProvider } from './AuthContext';
import Navbar from './components/Navbar';
import Router from './Router';
import { CookieNotification } from './components/Notification';
import Footer from './components/Footer';

function App() {
	return (
		<AuthProvider>
			<BrowserRouter basename='/'>
				<CookieNotification />
				<Navbar />
				<Router />
				<Footer />
			</BrowserRouter>
		</AuthProvider>
	);
}

export default App;
