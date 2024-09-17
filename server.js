require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const port = 3000;
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const passportLocalMongoose = require("passport-local-mongoose");
const app = express();

// setting up use
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

//  ---setting up session---
app.use(session({
    secret:"I LOVE ALLAH",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
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
userSchema.plugin(passportLocalMongoose);

// 03 set up model / collection
const User = new mongoose.model("User", userSchema);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
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
app.get("/dashBoard",(req, res)=>{
    res.render("dashBoard");
    if(req.isAuthenticated()){
     res.render("dashBoard");   
    }else{
        res.redirect("login");
    }
});
// handling forms
app.post("/signUp",(req,res)=>{
    const {fName, lName, email, password, rePassword} = req.body;
    if(password !== rePassword){
        res.render("signUp",{dontMatch:"passwords dont match"});
    }
    // authenticating sessions
    User.register({ fName : fName ,lName: lName ,email: email,}, password, (err, user) => {
        if (err) {
            console.log(err);
            if (err.name === "UserExistsError") {
                // If the user already exists, render the signup page with an error message
                return res.status(400).render("signUp", { dontMatch: "A user with this email is already registered." });
            } else {
                return res.status(200).redirect("/dashBoard");
            }
        } else {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/");
            });
        }
    });

});
app.post("/login",async(req,res)=>{
    const {email, password} = req.body;
    
});
app.listen(port,()=>{
    console.log(" server running on http://localhost:3000/");
});

// if(password === rePassword){
//     const user = new User({
//         fName:fName,
//         lName:lName,
//         email: email,
//         password:password,
//     });
//     // user.save();
//     res.send("user saved succesfully to db");
// }else{
//     res.render("signUp",{dontMatch:"sorry your passwords dont match try again"});   
// }