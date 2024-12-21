const { Router } = require("express");
const adminRouter = Router();
const { adminModel } = require("../DbSchema");
const { Types } = require("mongoose");

adminRouter.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        message: "All Fields are mandatory",
      });
    }

    // check for existing user
    const existingUser = await adminModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message:
          "Email Address Already exists, Please use different Email Address",
      });
    }
    const user = await adminModel.create({
      email,
      password,
      firstName,
      lastName,
    });
    if (user) {
      res.status(201).json({
        message: "Admin Added Successfully",
        user: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    }
  } catch (error) {
    console.error("Error during signin:", error);
    if (error.name === "MongoServerError" && error.code === 11000) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }
    res.status(500).json({
      message: "Internal server error",
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
