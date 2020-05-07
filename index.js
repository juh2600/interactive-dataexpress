const express = require("express");
const pug = require("pug");
const path = require("path");


const app = express();

app.set("view engine", "pug");
app.set("views", __dirname+"/views");
app.use(express.static(path.join(__dirname+"/public")));


app.get("/", (req, res) => {
    res.render("landing", {});
})

app.listen(3000);
