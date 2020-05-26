require('dotenv').config();
v = require('./accounts/validate');
s = require('./accounts/schema');
a = require('./accounts');
c = console.log;
e = console.error;

u = {
	username: 'joe', // taken
	password: '1234', // weak
	// missing email
	dob: '2020-01-01', // too young
	answers: ['a', 8] // bad, out of range, not enough
};

v = {
	username: 'joey',
	password: '1234AAab',
	email: 'c@t.co',
	dob: '2000',
	answers: [1,-2,3.4]
};
