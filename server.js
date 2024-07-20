const bodyParser = require("body-parser");
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const passport = require("passport");
const passportLocal = require("passport-local-mongoose");
const session = require("session");
const port = 3000;


app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

app.get("/",(req, res)=>{});
app.get("/",(req, res)=>{});
app.get("/",(req, res)=>{});

app.post("/",(req, res)=>{});
app.post("/",(req, res)=>{});
app.post("/",(req, res)=>{});
app.listen(port, ()=>{
    console.log("express server is running");
});