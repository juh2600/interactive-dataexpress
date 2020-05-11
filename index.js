const express = require("express");
const pug = require("pug");
const path = require("path");


const app = express();

app.set("view engine", "pug");
app.set("views", __dirname+"/views");
app.use(express.static(path.join(__dirname+"/public")));


app.get("/", (req, res) => {
    res.render("landing");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/signup", (req, res) => {
    res.render("signup");
});



app.get("/account/edit", (req, res) => {
    let user = {
        username: "fuckboi",
        email: "hotguy69@yahoo.mail",
        dob: "2001-05-12",
        questions: [
            {id: 3, answer: "First answerrrrr"},
            {id: 2, answer: "mid answerrrrr"},
            {id: 2, answer: "last answerrrrr"}
        ]
    }
    res.render("accountEdit", {
        user
    });
});
app.get("/dashboard", (req, res) => {
    res.render("dashboard");
});

app.get("/logout", (req, res) => {
    res.redirect("/");
})
app.listen(3000);
