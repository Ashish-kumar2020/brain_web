const { Router } = require("express");
const adminRouter = Router();
const { adminModel } = require("../DbSchema");
const { Types } = require("mongoose");

adminRouter.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  const user = await adminModel.create({
    email,
    password,
    firstName,
    lastName,
  });
  if (user) {
    res.status(201).json({
      message: "Admin Added Successfully",
      user: user,
    });
  }
});

adminRouter.post("/signin", async (req, res) => {
  const { email, password, userId } = req.body;
  const objectID = new Types.ObjectId(userId);
  const userFound = await adminModel.findOne({ _id: objectID });
  if (userFound) {
    res.status(201).json({
      message: "Admin Logged in Successfully",
      userFound: userFound,
    });
  } else {
    res.status(201).json({
      message: "No User Found, Please signup",
    });
  }
});

adminRouter.post("/course", (req, res) => {
  res.status(201).json({
    message: "",
  });
});

adminRouter.put("/course", (req, res) => {
  res.status(201).json({
    message: "",
  });
});

adminRouter.get("/course/bulk", (req, res) => {
  res.status(201).json({
    message: "",
  });
});

module.exports = {
  adminRouter: adminRouter,
};
