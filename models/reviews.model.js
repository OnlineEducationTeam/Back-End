const mongoose = require("mongoose");

// Δημιουργούμε το schema (μπορεί κανείς για ευκολία να το θεωρήσει κλάση) των reviews για την βάση μας.

const ProfessorReviewShcema = new mongoose.Schema({
  userId: {
    type: String,
    default: -1,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now(),
  },
  review: {
    type: String,
    default: false,
  },
  stars: {
    type: String,
    trim: true,
    default: "0",
  },
});

module.exports = mongoose.model("ProfessorReview", ProfessorReviewShcema);
