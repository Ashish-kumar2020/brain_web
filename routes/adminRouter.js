const { Router } = require("express");
const adminRouter = Router();
const { adminModel } = require("../db");

adminRouter.post("/signup", (req, res) => {
  res.status(201).json({
    message: "Admin added successfully",
  });
});

adminRouter.post("/signin", (req, res) => {
  res.status(201).json({
    message: "Admin Logged in Successfully",
  });
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
