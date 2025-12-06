const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");

let Port = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/chillcasa";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

main().then((res)=>{
    console.log("MongoDB connetion successful");
}).catch(err=>console.log(err));

async function main(){
    mongoose.connect(MONGO_URL);
}

app.get("/",(req,res)=>{
    res.send("At Home");
})



//index route
app.get("/listings",async (req,res)=>{
   const allListings = await Listing.find();
   res.render("listings/index.ejs",{allListings});
})

//create route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

//edit route
app.post("/listings",async(req,res)=>{
   const newListing  = new Listing(req.body.listing);
   await newListing.save();
   res.redirect("/listings");
})

//update route
app.put("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
})

//show route
app.get("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show",{listing});
})

app.get("/listings/:id/edit",async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})

//delete route
app.delete("/listings/:id", async(req,res)=>{
   let {id} = req.params;
   await Listing.findByIdAndDelete(id);
   res.redirect("/listings");
})

app.listen(Port,()=>{
    console.log("listening to the Port : 8080");
})