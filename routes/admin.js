const { Router } = require("express");
const adminRouter = Router();
const jwt = require("jsonwebtoken");
const JWT_ADMIN_PASSWORD = "adminSecret";
const { z } = require("zod");
const bcrypt = require("bcrypt");
const { adminModel } = require("../db");

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
    email: email,
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
adminRouter.get("/purchases", function (req, res) {
  res.json({
    message: "Your Purchases...",
  });
});
adminRouter.get("/purchases", function (req, res) {
  res.json({
    message: "Your Purchases...",
  });
});

adminRouter.get("/admin", function () {
  res.json({
    message: "You are at Admin...",
  });
});

module.exports = { adminRouter };
