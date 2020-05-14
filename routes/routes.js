const accounts = require('../api/accounts.js');




// /*Connection to database*/
// let mongoose = require('mongoose');
// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost/data', 
// {useUnifiedTopology: true, useNewUrlParser: true});

// let mdb = mongoose.connection;
// mdb.on('error', console.error.bind(console, 'connection error(s):'));
// mdb.once('open', callback => {});

/*Connection to the other pages*/
accounts.index = (req, res) => {
    res.render('/', {
        title: 'Home'
    });
}
accounts.login = (req, res) => {    
    if(err) return console.error(err);
    res.render('login', {
        title: "Login"
    });
}
accounts.signUp = (req, res) => {
    if(err) return console.error(err);
    res.render('signUp', {
        title: 'Sign Up'
        // accounts
    });
}

/*These are private routes*/
accounts.dashboard = (req, res) => {
    res.render('/dashboard', {
        title: 'DashBoard'
    });
}
accounts.logout = (req, res) => {
    res.render('logout', {
        title: 'Signed Out'
    });
}
accounts.accountEdit = (req, res) => {
    if(err) return console.error(err);
    res.render('/account/edit', {
        title: 'Edit Account',
        // accounts
    });
}
accounts.create = (req, res) => {
    if(!requirePresenceOfParameter(req.body.username, 'username', res)) return;
    if(!requirePresenceOfParameter(req.body.password, 'password', res)) return;
    if(!requirePresenceOfParameter(req.body.email, 'email', res)) return;
    if(!requirePresenceOfParameter(req.body.dob, 'dob', res)) return;
    if(!requirePresenceOfParameter(req.body.questions, 'questions', res)) return;
        {
            accounts.api.create(req.body).then(() => {
                respond("Ok")
            }).catch(500, err, res)  
        }
    }

/*Joe's Code Examples with me adding to them*/
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