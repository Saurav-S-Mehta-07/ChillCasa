const express = require('express');
const app = express();
const session = require('express-session');

let sessionOption = {
  secret: 'supersecretkey',
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionOption));


app.get("/",(req,res)=>{
    console.log("home route");
});

app.get("/register",(req,res)=>{
    let {name = "user"} = req.query;
    req.session.name=name;
    console.log(req.session);
    res.redirect("/hello");
})

app.get("/hello",(req,res)=>{
    res.send(`Hello ${req.session.name}`);
})

app.listen(3000,()=>{
    console.log("Listening to PORT : 3000");
})