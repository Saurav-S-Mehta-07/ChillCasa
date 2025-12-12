const express = require("express");
const router = express.Router();

router.get("/",(req,res)=>{
    res.send("get for posts");
});
router.get("/new",(req,res)=>{
    res.send("get for show posts");
});
router.post("/",(req,res)=>{
    res.send("post for posts");
});
router.delete("/",(req,res)=>{
    res.send("delete for posts");
});

module.exports = router;