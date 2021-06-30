import React, { Component } from 'react';
import { isEmail } from 'validator';
import { FaEnvelope, FaUser, FaLock } from 'react-icons/fa';
import AuthContext from '../AuthContext';

import { profile, update, remove } from '../API';

export default class Settings extends Component {
	static contextType = AuthContext;

	state = {
		username: '',
		email: '',
		newEmail: '',
		password: '',
		errors: {},
		isUpdated: false,
		isChanged: false,
		isDeleted: false,
		confirmationUsername: '',
		isDeleteModalShown: false,
	};

	setProfile = async () => {
		const res = await profile(this.context.token);

		if (res.error) {
			this.setState({ errors: { server: 'Internal error.' } });
			this.context.updateToken('');
		} else {
			this.setState({
				username: res.username,
				email: res.email,
				newEmail: res.newEmail,
			});
		}
	};

	async componentDidMount() {
		this.setProfile();
	}

	componentWillUnmount() {
		this.setState = () => {};
	}

	handleChange = (event) => {
		const { name, value } = event.target;
		this.setState({ [name]: value, isChanged: true });
	};

	toggleDeleteModal = () => {
		const { isDeleteModalShown } = this.state;
		this.setState({
			isDeleteModalShown: !isDeleteModalShown,
		});
	};

	cancelDelete = () => {
		this.toggleDeleteModal();
		this.setState({ confirmationUsername: '' });
	};

	handleSubmit = async (e) => {
		e.preventDefault();

		if (!this.state.isChanged) {
			return;
		}

		const fields = {};
		let errors = {};
		const { email, username, password } = this.state;

		// Check email errors.
		fields.email = email;
		if (!isEmail(email)) {
			errors.email = "L'adresse électronique est invalide.";
		} else {
			errors.email = '';
		}

		// Check username errors.
		fields.username = username;
		if (username.length < 6) {
			errors.username =
				"Votre nom d'utilisateur doit contenir au moins 6 caractères.";
		} else if (username.length > 50) {
			errors.username =
				"Votre nom d'utilisateur ne doit pas contenir plus de 50 caractères.";
		} else {
			errors.username = '';
		}

		// Check password errors.
		if (password) {
			fields.password = password;
		}

		if (password && password.length < 8) {
			errors.password =
				'Votre mot de passe doit contenir au moins 8 caractères.';
		} else if (password.length > 255) {
			errors.password =
				'Votre mot de passe ne doit pas contenir plus de  256 caractères.';
		} else {
			errors.password = '';
		}

		// Check server-side errors.
		let isUpdated = false;
		if (Object.keys(errors).every((key) => !errors[key])) {
			const res = await update(this.context.token, fields);
			if (res.error) {
				if (res.error.includes('Email')) {
					errors.email = "L'adresse électronique est déjà utilisée.";
				} else if (res.error.includes('Username')) {
					errors.username = "Le nom d'utilisateur est déjà utilisé.";
				} else {
					errors.email = '';
					errors.server = 'Erreur interne.';
				}
			} else {
				errors = {};
				isUpdated = true;
			}
		}

		this.setState({ errors, isUpdated });
		await this.setProfile();
	};

	handleDelete = async () => {
		const { username, confirmationUsername, errors } = this.state;
		if (username !== confirmationUsername) {
			errors.confirmationUsername =
				"Le nom entré ne correspond pas à votre nom d'utilisateur.";
			this.setState({ errors });
			return;
		}

		const res = await remove(this.context.token);
		if (res.error) {
			this.setState({ errors: { confirmationUsername: res.error } });
		} else {
			this.context.updateToken('');
			this.setState({ isDeleted: true });
		}
	};

