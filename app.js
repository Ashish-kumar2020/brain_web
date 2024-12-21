const express = require("express");
const PORT_NUMBER = 3000;
const app = express();
const mongoose = require("mongoose");
const { adminRouter } = require("./Route/adminRoute");
const { userRouter } = require("./Route/userRouter");
const { courseRouter } = require("./Route/coursesRoute");
app.use(express.json());

// Routes Handler
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);

async function main() {
  try {
    await mongoose.connect(
      "mongodb+srv://ashishsinghk2020:uaqSQU6jgIcMPcBP@cluster0.2gwff.mongodb.net/course-app"
    );
    console.log("Connected to DB");
    app.listen(PORT_NUMBER, () => {
      console.log(`Server is up and running on Port Number : ${PORT_NUMBER}`);
    });
  } catch (error) {
    console.error("Error connecting to DB :", error);
  }
}

main();
