require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const port = 3000;
const mongoose = require("mongoose");
const passport = require("passport");
const sesseion = require("express-session");
const passportLocalMongoose = require("passport-local-mongoose");
const app = express();

// setting up use
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

//  ---setting up session---
// 01 set up session
app.use(sesseion({
    secret:"I LOVE ALLAH, HE IS THE ONLY GOD",
    resave:false,
    saveUninitialized:false
}));
// 02 intitialize passport
app.use(passport.initialize());
app.use(passport.session());
// 03 initialize schema plugIn
mongoose.plugin(passportLocalMongoose);
// setting up db
// 01 set up connection url
mongoose.connect("mongodb://127.0.0.1:27017/TKTDB");
// 02 set up schema
const userSchema = new mongoose.Schema({
    fName:String,
    lName:String,
    email: String,
    password:String,
});
// 04 Serialize and Deserialize cookie
// 03 set up model / collection
const User = new mongoose.model("User", userSchema);
// server routes
app.get("/",(req,res)=>{
    res.render("landingPage");
});
app.get("/login",(req,res)=>{
    res.render("logIn",{dontMatch:""});
});
app.get("/signUp",(req,res)=>{
    res.render("signUp",{dontMatch:""});
});
// handling forms
app.post("/signUp",(req,res)=>{
    const {fName, lName, email, password, rePassword} = req.body;
    if(password === rePassword){
        const user = new User({
            fName:fName,
            lName:lName,
            email: email,
            password:password,
        });
        user.save();
        res.send("user saved succesfully to db");
    }else{
        res.render("signUp",{dontMatch:"sorry your passwords dont match try again"});   
    }
});
app.post("/login",async(req,res)=>{
    const {email, password} = req.body;

    try{
        const foundUser = await User.findOne({email:email});
        if(foundUser){
            if(foundUser.password === password){
                res.send("user logged in successfully");
            }else{
                res.render("logIn",{dontMatch:"passwords dont match"});   
            }
        }else{
            res.render("logIn",{dontMatch:"no user found with email address"});
        }
    }catch(err){
        console.log(err);
    }
});
app.listen(port,()=>{
    console.log(" server running on http://localhost:3000/");
});
