const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

let Port = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/chillcasa";

main().then((res)=>{
    console.log("MongoDB connetion successful");
}).catch(err=>console.log(err));

async function main(){
    mongoose.connect(MONGO_URL);
}

app.get("/",(req,res)=>{
    res.send("At Home");
})

app.get("/testListing",async(req,res)=>{
    let sampleListing = new Listing({
        title : "my new Villa",
        description : "by the beach",
        price : 3999,
        location : "Mubai",
        country: "India"
    });
    await sampleListing.save();
    console.log("sample was saved");
    res.send("successful");
})

app.listen(Port,()=>{
    console.log("listening to the Port : 8080");
})