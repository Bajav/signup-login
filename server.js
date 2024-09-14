require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
const port = 3000;

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
// 01 level encryption
userSchema.plugin(encrypt,{secret:process.env.SECRETS, encryptedFields:["password", "rePassword"]});
// 03 creating collection
const Users = new mongoose.model("Users", userSchema);
// 04 inserting new data
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

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

app.post("/signUp",(req,res)=>{
    const {fName,lName, email, password, rePassword}= req.body;
    const User = new Users({
        fName:fName,
        lName:lName,
        email:email,
        password:password,
        rePassword:rePassword
    });
    if(User.password === User.rePassword){
        User.save();
        res.send("user saved to db");
    }else{
        res.render("signUp",{dontMatch:"passwords dont match"});
    }
});
app.post("/login",async (req,res)=>{
    const {email, password}= req.body;
    try{
        const foundUser = await Users.findOne({email:email});
      if(foundUser){
        console.log(foundUser);
        if(foundUser.password === password ){
            console.log("user found");
            res.status(200).send("user found");
        }else{
            console.log("pussy");
            res.render("logIn",{dontMatch:"user password is wrong"});
        }
      }else{res.status(401).render("logIn",{dontMatch:"no user found with following email"});;

      }
    }catch(err){console.log(err)};
});
app.listen(port,()=>{
    console.log(" server running on http://localhost:3000/");
});
