const logger = require('logger').get('HTTP::Frontend');
const expressSession = require('express-session');
const AccountsAPI = require('../api/v1/accounts.js');
const { respond, requirePresenceOfParameter } = require('./util');
const cookieParser = require("cookie-parser"); 


let app = null;

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
	res.render('signup', { session: req.session, lastVisited: lastVisited });
};

// TODO implement
const logout = (req, res) => {
	
	req.session.destroy( err => {
        if(err) {
            console.log(err);
        }
        else {
            res.redirect('/');
        }
    })
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


// TODO implement
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
		res.render('accountEdit', {
			session: req.session,
			user: account,
			lastVisited: lastVisited
		});
	});
	
};


// Generic error page
const errorPage = (err, req, res, next) => {
	if(err) {
		res.render('err', {
			code: res.statusCode,
			message: res.statusMessage
		});
	} else next();
};



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
