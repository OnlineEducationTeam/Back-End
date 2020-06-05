const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Εδώ δημιουργούμε τα schema για τους χρήστες. Όταν γίνεται εγγραφή ενός νέου χρήστη,
// στην ουσία δημιουργούμε ένα αντικείμενο αυτού με τα δεδομένα που απαιτούνται παρακάτω.

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      unique: false,
      trim: true,
      minlength: 3,
      maxlength: 25,
    },
    lastName: {
      type: String,
      required: true,
      unique: false,
      trim: true,
      minlength: 3,
      maxlength: 25,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    aboutSelf: {
      type: String,
      default: "",
    },
    professor: {
      type: Boolean,
      default: false,
    },
    subject: {
      type: String,
      default: "",
    },
  },

  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
