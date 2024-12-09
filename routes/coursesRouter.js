const { Router } = require("express");
const express = require("express");
const courseRouter = Router();

courseRouter.post("/purchase", (req, res) => {
  res.status(201).json({
    message: "You have successfully purchased the course",
  });
});

courseRouter.get("/preview", (req, res) => {
  res.status(201).json({
    message: "All Courses Fetched Successfully",
  });
});

module.exports = {
  courseRouter: courseRouter,
};
