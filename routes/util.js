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
	if(why === null || why === '') {
		res.status(code).end();
		return;
	}
	if(why.constructor.name == 'Object') {
		respondJSON(code, null, why, res);
		return;
	}
	res.statusMessage = why;
	res.status(code).end();
};

const respondJSON = (code, why, obj, res) => {
	if(!res) throw `Missing response object`;
	if(code < 200 || code == 204 || code == 304) throw `Response code ${code} MUST NOT have a message body`;
	res.statusCode = code;
	if(why !== null) res.statusMessage = why;
	res.json(obj);
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
