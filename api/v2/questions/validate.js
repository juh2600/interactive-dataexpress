require('dotenv').config();

const test = (regex) => (x) => regex.test(x);

const isNotEmpty = (x) => { return !!x; }

const exist = {
	question: isNotEmpty,
	options: isNotEmpty
};

const valid = {
	question: (question) => true,
	options: (options) => true
};

const validate = (key, value) => {
	if(!exist.hasOwnProperty(key)) throw `API: Cannot check whether parameter exists: Method not found`;
	if(!valid.hasOwnProperty(key)) throw `API: Cannot check whether parameter is valid: Method not found`;
	return exist[key](value) && valid[key](value);
};

module.exports = {
	exist,
	valid,
	validate
};
