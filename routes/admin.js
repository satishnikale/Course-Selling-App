const { Router } = require("express");
const adminRouter = Router();
const { adminModel } = require("../db");


adminRouter.post("/signup", function(req, res){
    res.json({
        message : "You are signed up"
    })
});
adminRouter.post("/signin", function(req, res){
    res.json({
        message : "You are signed in"
    })
});
adminRouter.get("/purchases", function(req, res){
    res.json({
        message : "Your Purchases..."
    })
});

adminRouter.get("/admin", function(){
    res.json({
        message : "You are at Admin..."
    })
});

module.exports = { adminRouter }