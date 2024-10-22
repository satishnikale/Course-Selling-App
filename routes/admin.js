const { Router } = require("express");
const adminRouter = Router();
const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const { adminModel, courseModel } = require("../db");
const { adminMiddleware } = require("../middlewares/adminAuth");

adminRouter.post("/signup", async function (req, res) {
  const requiredBody = z.object({
    email: z.string().min(4).max(25).email(),
    password: z.string().min(6).max(18),
    firstName: z.string().min(4).max(25),
    lastName: z.string().min(4).max(25),
  });

  const parsedWithSuccess = requiredBody.safeParse(req.body);
  if (!parsedWithSuccess.success) {
    res.json({
      message: "Invalide input",
      error: parsedWithSuccess.error,
    });
    return;
  }
  const { email, password, firstName, lastName } = req.body;
  const hashedPassword = await bcrypt.hash(password, 5);

  try {
    await adminModel.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
    });
  } catch (error) {
    res.json({
      message: `Sign up failed ${error}`,
    });
  }
  res.json({
    message: "Account created Successfully as Admin",
  });
});
adminRouter.post("/signin", async function (req, res) {
  const { email, password } = req.body;

  const admin = await adminModel.findOne({
    email: email
  });

  const match = await bcrypt.compare(password, admin.password);

  if (match) {
    const token = jwt.sign(
      {
        id: admin._id,
      },
      JWT_ADMIN_PASSWORD
    );
    res.json({
      token
    });
  } else {
    res.json({
      message: "Incorrect credentials...",
    });
  }
});
adminRouter.post("/course", adminMiddleware, async function (req, res) {
    const adminId = req.adminId;

    const { title, descreption, imageUrl, price } = req.body;

    const course = await courseModel.create({
        title : title,
        descreption : descreption,
        imageUrl : imageUrl,
        price : price, 
        creatorId : adminId
    });

  res.json({
    message: "Course created",
    courseId : course._id
  });
});

adminRouter.put("/updatecourse", adminMiddleware, async function (req, res) {
  const adminId = req.adminId;

  const { title, description, imageUrl, price, courseId } = req.body;

  const course = await courseModel.updateOne({
      _id: courseId, 
      creatorId: adminId 
  }, {
      title: title, 
      description: description, 
      imageUrl: imageUrl, 
      price: price
  })

  res.json({
      message: "Course updated",
      courseId: course._id
  })
});

adminRouter.get("/course/bulk", adminMiddleware, async function () {
   const adminId = req.userId;

    const courses = await courseModel.find({
        creatorId: adminId 
    });

    res.json({
        message: "Course updated",
        courses
    })
});

module.exports = { adminRouter };
