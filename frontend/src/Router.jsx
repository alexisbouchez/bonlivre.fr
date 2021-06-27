import React from 'react';
import { Route, Switch } from 'react-router-dom';

import PublicRoute from './components/auth/PublicRoute';
import PrivateRoute from './components/auth/PrivateRoute';
import Index from './views/Index';
import Search from './views/Search';
import NotFound from './views/NotFound';
import Signup from './views/auth/Signup';
import Login from './views/auth/Login';
import ForgotPassword from './views/auth/ForgotPassword';
import Reinitialize from './views/auth/Reinitialize';
import Settings from './views/Settings';
import Confirm from './views/auth/Confirm';
import Book from './views/Book';
import Board from './views/Board';
import SubmitBook from './views/SubmitBook';

export default function Router() {
	return (
		<Switch>
			<Route exact path='/' component={Index} />
			<Route exact path='/search' component={Search} />
			<PublicRoute exact path='/auth/signup' component={Signup} />
			<PublicRoute exact path='/auth/login' component={Login} />
			<Route exact path='/auth/confirm/:token' component={Confirm} />
			<PublicRoute
				exact
				path='/auth/reinitialize-password'
				component={ForgotPassword}
			/>
			<PublicRoute
				exact
				path='/auth/reinitialize-password/:token'
				component={Reinitialize}
			/>
			<PrivateRoute exact path='/settings' component={Settings} />
			<PrivateRoute exact path='/board' component={Board} />
			<PrivateRoute exact path='/submit-book' component={SubmitBook} />
			<Route exact path='/book/:id' component={Book} />

			<Route component={NotFound} />
		</Switch>
	);
}
