const logger = require('./logger').get('main')
const express = require("express");
const expressSession = require('express-session');
const pug = require("pug");
const path = require("path");

const app = express();

/*Making an interceptor*/

/*
app.use(expressSession({
    secret: process.env.EXPRESS_SESSION_SECRET,
    saveUninitialized: true,
    resave: true
}));

const intercept = (req, res, next) => {
    console.log('Intercepted on ', req.path);
    next();
};
app.use(intercept);
*/
app.get('/', (req, res) => {
    console.log('You must be logged in.');
    res.send('You must be logged in.');
});

/*Body parser and a little interceptor usage*/
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});
/*
const checkAuth = (req, res, next) => {
    if(req.session.user && req.session.user.isAuthenicated) {
        next();
    } else {
        res.redirect('/');
    }
};
/*
app.post('/login', urlencodedParser, (req, res) => {
    console.log(req.body.username);
    if(req.body.username == account.username && req.body.password == account.password){
        req.session.user = {
            isAuthenicated: true,
            username: req.body.username
        }
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});
*/
/*Public pages*/
app.set("view engine", "pug");
app.set("views", __dirname+"/views");
app.use(express.static(path.join(__dirname+"/public")));

/*
app.get("/", (req, res) => {
    res.render("landing");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/signup", (req, res) => {
    res.render("signup");
});
*/
/*Private Pages*/
/*
app.get("/account/edit", checkAuth, (req, res) => {
    res.render("accountEdit");
    res.send("You must be signed in!")
});
app.get("/dashboard", checkAuth, (req, res) => {
    res.render("dashboard");
    res.send('You must be singed in!')

let user = {
    username: "fuckboiiiiiiii",
    email: "hotguy69@yahoo.mail",
    dob: "2001-05-12",
    questions: [
        {id: 3, answer: "First answerrrrr"},
        {id: 2, answer: "mid answerrrrr"},
        {id: 2, answer: "last answerrrrr"}
    ]
}

app.get("/account/edit", (req, res) => {
    res.render("accountEdit", {
        user
    });
});
app.get("/dashboard", (req, res) => {
    res.render("dashboard", {
        user
    });
});
*/

logger.info('Configuring routes...');
let routeFiles = ['frontend', 'accounts'];
const routeManager = require('./routes/manager');
routeFiles.forEach((file) => {
        logger.info(`Adding ${file} routes...`);
        let component = require(`./routes/${file}`);
        if(component.configure) component.configure({});
        routeManager.apply(app, component);
        logger.info(`Added ${file} routes.`);
});
logger.info('Configured routes.');


app.get("/logout", (req, res) => {
    res.redirect("/");
})


app.listen(3000);

