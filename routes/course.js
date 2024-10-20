const { Router } = require("express");
const courseRouter = Router();

    courseRouter.get("/preview", function(req, res){
        res.json({
            message : "Courses"
        })
    });
    courseRouter.get("/purchase", function(req, res){
        res.json({
            message : "Purchased Courses"
        })
    });


module.exports = {
    courseRouter : courseRouter
}