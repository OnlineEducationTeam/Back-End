const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
    //creates a new user schema with the necessary fields of user
  {
    firstName: {
      type: String,
      required: true,
      unique: false,
      trim: true,
      minlength: 5,
      maxlength: 25
    },
    lastName: {
      type: String,
      required: true,
      unique: false,
      trim: true,
      minlength: 5,
      maxlength: 25
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true
    },
    password: {
      type: String,
      trim: true,
      required: true
    },
    aboutSelf: {
      type: String,
      default: ""
    },
    professor: {
      type: Boolean,
      default: false
    },
    subject: {
      type: String,
      default: ""
    }
  },

  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
