const logger = require('../logger').get('HTTP::Frontend');
const expressSession = require('express-session');
const AccountsAPI = require('../api/v2/accounts.js');
const { respond, requirePresenceOfParameter } = require('./util');
const cookieParser = require("cookie-parser");


let app = null;

let generic500Response = 'An internal error has occurred. Please try again later.<hr>Try what again later? Dunno. How much later? Couldn\'t tell ya. But just the presence of those words bumps the whole site up a few enterprise-grade points.';

const requireSignedIn = (req, res, next) => {
	if(req.session.user && req.session.user.isAuthenticated) {
		next();
	} else {
		res.redirect("/");
	}
}

const getCurrentDate = () => {
	let now = new Date();
	return now.toISOString();
}

// Public routes
//GET
const index = (req, res) => {
	let lastVisited;
	if(req.cookies.lastVisitedIndex)
		lastVisited = req.cookies.lastVisitedIndex;
	else
		lastVisited = "Never";
	res.cookie("lastVisitedIndex", getCurrentDate(), {maxAge: 9999999999});
	res.render('landing', { session: req.session, lastVisited: lastVisited });
};

const login = (req, res) => {
	let lastVisited;
	if(req.cookies.lastVisitedLogin)
		lastVisited = req.cookies.lastVisitedLogin;
	else
		lastVisited = "Never";
	res.cookie("lastVisitedLogin", getCurrentDate(), {maxAge: 9999999999});
	res.render('login', { session: req.session, failed: req.failed, lastVisited: lastVisited});
};

const signUp = (req, res) => {
	let lastVisited;
	if(req.cookies.lastVisitedSignup)
		lastVisited = req.cookies.lastVisitedSignup;
	else
		lastVisited = "Never";
	res.cookie("lastVisitedSignup", getCurrentDate(), {maxAge: 9999999999});
	res.render('signup', { session: req.session, lastVisited: lastVisited, failed: req.failed });
};

// TODO implement
const logout = (req, res) => {

	req.session.destroy( err => {
		if(err) {
			logger.error(err);
		}
		else {
			res.redirect('/');
		}
	})
};

const loginPost = (req, res) => {
	AccountsAPI.checkPassword(req.body.username, req.body.password).then( isOK =>{
		if(isOK) {
			newSession(req);
			res.redirect("/dashboard");
		}
		else {
			throw 'Username/password mismatch'; // this doesn't get used anywhere, but it tells us in code what's going on
		}
	}).catch(err => {
		logger.error(err);
		req.failed = true;
		login(req, res);
	});

}


const newSession = req => {
	req.session.user = {
		isAuthenticated: true,
		username: req.body.username
	}
}
// Private routes
//GET
const dashboard = (req, res) => {
	let lastVisited;
	if(req.cookies.lastVisitedDashboard) {
		lastVisited = req.cookies.lastVisitedDashboard;
	}
	else {
		lastVisited = "Never";
	}
	res.cookie("lastVisitedDashboard", getCurrentDate(), {maxAge: 9999999999});
	res.render('dashboard', {
		session: req.session,
		lastVisited: lastVisited
	});
};



const editAccount = (req, res) => {
	let lastVisited;
	if(req.cookies.lastVisitedEditAccount) {
		lastVisited = req.cookies.lastVisitedEditAccount;
	}
	else {
		lastVisited = "Never";
	}
	res.cookie("lastVisitedEditAccount", getCurrentDate(), {maxAge: 9999999999});
	AccountsAPI.get(req.session.user.username).then(account => {
		let user = Object.assign({}, account, {dob: account.dob.toISOString().match(/^.*(?=T)/)[0]});
		res.render('accountEdit', {
			session: req.session,
			user: user,
			lastVisited: lastVisited
		});
	}).catch(err => {
		logger.error(err);
		internalErrorPage(req, res);
	});

};

// Generic error page
const errorPage = (err, req, res, next) => {
	if(err) {
		res.render('error', {
			error: err,
			code: res.statusCode,
			message: res.statusMessage,
			note: err.note
		});
	} else next();
};

const notFoundPage = (req, res, next) => {
	res.statusCode = 404;
	res.statusMessage = 'Not Found';
	err = {note: 'The requested resource could not be located.'};
	errorPage(err, req, res, null);
};

const internalErrorPage = (req, res) => {
	res.statusCode = 500;
	res.statusMessage = 'Internal Server Error';
	err = {note: generic500Response};
	errorPage({note:generic500Response}, req, res, null);
};

//POST

const editAccPost = (req, res) => {
	AccountsAPI.checkPassword(req.session.user.username, req.body.password).then( isOK => {
		if(isOK) {
			AccountsAPI.get(req.session.user.username).then(account => {
				let answers = [];
				req.body.answers = [req.body.answer1, req.body.answer2, req.body.answer3];
				for(let i in req.body.answers) {
					if(isNaN(parseInt(req.body.answers[i]))) answers.push(account.answers[i]);
					else answers.push(parseInt(req.body.answers[i]));
				}
				Object.keys(req.body).forEach(key => {
					if(!req.body[key])
						delete req.body[key];
				});
				AccountsAPI.update(req.session.user.username, req.body).then(isOK => {
					if(isOK) {
						if(req.body.username)
							req.session.user.username = req.body.username;
						dashboard(req, res);
					} else editAccount(req, res);
				}).catch(err => {
					logger.error(err);
					editAccount(req, res);
				});
			});
		}
		else{
			editAccount(req, res);
		}
	}).catch(err => {editAccount(req, res);});
}


const signupPost = (req, res) => {
	let user = {
		username: req.body.username,
		password: req.body.password,
		email: req.body.email,
		dob: req.body.dob,
		answers: [req.body.answer1, req.body.answer2, req.body.answer3]
	}

	AccountsAPI.create(user).then(isOK => {
		if(isOK) {
			login(req, res);
		} else {
			signUp(req, res);
		}
	}).catch(err => {
		if(/is already taken/i.test(err)) {
			req.failed = {reason: err};
			signUp(req, res);
			return;
		}
		logger.error(err);
		internalErrorPage(req, res);
	});
}


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
		uri: '/logout',
		method: 'get',
		handler: logout
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
	},

	{
		uri: '/account/edit',
		method: 'post',
		handler: editAccPost
	},

	{
		uri: '/signup',
		method: 'post',
		handler: signupPost
	},

	{
		method: 'use',
		handler: notFoundPage
	},

	{
		method: 'use',
		handler: errorPage
	}

];

const configure = options => {
	app = options.app;
	app.use(expressSession({
		secret: process.env.EXPRESS_SESSION_SECRET,
		saveUninitialized: true,
		resave: true
	}));
	app.use(cookieParser("This is my passphrase"));

}

module.exports = { logger, routes, configure };
