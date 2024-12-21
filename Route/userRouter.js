const { Router } = require("express");
const userRouter = Router();

userRouter.post("/signup", (req, res) => {
  res.status(201).json({
    message: "User Added Successfully",
  });
});

// User Signup ROuter
userRouter.post("/signin", (req, res) => {
  res.status(201).json({
    message: "User Signed in Successfully",
  });
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
