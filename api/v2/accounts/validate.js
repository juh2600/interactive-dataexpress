require('dotenv').config();

const test = (regex) => (x) => regex.test(x);

const params = {
	// username: {
	// 	length: {
	// 		min: 3,
	// 		max: 32
	// 	}
	// },
	username: [
		{
			desc: "length of between three and thirty-two characters",
			test: test(/.{3,32}/)
		},

		{
			desc: "contains only alphanumeric characters and underscores",
			test: test(/^[a-z0-9_]*$/i)
		}
	],

	password: [
		{
			desc: "length of between eight and sixty-four characters",
			test: test(/.{8,64}/)
		},

		{
			desc: "contains at least one capital letter",
			test: test(/[A-Z]/)
		},

		{
			desc: "contains at least one lowercase letter",
			test: test(/[a-z]/)
		},

		{
			desc: "contains at least one digit",
			test: test(/[0-9]/)
		}

	]
};

const isNotEmpty = (x) => { return !!x; }

const exist = {
	username: isNotEmpty,
	password: isNotEmpty,
	email: isNotEmpty,
	dob: isNotEmpty,
	questions: (qs) => { return isNotEmpty(qs) && qs.toString() != [].toString() && qs.forEach; },
	question: isNotEmpty
};

const valid = {

	username: (username) => {
		let failedCriteria = [];
		params.username.forEach((criterion) => { if(!criterion.test(username)) failedCriteria.push(criterion.desc); });
		if(failedCriteria.length > 0)
			throw `Username failed criteria: ${failedCriteria.join('; ')}`;
		return true;
	},

	password: (password) => {
		let failedCriteria = [];
		params.password.forEach((criterion) => { if(!criterion.test(password)) failedCriteria.push(criterion.desc); });
		if(failedCriteria.length > 0)
			throw `Password failed criteria: ${failedCriteria.join('; ')}`;
		return true;
	},

	email: (email) => {
		return true;
	},

	dob: (dob) => {
		if(dob == 'Invalid Date')
			throw `Invalid date`;
		return true;
	},

	questions: (qs) => {
		return true;
	},

	question: (q) => {
		// FIXME ensure that id exists and is a question
		return isNotEmpty(q.answer);
		return isNotEmpty(q.id) && isNotEmpty(q.answer);
	}
};

const validate = (key, value) => {
	if(!exist.hasOwnProperty(key)) throw `API: Cannot check whether parameter exists: Method not found`;
	if(!valid.hasOwnProperty(key)) throw `API: Cannot check whether parameter is valid: Method not found`;
	return exist[key](value) && valid[key](value);
};

module.exports = {
	test: params,
	exist,
	valid,
	validate
};
