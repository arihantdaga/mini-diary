import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import { getFilePath } from '../../../helpers/preferences';
import Banner from '../../elements/Banner';
import PageCentered from '../PageCentered';


const propTypes = {
	decrypt: PropTypes.func.isRequired,
	decryptStatus: PropTypes.string.isRequired
};

export default class PasswordPrompt extends PureComponent {
	constructor() {
		super();

		this.state = {
			password: ''
		};

		// Function bindings
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onChange(e) {
		this.setState({
			isSubmitted: false,
			password: e.target.value
		});
	}

	/**
	 * Test decrypting the diary file with the provided password. On success, save the password and
	 * the decrypted diary entries to the Redux store. Otherwise, throw an error
	 */
	onSubmit(e) {
		e.preventDefault();
		const { decrypt } = this.props;
		const { password } = this.state;
		const filePath = getFilePath();

		// Try to decrypt the diary file - this.props.decryptStatus will be updated depending on whether
		// decryption was successful or unsuccessful
		decrypt(filePath, password);

		// Display error if password is incorrect
		this.setState({
			isSubmitted: true
		});

		// Select entered password if it is incorrect
		this.input.select();
	}

	render() {
		const { decryptStatus } = this.props;
		const { isSubmitted, password } = this.state;

		return (
			<PageCentered>
				<form className="password-prompt-form" onSubmit={this.onSubmit}>
					<input
						type="password"
						value={password}
						onChange={this.onChange}
						placeholder="Password"
						autoFocus
						required
						ref={(i) => {
							this.input = i;
						}}
					/>
					<button type="submit" className="button button-main">
						Unlock
					</button>
				</form>
				<div className="password-prompt-banner">
					{
						isSubmitted && decryptStatus === 'error'
							&& <Banner type="error" message="Incorrect password" />
					}
				</div>
			</PageCentered>
		);
	}
}

PasswordPrompt.propTypes = propTypes;