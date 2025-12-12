const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listings = require('./routes/listing.js');
const reviews  = require('./routes/review.js');

let Port = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/chillcasa";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));

main().then((res)=>{
    console.log("MongoDB connetion successful");
}).catch(err=>console.log(err));

async function main(){
    mongoose.connect(MONGO_URL);
}

app.get("/",(req,res)=>{
    res.send("At Home");
})

//listings routes
app.use("/listings",listings);

//reviews routes
app.use("/listings/:id/reviews",reviews);

//page not found
app.use((req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
});

//error handling middleware
app.use((err,req,res,next)=>{
   res.render("error",{err});
})

app.listen(Port,()=>{
    console.log("listening to the Port : 8080");
})