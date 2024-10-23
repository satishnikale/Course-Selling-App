const { Router } = require("express");
const courseRouter = Router();
const { userMiddleware } = require("../middlewares/userAuth");

courseRouter.get("/preview", async function(req, res) {
    
    const courses = await courseModel.find({});
    res.json({
        courses
    })
})
courseRouter.get("/purchases", userMiddleware, async function(req, res){
        const userId = req.userId;
        const courseId = req.body.courseId;

        // you should check if user paid or not
        purchaseModel.create({
            userId,
            courseId
        });

        res.json({
            message : "You have successfully bought the course"
        })
});


module.exports = {
    courseRouter : courseRouter
}