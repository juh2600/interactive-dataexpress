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
    res.render("accountEdit");
});
app.get("/dashboard", (req, res) => {
    res.render("dashboard");
});


app.listen(3000);
