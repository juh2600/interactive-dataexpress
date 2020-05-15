const makeSearchable = (object, list_key) => {
	object.get = (key) => {
		let out = object[list_key].filter((product) => { return product[object.primary_key] === key; })[0];
		if(out) return out;
//		throw `Entry ${key} does not exist`;
	};
	return object;
};

const respond = (code, why, res) => {
	if(!res) throw `Missing response object`;
	res.statusMessage = why;
	res.status(code).end();
};

const requirePresenceOfParameter = (param, name, res) => {
	if(!param) {
		respond(400, `Missing parameter ${name}`, res);
		return false;
	} else return true;
};

module.exports = {
	makeSearchable,
	respond,
	requirePresenceOfParameter
};
