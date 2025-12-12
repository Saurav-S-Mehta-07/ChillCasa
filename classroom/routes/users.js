const express = require("express");
const router = express.Router();

router.get("/",(req,res)=>{
    res.send("get for users");
});
router.get("/new",(req,res)=>{
    res.send("get for show users");
});
router.post("/",(req,res)=>{
    res.send("post for users");
});
router.delete("/",(req,res)=>{
    res.send("delete for users");
});

module.exports = router;