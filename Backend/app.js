const express = require("express");
require("dotenv").config();
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
    await mongoose.connect(process.env.MONGO_DB_AUTH_URL);
    console.log("Connected to DB");
    app.listen(PORT_NUMBER, () => {
      console.log(`Server is up and running on Port Number : ${PORT_NUMBER}`);
    });
  } catch (error) {
    console.error("Error connecting to DB :", error);
  }
}

main();
