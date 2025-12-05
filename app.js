const express = require("express");
const app = express();
const mongoose = require("mongoose");

let Port = 8080;

app.listen(Port,()=>{
    console.log("listening to the Port : 8080");
})