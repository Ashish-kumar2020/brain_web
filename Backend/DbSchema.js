const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const userSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
});

const adminSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
  creatorID: ObjectId,
});

const courseSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  imageURL: String,
});

const creatorSchema = new Schema({
  creatorID: ObjectId,
  creatorName: String,
  creatorEmail: String,
  courses: [courseSchema],
});

const purchaseSchema = new Schema({
  userID: ObjectId,
  courseID: ObjectId,
});

const userModel = mongoose.model("user", userSchema);
const adminModel = mongoose.model("admin", adminSchema);
const courseModel = mongoose.model("course", courseSchema);
const purchaseModel = mongoose.model("purchase", purchaseSchema);
const creatorModel = mongoose.model("Creator", creatorSchema);

module.exports = {
  userModel,
  adminModel,
  courseModel,
  purchaseModel,
  creatorModel,
};
