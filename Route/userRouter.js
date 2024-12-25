const { Router } = require("express");
const { userModel, creatorModel } = require("../DbSchema");
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

// fetch all courses
userRouter.get("/allcourses", authenticateJWT, async (req, res) => {
  try {
    const courses = await creatorModel.find({});
    if (!courses) {
      return res.status(400).json({
        message: "No Courses available",
      });
    }

    return res.status(200).json({
      message: "All courses fetched",
      courses: courses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error in fetching the courses",
      error: error.message,
    });
  }
});

// fetch all creators name
userRouter.get("/creatorname", authenticateJWT, async (req, res) => {
  try {
    const fetchCreator = await creatorModel.find({});
    if (!fetchCreator) {
      return res.status(400).json({
        message: "No creator available",
      });
    }

    let creatorNames = [];
    fetchCreator.forEach((val) => {
      creatorNames.push({
        name: val.creatorName,
        id: String(val.creatorID),
      });
    });

    return res.status(200).json({
      message: "Creators name fetched successfully",
      creatorName: creatorNames,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error in fetching the creators name list",
      error: error.message,
    });
  }
});

// fetch specific creator course
userRouter.get("/creatorcourses", authenticateJWT, async (req, res) => {
  const { creatorID } = req.body;
  try {
    if (!creatorID) {
      return res.status(400).json({
        message: "Creator ID cannnot be empty",
      });
    }

    const allCreators = await creatorModel.find({ creatorID });
    if (!allCreators || allCreators.length === 0) {
      return res.status(404).json({
        message: "No courses found",
      });
    }
    res.status(200).json({
      message: "Creator courses fetched successfully",
      courses: allCreators,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while fetching the course",
      error: error.message,
    });
  }
});
// See all user sepecific courses
userRouter.get("/purchase", (req, res) => {
  // TODO : Add functionality to fetch all the users specific courses
  res.status(201).json({
    message: "Course fetched Successfully",
  });
});

module.exports = {
  userRouter: userRouter,
};
