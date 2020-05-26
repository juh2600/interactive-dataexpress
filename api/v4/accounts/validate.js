require('dotenv').config();

// We can't just leave /.../.test as a method reference for some reason, so instead we wrap it in a lambda.
const test = (regex) => (x) => regex.test(x);

const params = {
	username: [
		{
			desc: "length of between three and thirty-two characters",
			test: test(/^.{3,32}$/)
		},

		{
			desc: "contains only alphanumeric characters and underscores",
			test: test(/^[a-z0-9_]*$/i)
		}
	],

	password: [
		{
			desc: "length of between eight and sixty-four characters",
			test: test(/^.{8,64}$/)
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


const valid = {

	username: (username) => {
		if(!username) return `Username is required but was not provided`;
		let failedCriteria = [];
		params.username.forEach((criterion) => { if(!criterion.test(username)) failedCriteria.push(criterion.desc); });
		if(failedCriteria.length > 0)
			return `Username failed criteria: ${failedCriteria.join('; ')}`;
	},

	password: (password) => {
		if(!password) return `Password is required but was not provided`;
		let failedCriteria = [];
		params.password.forEach((criterion) => { if(!criterion.test(password)) failedCriteria.push(criterion.desc); });
		if(failedCriteria.length > 0)
			return `Password failed criteria: ${failedCriteria.join('; ')}`;
	},

	email: (email) => {
		if(!email) return `Email is required but was not provided`;
	},

	dob: (dob) => {
		if(!dob) return `Date of birth is required but was not provided`;
		if(dob.constructor.name != 'Date') return `Date of birth is not a date object`;
		if(dob == 'Invalid Date')
			return `Invalid date`;
		let minAge = 13; // FIXME magic number
		let dobCeiling = new Date();
		dobCeiling.setFullYear(dobCeiling.getFullYear()-minAge);
		if(dob > dobCeiling)
			return `Date of birth is too young to sign up; must be at least ${minAge}`;
	},

	answers: function(answers) {
		if(!answers) return `Answers are required but were not provided`;
		if(answers.constructor.name != 'Array') return `Answers must be an array`;
		if(answers.length != process.env.ANSWER_COUNT)
			return `Answers array must have a length of exactly ${process.env.ANSWER_COUNT}; found ${answers.length} elements`;
		let out = [];
		for(let i in answers) {
			out[i] = this.answer(answers[i]);
		}
		if(out.filter(a => a !== undefined).length !== 0) return out;
	},

	answer: (a) => {
		if(a === null || a === undefined) return `No answer was provided`;
		if(a.constructor.name != 'Number' || a < 0 || a > 3 || a !== Math.floor(a)) return `An invalid answer was provided`;
	},

	avatar_args: function(args) {
		if(!args) return `Avatar arguments are required but were not provided`;
		if(args.constructor.name != 'Array') return `Avatar arguments must be an array`;
		let arg_descs = ['eyes', 'nose', 'mouth', 'color'];
		let arg_count = arg_descs.length;
		if(args.length != arg_count)
			return `args array must have a length of exactly ${arg_count}; found ${args.length} elements`;
		/*
		let out = [];
		for(let i in args) {
			out[i] = this.answer(args[i]);
		}
		*/// this is where we validate each thing individually
		let out = [];
		let validArgs = [
			[1,2,3,4,5,6,7,9,10],
			[2,3,4,5,6,7,8,9],
			[1,3,5,6,7,9,10,11]
		];
		for(let i in [0,1,2]) {
			if(validArgs[i].indexOf(args[i]) == -1) {
				out[i] = `Invalid ${arg_descs[i]} type`;
			}
		}
		if(args[3].constructor.name !== 'Number' || 0 > args[3] || args[3] > 0xffffff) {
			out[3] = `Invalid color`;
		}
		if(out.filter(a => a !== undefined).length !== 0) return out;
	}

};

const validate = (key, value) => {
	if(!valid.hasOwnProperty(key)) return `API: Cannot check whether parameter is valid: Method not found`;
	return valid[key](value);
};

module.exports = {
	test: params,
	valid,
	validate
};
