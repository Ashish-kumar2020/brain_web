const { Router } = require("express");
const express = require("express");
const userRouter = Router();

// User Sign up Route
userRouter.post("/signup", (req, res) => {
  res.status(201).json({
    message: "User added successfully",
  });
});

// User Sign in Route
userRouter.post("/signin", (req, res) => {
  res.status(201).json({
    message: "User Signed in Successfully",
  });
});

// See all the courses
userRouter.get("/purchases", (req, res) => {
  res.status(201).json({
    message: "Courses Fetched Successfully",
  });
});

module.exports = {
  userRouter: userRouter,
};
