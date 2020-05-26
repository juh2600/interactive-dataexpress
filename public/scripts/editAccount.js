const EditAccountForm = {
	fields: {
		newUsername: null,
		newPassword: null,
		oldPassword: null,
		email: null,
		dob: null
	},

	getCurrentUsername: function() { return document.cookie.split(/; ?/).filter(x => /^username=/.test(x))[0].split('=')[1];},

	call: async function(uri, body) {
		return fetch(uri, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body, null, '\t')
		});
	},

	serializeRaw: function() {
		let data = {};
		Object.keys(this.fields).forEach((field) => {
			data[field] = this.fields[field].value;
		});
		if(data.oldPassword) {
			data.password = data.oldPassword;
			delete data.oldPassword;
		}
		data.answers = [];
		[1,2,3].forEach((i) => {
			let id = `securityQuestion${i}`;
			let element = document.getElementById(id);
			data.answers.push(parseInt(element.value));
		});
		data.avatarArgs = [];
		['Eyes', 'Nose', 'Mouth', 'Color'].forEach((i) => {
			let id = `avatar${i}`;
			let element = document.getElementById(id);
			data.avatarArgs.push(parseInt(element.value));
		});
		//data.avatarArgs.push(parseInt(document.getElementById('avatarColor').value.replace('#', '0x')));
		//data.avatarArgs[3] = parseInt('0x' + Util.rainbow(360, data.avatarArgs[3]));
		Object.keys(data).forEach((field) => {
			if(!data[field]) delete data[field];
		});
		return data;
	},

	serializeChanges: function() {
		let data = this.serializeRaw();
		if(data.newUsername) {
			if(data.newUsername != this.getCurrentUsername()) data.username = data.newUsername;
			delete data.newUsername;
		}
		if(data.newPassword) {
			data.password = data.newPassword;
			delete data.newPassword;
		}
		Object.keys(data).forEach((field) => {
			if(!data[field]) delete data[field];
		});
		return data;
	},

	serializeAll: function() {
		let data = {
			changes: this.serializeChanges()
		};
		data.username = this.getCurrentUsername();
		data.password = this.fields.oldPassword.value;
		return data;
	},

	validateAll: async function() {
		let data = this.serializeChanges();
		return this.call('/api/v4/accounts/validate', data).then((res) => {
			if(res.status == 204) return {};
			else return res.json();
		}).then((errors) => {
			this.displayErrors(errors);
			if(Object.keys(errors).length > 0) {
				return false; // some errors were found
			} else {
				return true; // everything validated fine
			}
		}).catch(console.error);
	},

	displayError: function(input, span, message) {
		input.setCustomValidity(message);
		span.innerHTML = message;
	},

	clearError: function(input, span) {
		this.displayError(input, span, '');
	},

	displayErrors: function(errors) {
		Object.keys(errors).forEach((key) => {
			if(/Method not found/i.test(errors[key])) delete errors[key];
		});

		if(errors.username) {
			errors.newUsername = errors.username;
			delete errors.username;
		}
		if(errors.password) {
			errors.newPassword = errors.password;
			delete errors.password;
		}

		Object.keys(this.fields).forEach((field) => {
			let input = this.fields[field];
			let span = document.querySelector(`#${field}+span.validationMessage`);
			if(errors[field]) {
				this.displayError(input, span, errors[field]);
			} else {
				// Clear custom validity
				this.clearError(input, span);
			}
		});

		[1,2,3].forEach((i) => {
			let select = document.querySelector(`#securityQuestion${i}`);
			let span = {};
			if(errors.answers
				&& errors.answers.constructor.name == 'Array'
				&& errors.answers[i-1]) {
				this.displayError(select, span, errors.answers[i-1]);
			} else {
				this.clearError(select, span);
			}
		});

		let avatarComponents = ['Eyes', 'Nose', 'Mouth', 'Color'];
		for(let i in avatarComponents) {
			let input = document.querySelector(`#avatar${avatarComponents[i]}`);
			let span = {};
			if(errors.avatarArgs
				&& errors.avatarArgs.constructor.name == 'Array'
				&& errors.avatarArgs[i]) {
				this.displayError(input, span, errors.avatarArgs[i]);
			} else {
				this.clearError(input, span);
			}
		}

		let pwInput = document.getElementById('oldPassword');
		let pwSpan = document.querySelector('#oldPassword+span.validationMessage');
		if(errors.authentication) {
			this.displayError(pwInput, pwSpan, errors.authentication);
		} else {
			this.clearError(pwInput, pwSpan);
		}
	},

	submit: function(evt) {
		evt.preventDefault();
		this.validateAll().then((ok) => {
			if(ok) {
				let data = this.serializeAll();
				this.call('/api/v4/accounts/update', data).then((res) => {
					if(res.status == 204) {
						this.redirect();
						return {}; // pass this into displayErrors a few lines down just to shut up the error while testing
					}
					if(res.status == 401) {
						return {
							authentication: "Password is incorrect"
						};
					}
					let errors = res.json();
					return errors;
				}).then((errors) => {
					this.displayErrors(errors);
				}).catch(console.error);
			}
		}).catch(console.error);
	},

	redirect: function() {
		window.location = '/dashboard';
	},

	init: function(evt) {
		Object.keys(this.fields).forEach((field) => {
			this.fields[field] = document.querySelector(`[name=${field}]`);
			this.fields[field]
				.addEventListener('input', (evt) => {
					this.validateAll();
				});
		});
		document.querySelectorAll('select').forEach((select) => {
			select.addEventListener('input', (evt) => {
				this.validateAll();
			});
			select.selectedIndex = select.dataset.answer;
		});
		document.querySelector('form')
			.addEventListener('submit', (evt) => {
				this.submit(evt);
			});
	}
};

document.addEventListener('DOMContentLoaded', (evt) => {
	EditAccountForm.init(evt);
});
