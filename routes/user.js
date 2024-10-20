const { Router } = require("express");
const bcrypt = require("bcrypt");
const userRouter = Router();
const { userModel, purchaseModel, courseModel } = require("../db");

    userRouter.post("/signup", async function(req, res){
       const {email, password, firstName, lastName } = req.body;
       const hashedPassword = bcrypt.hash(password, 5);

       await userModel.create({
            email :email,
            password : hashedPassword,
            firstName : firstName,
            lastName : lastName
       })
       res.json({
        message : "Account created Successfully"
       })
    });
    userRouter.post("/signin", function(req, res){
        res.json({
            message : "You are signed in"
        })
    });
    userRouter.get("/purchases", function(req, res){
        res.json({
            message : "Your Purchases..."
        })
    });
    
 module.exports = {
    userRouter : userRouter
 }