const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

// 01 connection url
mongoose.connect("mongodb://localhost:27017/TKTUsers");
// 02 creating schema
const userSchema = new mongoose.Schema({
    fName:String,
    lName:String,
    email:String,
    password:String,
    rePassword:String
}); 
// 03 creating collection
const Users = new mongoose.model("Users", userSchema);
// 04 inserting new data

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

function passwordsMatch(password, rePassword) {
    return password === rePassword;
}

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
    const {fName,lName, email, password, rePassword}= req.body;
    const user = new Users({
        fName:fName,
        lName:lName,
        email:email,
        password:password,
        rePassword:rePassword
    });
    // user.save();
    console.log(user);
    res.render("signUp",{dontMatch:""});
});
app.listen(port,()=>{
    console.log("server running on port 3000");
});