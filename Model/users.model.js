const mongoose = require("mongoose");
const validator = require("validator");
const userRoles = require("../utils/userRoles");

const usersSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "This field must be an email"],
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  role: {
    type: String,
    enum: [userRoles.ADMIN, userRoles.MANGER, userRoles.USER],
    default: userRoles.USER,
  },
  avatar: {
    type: String,
    default: "uploads/profile.jpg",
  },
});

module.exports = mongoose.model("Users", usersSchema);
