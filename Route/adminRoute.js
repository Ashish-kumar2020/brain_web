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
  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are mandotary",
      });
    }

    // check for existing user
    const existingUser = await adminModel.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        message: "No user found with these deatils",
      });
    }
    // password does not match
    if (existingUser.password !== password) {
      return res.status(401).json({
        message: "Invalid Credentails",
      });
    }

    // if all details are correct
    return res.status(200).json({
      message: "User Signed in successfully",
      userDetails: {
        email: existingUser.email,
        userID: existingUser._id,
      },
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({
      message: "Internal Server error",
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
