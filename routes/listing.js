const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require("../utils/ExpressError.js");
const { ListingSchema }  = require("../schema.js");
const Listing = require("../models/listing.js");

//joi validation
const validateListing = (req,res,next)=>{
  let {error} = ListingSchema.validate(req.body);
  if(error){
    let errorMsg = error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400,errorMsg);
  }
  else{
    next();
  }
}

//index route
router.get("/",wrapAsync(async (req,res)=>{
   const allListings = await Listing.find();
   res.render("listings/index.ejs",{allListings});
}));

//create route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
})

router.post("/", validateListing, wrapAsync(async(req,res)=>{
   const newListing = new Listing(req.body.listing); 
   await newListing.save();
   res.redirect("/listings");
}));

//update route
router.put("/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing},{runValidators:true});
    res.redirect(`/listings/${id}`);
}));

//show route
router.get("/:id",wrapAsync(async(req,res,next)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        return next(new ExpressError(404,"Listing not found"));
    }
    res.render("listings/show",{listing});
}));

router.get("/:id/edit",wrapAsync(async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        return next(new ExpressError(404,"Listing not found"));
    }
    res.render("listings/edit.ejs",{listing});
}));

//delete route
router.delete("/:id",wrapAsync(async(req,res)=>{
   let {id} = req.params;
   await Listing.findByIdAndDelete(id);
   res.redirect("/listings");
}));

module.exports = router; //router object