const { Router } = require("express");
const adminRouter = Router();
const { adminModel, courseModel, creatorModel } = require("../DbSchema");
const { Types, default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateJWT = require("../middleware/userJWTMiddleware");

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

    const creatorID = new Types.ObjectId();
    const hashedPassword = await bcrypt.hash(password, 6);
    const user = await adminModel.create({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
      creatorID: creatorID,
    });
    if (user) {
      res.status(201).json({
        message: "Admin Added Successfully",
        user: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        creatorID: user.creatorID,
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
      ß;
    }
    // password does not match
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    console.log(passwordMatch);
    if (!passwordMatch) {
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
    // if all details are correct
    return res.status(200).json({
      message: "User Signed in successfully",
      userDetails: {
        email: existingUser.email,
        userID: existingUser._id,
        token: token,
        creatorID: existingUser.creatorID,
        name: existingUser.firstName,
      },
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({
      message: "Internal Server error",
    });
  }
});

adminRouter.post("/course", authenticateJWT, async (req, res) => {
  const {
    title,
    description,
    price,
    imageURL,
    creatorID,
    creatorName,
    creatorEmail,
  } = req.body;

  if (
    !title ||
    !description ||
    !price ||
    !imageURL ||
    !creatorID ||
    !creatorName ||
    !creatorEmail
  ) {
    return res.status(400).json({
      message: "All Fields are mandatory",
    });
  }

  try {
    let existingCreator = await creatorModel.findOne({ creatorID });
    if (!existingCreator) {
      existingCreator = new creatorModel({
        creatorID,
        creatorName,
        creatorEmail,
        courses: [],
      });
    }

    const newCourse = {
      title,
      description,
      price,
      imageURL,
    };
    existingCreator.courses.push(newCourse);
    await existingCreator.save();
    res.status(201).json({
      message: "Course added successfully",
      course: newCourse,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while adding the course",
      error: error.message,
    });
  }
});

adminRouter.get("/creatorcourses", authenticateJWT, async (req, res) => {
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
    console.log(allCreators);
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

adminRouter.put("/editcourse", authenticateJWT, async (req, res) => {
  const { title, description, price, imageURL, creatorID } = req.body;

  try {
    const existingUser = await creatorModel.findOne({ creatorID });

    if (!existingUser) {
      return res.status(404).json({
        message: "Creator not found",
      });
    }
    const courseIndex = existingUser.courses.findIndex(
      (course) => course.title == title
    );

    if (courseIndex === -1) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // updating the course
    existingUser.courses[courseIndex] = {
      ...existingUser.courses[courseIndex],
      title,
      description,
      price,
      imageURL,
    };

    await existingUser.save();

    return res.status(200).json({
      message: "Course updated successfully",
      course: existingUser.courses[courseIndex],
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while updating the course",
      error: error.message,
    });
  }

  res.status(201).json({
    message: "",
  });
});

adminRouter.delete("/deletecourse", authenticateJWT, async (req, res) => {
  const { creatorID, title } = req.body;
  try {
    const existingUser = await creatorModel.findOne({ creatorID });
    if (!existingUser) {
      return res.status(404).json({
        message: "Creator not found",
      });
    }

    const courseIndex = existingUser.courses.findIndex(
      (course) => course.title == title
    );
    if (courseIndex === -1) {
      return res.status(404).json({
        message: "Course not found",
      });
    }
    existingUser.courses.splice(courseIndex, 1);
    await existingUser.save();
    return res.status(200).json({
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error in deleting the course",
    });
  }
});

module.exports = {
  adminRouter: adminRouter,
};
