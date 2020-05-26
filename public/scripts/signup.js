const SignUpForm = {
	fields: {
		username: null,
		password: null,
		passwordConfirm: null,
		email: null,
		dob: null
	},

	call: async function(uri, body) {
		return fetch(uri, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body, null, '\t')
		});
	},

	serialize: function() {
		let data = {};
		Object.keys(this.fields).forEach((field) => {
			data[field] = this.fields[field].value;
		});
		delete data.passwordConfirm;
		data.answers = [];
		[1,2,3].forEach((i) => {
			let id = `securityQuestion${i}`;
			let element = document.getElementById(id);
			data.answers.push(parseInt(element.value));
		});
		data.avatarArgs = [];
		['Eyes', 'Nose', 'Mouth'].forEach((i) => {
			let id = `avatar${i}`;
			let element = document.getElementById(id);
			data.avatarArgs.push(parseInt(element.value));
		});
		data.avatarArgs.push(parseInt(document.getElementById('avatarColor').value.replace('#', '0x')));
		return data;
	},

	validateAll: async function() {
		let data = this.serialize();
		console.log('Sending body:', data);
		return this.call('/api/v4/accounts/validate', data).then((res) => {
			console.log(res);
			if(res.status == 204) return {};
			else return res.json();
		}).then((errors) => {
			Object.keys(errors).forEach((key) => {
				if(/Method not found/i.test(errors[key])) delete errors[key];
			});
			if(this.fields.password.value
				!== this.fields.passwordConfirm.value)
				errors.passwordConfirm = "Passwords must match";
			this.displayErrors(errors);
			if(Object.keys(errors).length > 0) {
				return false; // some errors were found
			} else {
				return true; // everything validated fine
			}
		}).catch(console.error);
	},

	displayErrors: function(errors) {
		console.log('Displaying valiation errors:', errors);
		Object.keys(this.fields).forEach((field) => {
			if(errors[field]) {
				this.fields[field].setCustomValidity(errors[field]);
				document.querySelector(`#${field}+span.validationMessage`)
					.innerHTML = errors[field];
			} else {
				// Clear custom validity
				this.fields[field].setCustomValidity('');
				document.querySelector(`#${field}+span.validationMessage`)
					.innerHTML = '';
			}
		});
		[1,2,3].forEach((i) => {
			let select = document.querySelector(`#securityQuestion${i}`);
			let span = document.querySelector(
				`#securityQuestion${i}+span.validationMessage`);
			if(errors.answers
				&& errors.answers.constructor.name == 'Array'
				&& errors.answers[i-1]) {
				select.setCustomValidity(errors.answers[i-1]);
				span.innerHTML = errors.answers[i-1];
			} else {
				select.setCustomValidity('');
				span.innerHTML = '';
			}
		});
	},

	submit: function(evt) {
		evt.preventDefault();
		this.validateAll().then((ok) => {
			if(ok) {
				let data = this.serialize();
				this.call('/api/v4/accounts/create', data).then((res) => {
					console.log(res);
					console.log(res.text());
					if(res.status == 201) {
						this.redirect();
						return {}; // pass this into displayErrors a few lines down just to shut up the error while testing
					}
					else return res.json();
				}).then((errors) => {
					this.displayErrors(errors);
				}).catch(console.error);
			}
		}).catch(console.error);
	},

	redirect: function() {
		console.log('Redirecting...');
		window.location = '/login';
	},

	init: function(evt) {
		Object.keys(this.fields).forEach((field) => {
			this.fields[field] = document.getElementById(field);
			this.fields[field]
				.addEventListener('input', (evt) => {
					this.validateAll();
				});
		});
		document.querySelectorAll('select').forEach((select) => {
			select.addEventListener('input', (evt) => {
				this.validateAll();
			});
		});
		document.querySelector('form')
			.addEventListener('submit', (evt) => {
				this.submit(evt);
			});
	}
};

document.addEventListener('DOMContentLoaded', (evt) => {
	SignUpForm.init(evt);
});
