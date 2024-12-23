const { Router } = require("express");
const { userModel } = require("../DbSchema");
const { Types } = require("mongoose");
const jwt = require("jsonwebtoken");
const userRouter = Router();
const authenticateJWT = require("../middleware/userJWTMiddleware");

userRouter.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        message: "All Fields are mandatory",
      });
    }

    // check for existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email Already exists, Please use different Email Address",
      });
    }

    // Create a new Usre
    const user = await userModel.create({
      email,
      password,
      firstName,
      lastName,
    });
    // return the new signedup user
    res.status(200).json({
      message: "User Added Successfully",
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
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

// User Signin Router
userRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "All Fields are mandatory",
      });
    }
    const existingUser = await userModel.findOne({ email });
    // if email not found
    if (!existingUser) {
      return res.status(400).json({
        message: "No User Found with these details",
      });
    }

    if (existingUser.password !== password) {
      return res.status(401).json({
        message: "Invalid Credentails",
      });
    }

    const token = jwt.sign(
      {
        user: existingUser.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // if email id found
    return res.status(200).json({
      message: "User Signed in successfully",
      userDetails: {
        email: existingUser.email,
        userID: existingUser._id,
        token: token,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server error",
    });
  }
});

userRouter.get("/userDeatil", authenticateJWT, (req, res) => {
  try {
    return res.status(200).json({
      message: "User found",
      userDetails: {
        user: req.user.user,
      },
    });
  } catch (error) {
    console.log(error);
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
