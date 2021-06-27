import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import AuthContext from '../AuthContext';

export default function Navbar() {
	const { token, updateToken } = useContext(AuthContext);
	const [isShown, setIsShown] = useState(false);

	const toggleIsShown = () => {
		setIsShown(!isShown);
	};

	const handleLogout = (e) => {
		e.preventDefault();

		updateToken('');
	};

	return (
		<nav className='navbar'>
			<div className='navbar-brand'>
				<Link className='navbar-item' to='/'>
					Bon
					<b>Livre</b>
				</Link>

				<p
					role='button'
					className={isShown ? 'navbar-burger is-active' : 'navbar-burger'}
					onClick={toggleIsShown}
				>
					<span aria-hidden='true' />
					<span aria-hidden='true' />
					<span aria-hidden='true' />
				</p>
			</div>

			<div
				className={isShown ? 'navbar-menu is-active' : 'navbar-menu'}
				id='navbar'
			>
				<div className='navbar-start'>
					<Link className='navbar-item' to='/'>
						Accueil
					</Link>
					<Link className='navbar-item' to='/search'>
						Explorer
					</Link>
				</div>

				<div className='navbar-end'>
					{token && (
						<>
							<Link className='navbar-item' to='/board'>
								Tableau de bord
							</Link>

							<div className='navbar-item has-dropdown is-hoverable'>
								<p className='navbar-link'>Compte</p>

								<div className='navbar-dropdown'>
									<Link className='navbar-item' to='/settings'>
										Paramètres
									</Link>
									<hr className='navbar-divider' />
									<a
										href='//#endregion'
										className='navbar-item'
										onClick={(e) => handleLogout(e)}
									>
										Déconnexion
									</a>
								</div>
							</div>
						</>
					)}

					{!token && (
						<div className='buttons mr-2 ml-2'>
							<Link to='/auth/login' className='button is-light '>
								Connexion
							</Link>

							<Link to='/auth/signup' className='button is-link'>
								<strong>Inscription</strong>
							</Link>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
}
