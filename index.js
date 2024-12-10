const express = require("express");
const { adminRouter } = require("./routes/adminRouter");
const { courseRouter } = require("./routes/coursesRouter");
const { userRouter } = require("./routes/userRouter");
const mongoose = require("mongoose");
const PORT_NUMBER = 3000;
const app = express();
app.use(express.json());

// route handles
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);

async function main() {
  try {
    await mongoose.connect(
      "mongodb+srv://ashishsinghk2020:uaqSQU6jgIcMPcBP@cluster0.2gwff.mongodb.net/course-app"
    );
    console.log("Connected to DB");
    app.listen(PORT_NUMBER, () => {
      console.log(`Server is up and running on port number: ${PORT_NUMBER}`);
    });
  } catch (error) {
    console.error("Error connecting to DB:", error);
  }
}

main();
