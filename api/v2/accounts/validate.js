require('dotenv').config();

// We can't just leave /.../.test as a method reference for some reason, so instead we wrap it in a lambda.
const test = (regex) => (x) => regex.test(x);

const params = {
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


// Round off truthy values to true and falsy values to false.
// This will catch things like 0, '', null, undefined, and false.
// It will not identify [] as empty.
const isNotEmpty = (x) => { return !!x; }

const exist = {
	username: isNotEmpty,
	password: isNotEmpty,
	email: isNotEmpty,
	dob: isNotEmpty,
	answers: (as) => { return isNotEmpty(as) && as.toString() != [].toString() && as.forEach; },
	answer: isNotEmpty
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
		let minAge = 13;
		let dobCeiling = new Date();
		dobCeiling.setFullYear(dobCeiling.getFullYear()-minAge);
		if(dob > dobCeiling)
			throw `DOB too young to sign up; must be at least ${minAge}`;

		return true;
	},

	answers: (as) => {
		return true;
	},

	answer: (a) => {
		return true;
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
