const logger = require('logger').get('HTTP::Frontend');

const AccountsAPI = require('../api/v1/accounts.js');
const { respond, requirePresenceOfParameter } = require('./util');

// Public routes
const index = (req, res) => {
	res.render('landing', {
		title: 'Home'
	});
};

const login = (req, res) => {    
	res.render('login', {
		title: 'Login'
	});
};

const signUp = (req, res) => {
	res.render('signup', {
		title: 'Sign Up'
	});
};


// Private routes
const dashboard = (req, res) => {
	res.render('/dashboard', {
		title: 'DashBoard'
	});
};

const logout = (req, res) => {
	res.render('logout', {
		title: 'Signed Out'
	});
};

const editAccount = (req, res) => {
	res.render('editAccount', {
		title: 'Edit Account'
	});
};

const routes = [
	{
		uri: '/',
		methods: ['get'],
		handler: index
	},

	{
		uri: '/login',
		methods: ['get'],
		handler: login
	},

	{
		uri: '/signup',
		methods: ['get'],
		handler: signUp
	},

	{
		uri: '/dashboard',
		methods: ['get'],
		handler: dashboard
	},

	{
		uri: '/account/edit',
		methods: ['get'],
		handler: editAccount
	}
];

module.exports = { logger, routes };

/*Joe's Code Examples with me adding to them*/
/*
accounts.create = (req, res) => {
	let account = new Account({
		username: String,
		password: String,
		email: String,
		dob: Date,
		questions: [
			{
				id: Number,
				answer: String
			},
			{
				id: Number,
				answer: String
			},
			{
				id: Number,
				answer: String
			}
		]
	});
	res.redirect('/');
}

accounts.get(username);

accounts.edit(username, {
	//object containing any of the things above
	// account.username = req.body.username,
	// account
});

// accounts.remove(username);


// accounts.authenticate(username, password);


// const clearCart = (req, res) => {
//     let customer_id = req.body.customer_id;
//     if(!requirePresenceOfParameter(customer_id, 'customer_id', res)) return;

//     try {
//             api.clearCart(customer_id);
//     } catch(err) {
//             if(/Customer .* does not exist/i.test(err)) {
// // respond is a function i wrote elsewhere; use res.status and res.send
//                     respond(404, err, res);
//             } else {
//                     respond(500, err, res);
//             }
//             return;
//     }
//     respond(204, `Cart ${customer_id} is empty`, res);
// };


// const respond = (code, why, res) => {
// if(!res) throw `Missing response object`;
// res.statusMessage = why;
// res.status(code).end();
// };

// const requirePresenceOfParameter = (param, name, res) => {
// if(!param) {
//     respond(400, `Missing parameter ${name}`, res);
//     return false;
// } else return true;
// };
*/