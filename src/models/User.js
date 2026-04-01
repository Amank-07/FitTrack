const mongoose = require("mongoose");

const USER_ROLES = ["viewer", "analyst", "admin"];
const USER_STATUS = ["active", "inactive"];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: "viewer"
    },
    status: {
      type: String,
      enum: USER_STATUS,
      default: "active"
    }
  },
  { timestamps: true }
);

module.exports = {
  User: mongoose.model("User", userSchema),
  USER_ROLES,
  USER_STATUS
};
