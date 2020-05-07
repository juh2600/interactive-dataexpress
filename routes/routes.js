const accounts = require('../api/accounts.js');
let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/data', 
{useUnifiedTopology: true, useNewUrlParser: true});

let mdb = mongoose.connection;
mdb.on('error', console.error.bind(console, 'connection error(s):'));
mdb.once('open', callback => {});


/*Joes Code Examples*/

accounts.create({
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

accounts.get(username);

accounts.update(username, {
    //object containing any of the things above
    username
});

accounds.remove(username);


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