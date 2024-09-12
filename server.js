const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

// routes
// home
app.get("/",(req, res)=>{
    res.render("landingPage");
});
// login
app.get("/login",(req, res)=>{
    res.render("logIn",{dontMatch:""});
});
// signUp
app.get("/signUp",(req, res)=>{
    res.render("signUp",{dontMatch:""});
});
// handle forms
app.post("/login",(req,res)=>{
    console.log(req.body);
    res.render("logIn",{dontMatch:""});
});
app.post("/signUp",(req,res)=>{
    console.log(req.body);
    res.render("signUp",{dontMatch:""});
});
app.listen(port,()=>{
    console.log("server running on port 3000");
});