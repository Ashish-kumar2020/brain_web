const { Router } = require("express");
const { userModel } = require("../DbSchema");
const { Types } = require("mongoose");
const userRouter = Router();

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