	render() {
		const { isDeleteModalShown, confirmationUsername } = this.state;

		if (!this.state.username) return <div></div>;

		return (
			<div className='is-fullheight'>
				<form
					onSubmit={(e) => this.handleSubmit(e)}
					className='section container'
				>
					<h1 className='title'>Paramètres</h1>

					<div className='field'>
						<label className='label' htmlFor='username'>
							Nom d'utilisateur
						</label>
						<div className='control has-icons-left'>
							<input
								className={
									this.state.errors.username ? 'input is-danger' : 'input'
								}
								id='username'
								type='text'
								name='username'
								placeholder='Jean Dupont'
								value={this.state.username}
								onChange={this.handleChange}
							/>

							<span className='icon is-small is-left'>
								<FaUser />
							</span>
						</div>

						{this.state.errors.username && (
							<p className='help is-danger'>{this.state.errors.username}</p>
						)}
					</div>
					<div className='field'>
						<label className='label' htmlFor='email'>
							Adresse électronique
						</label>
						<div className='control has-icons-left'>
							<input
								className={
									this.state.errors.email ? 'input is-danger' : 'input'
								}
								id='email'
								type='email'
								name='email'
								placeholder='jean.dupont@gmail.com'
								onChange={this.handleChange}
								value={this.state.email}
							/>

							{this.state.newEmail && (
								<p className='help is-success'>
									Un courriel vous a été envoyé à votre nouvelle adresse
									électronique : <b>{this.state.newEmail}</b>, et ce afin de la
									vérifier.
								</p>
							)}

							<span className='icon is-small is-left'>
								<FaEnvelope />
							</span>
						</div>

						{this.state.errors.email && (
							<p className='help is-danger'>{this.state.errors.email}</p>
						)}
					</div>

					<div className='field'>
						<label className='label' htmlFor='password'>
							Mot de passe
						</label>
						<div className='control has-icons-left'>
							<input
								id='password'
								className={
									this.state.errors.password ? 'input is-danger' : 'input'
								}
								type='password'
								name='password'
								placeholder='••••••••'
								onChange={this.handleChange}
							/>

							<span className='icon is-small is-left'>
								<FaLock />
							</span>
						</div>

						{this.state.errors.password && (
							<p className='help is-danger'>{this.state.errors.password}</p>
						)}
					</div>
					{this.state.errors.server && (
						<p className='help is-danger'>{this.state.errors.server}</p>
					)}

					{this.state.isUpdated && (
						<div>
							<p className='help is-success'>Votre compte a été mis à jour.</p>
							<br />
						</div>
					)}

					<div className='field'>
						<div className='control'>
							<input type='submit' className='button is-link' />
						</div>
					</div>

					<button
						onClick={(e) => this.toggleDeleteModal()}
						className='button is-danger is-small'
					>
						Supprimer le compte
					</button>
				</form>

				<div className={isDeleteModalShown ? 'modal is-active' : 'modal'}>
					<div className='modal-background' />
					<div className='modal-card'>
						<header className='modal-card-head'>
							<p className='modal-card-title'>Suppression du compte</p>
							<button
								className='delete'
								aria-label='close'
								onClick={() => this.cancelDelete()}
							/>
						</header>
						<section className='modal-card-body'>
							<p>
								A des fins de confirmation, veuillez entrer votre nom
								d'utilisateur ci-dessous.
							</p>
							<br />
							<div className='field'>
								<label className='label' htmlFor='confirmationUsername'>
									Nom d'utilisateur
								</label>
								<div className='control has-icons-left'>
									<input
										className={
											this.state.errors.confirmationUsername
												? 'input is-danger'
												: 'input'
										}
										id='confirmationUsername'
										type='text'
										name='confirmationUsername'
										placeholder='Jean Dupont'
										value={confirmationUsername}
										onChange={this.handleChange}
									/>

									<span className='icon is-small is-left'>
										<FaUser />
									</span>
								</div>

								{this.state.errors.confirmationUsername && (
									<p className='help is-danger'>
										{this.state.errors.confirmationUsername}
									</p>
								)}
							</div>
						</section>
						<footer className='modal-card-foot'>
							<button
								className='button is-danger'
								onClick={() => this.handleDelete()}
							>
								Envoyer
							</button>
							<button className='button' onClick={() => this.cancelDelete()}>
								Annuler
							</button>
						</footer>
					</div>
				</div>
			</div>
		);
	}
}

Settings.contextType = AuthContext;
