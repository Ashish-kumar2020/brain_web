const { Router } = require("express");
const { userModel } = require("../DbSchema");
const { Types } = require("mongoose");
const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  const user = await userModel.create({
    email,
    password,
    firstName,
    lastName,
  });
  res.status(201).json({
    message: "User Added Successfully",
    user: user,
  });
});

// User Signin Router
userRouter.post("/signin", async (req, res) => {
  const { email, password, userId } = req.body;
  const objectID = new Types.ObjectId(userId);
  const data = await userModel.findOne({ _id: objectID });
  console.log(data.email);
  if (!data) {
    res.status(201).json({
      message: "User not found please signup",
    });
  } else {
    res.status(201).json({
      message: "User Signed in Successfully",
      data: data,
    });
  }
});

// See all the courses
userRouter.get("/purchase", (req, res) => {
  res.status(201).json({
    message: "Course fetched Successfully",
  });
});

module.exports = {
  userRouter: userRouter,
};
