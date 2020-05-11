const accounts = require('../api/accounts.js');

/*Making an interceptor*/
const express = require('express');

const app = express()
const intercept = (req, res, next) => {
    console.log('Intercepted on ', req.path);
    next();
};
app.use(intercept);
app.get('/', (req, res) => {
    console.log('Intercepted to the index.');
});


/*Connection to database*/
let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/data', 
{useUnifiedTopology: true, useNewUrlParser: true});

let mdb = mongoose.connection;
mdb.on('error', console.error.bind(console, 'connection error(s):'));
mdb.once('open', callback => {});

/*Connection to the other pages*/
accounts.index = (req, res) => {
    res.render('index', {
        title: 'landing'
    });
}
accounts.login = (req, res) => {
    res.render('login', {
        title: "login"
    });
}
accounts.signedIn = (req, res) => {
    res.render('signedIn', {
        title: 'signedIn'
    });
}
accounts.signedOut = (req, res) => {
    res.render('signedOut', {
        title: 'signedOut'
    });
}
accounts.signUp = (req, res) => {
    res.render('signUp', {
        title: 'signUp'
        // account
    });
}

/*Joe's Code Examples*/
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
}

accounts.get(username);

accounts.edit(username, {
    //object containing any of the things above
    // account.username = req.body.username;
    account
});

accounts.remove(username);

accounts.authenticate(username, password);


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

app.listen(3000);
