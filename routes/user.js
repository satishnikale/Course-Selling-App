const { Router } = require("express");
const bcrypt = require("bcrypt");
const userRouter = Router();
const { z } = require("zod");
const { userModel, purchaseModel, courseModel } = require("../db");

    
    userRouter.post("/signup", async function(req, res){
        const requiredBody = z.object({
            email : z.string().min(4).max(25).email(),
            password :z.string().min(6).max(18),
            firstName : z.string().min(4).max(25),
            lastName : z.string().min(4).max(25)
        });

    // const parsedData = requiredBody.parse(req.body);
    const parsedWithSuccess = requiredBody.safeParse(req.body);
    if(!parsedWithSuccess.success){
        res.json({
            message : "Invalide input",
            error : parsedWithSuccess.error
        });
        return
    }
    const {email, password, firstName, lastName } = req.body;
    const hashedPassword = await bcrypt.hash(password, 5);

       try {
        await userModel.create({
            email :email.toLowerCase(),
            password : hashedPassword,
            firstName : firstName,
            lastName : lastName
       })
       } catch (error) {
        res.json({
            message : `Sign up failed ${error}`
        })
       }
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