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
	res.render('login', { session: req.session, failed: req.failed});
};

const signUp = (req, res) => {
	res.render('signup', { session: req.session });
};

// TODO implement
const logout = (req, res) => {
	res.redirect('/', { session: req.session });
};

const loginPost = (req, res) => {
	AccountsAPI.checkPassword(req.body.username, req.body.password).then( isOK =>{
		if(isOK) {
			req.session.user = {
				isAuthenticated: true,
				username: req.body.username
			}
			res.redirect("/dashboard");
		}
		else {
			throw 'Username/password mismatch'; // this doesn't get used anywhere, but it tells us in code what's going on
		}
	}).catch(err => {
			req.failed = true;
			login(req, res);
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
