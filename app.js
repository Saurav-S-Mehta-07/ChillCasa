const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require("./utils/ExpressError.js");
const { ListingSchema, reviewSchema }  = require("./schema.js");

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

//joi handling
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

const validateReview = (req,res,next)=>{
  let {error} = reviewSchema.validate(req.body);
  if(error){
    let errorMsg = error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400,errorMsg);
  }
  else{
    next();
  }
}

//index route
app.get("/listings",wrapAsync(async (req,res)=>{
   const allListings = await Listing.find();
   res.render("listings/index.ejs",{allListings});
}));

//create route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

app.post("/listings", validateListing, wrapAsync(async(req,res)=>{
   const newListing = new Listing(req.body.listing); 
   await newListing.save();
   res.redirect("/listings");
}));

//update route
app.put("/listings/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing},{runValidators:true});
    res.redirect(`/listings/${id}`);
}));

//show route
app.get("/listings/:id",wrapAsync(async(req,res,next)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        return next(new ExpressError(404,"Listing not found"));
    }
    res.render("listings/show",{listing});
}));

app.get("/listings/:id/edit",wrapAsync(async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        return next(new ExpressError(404,"Listing not found"));
    }
    res.render("listings/edit.ejs",{listing});
}));

//delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
   let {id} = req.params;
   await Listing.findByIdAndDelete(id);
   res.redirect("/listings");
}));

//reviews
//post review route
app.post("/listings/:id/review",validateReview,wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));

//delete review route
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
  let {id, reviewId} = req.params;
  await Listing.findByIdAndUpdate(id, {$pull : {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
}))


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