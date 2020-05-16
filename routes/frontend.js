const logger = require('logger').get('HTTP::Frontend');
const expressSession = require('express-session');
const AccountsAPI = require('../api/v1/accounts.js');
const { respond, requirePresenceOfParameter } = require('./util');

let app = null;

const requireSignedIn = (req, res, next) => {
    if(req.session.user && req.session.user.isAuthenticated) {
        next();
    } else {
        res.redirect("/");
    }
}

// Public routes
//GET
const index = (req, res) => {
	res.render('landing', { session: req.session });
};

const login = (req, res) => {    
	res.render('login', { session: req.session });
};

const signUp = (req, res) => {
	res.render('signup', { session: req.session });
};

const logout = (req, res) => {
	res.redirect('/', { session: req.session });
};
//POST
const loginPost = (req, res) => {
	requirePresenceOfParameter(req.body.username, "username", res);
	requirePresenceOfParameter(req.body.password, "password", res);
	AccountsAPI.checkPassword(req.body.username, req.body.password).then( isOK =>{
		if(isOK) {
			req.session.user = {
				isAuthenticated: true,
				username: req.body.username
			}
			res.redirect("/dashboard");
		}
		else {
			res.redirect("/");
		}
	}).catch(err => {
		respond(500, `Error while logging in: ${err}`, res);
	});

}



// Private routes
//GET
const dashboard = (req, res) => {
	res.render('dashboard', {
		session: req.session
	});
};


// TODO implement
const editAccount = (req, res) => {
	res.render('accountEdit', {
		session: req.session
	});
};
//POST






const routes = [
	{
		uri: '/',
		method: 'get',
		handler: index
	},

	{
		uri: '/login',
		method: 'get',
		handler: login
	},

	{
		uri: '/signup',
		method: 'get',
		handler: signUp
	},

	{
		uri: '/dashboard',
		method: 'get',
		handler: [requireSignedIn, dashboard]
	},

	{
		uri: '/account/edit',
		method: 'get',
		handler: [requireSignedIn, editAccount]
	},
	{
		uri: '/login',
		method: 'post',
		handler: loginPost
	}

];

const configure = options => {
	app = options.app;
	app.use(expressSession({
		secret: process.env.EXPRESS_SESSION_SECRET,
		saveUninitialized: true,
		resave: true
	}));
}

module.exports = { logger, routes, configure };

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
