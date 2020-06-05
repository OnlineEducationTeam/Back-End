const mongoose = require("mongoose");

// Σε αυτό το schema δημιουργούμε αντικείμενα για κάθε χρήστη ο οποίος είναι online

const UserSessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: -1,
  },
  timestamp: {
    type: Date,
    default: Date.now(),
  },

  // Η παρακάτω εντολή διαγράφει τον χρήστη μετά από συγκεκριμένη ώρα σε περίπτωση που δεν κάνει logout
  // Προς το παρόν αφήνουμε όποιον έχει κάνει login για να καταφέρουμε να καταλάβουμε καλύτερα την λειτουργικότητα του συστήματος
  // createdAt: { type: Date, expireAfterSeconds: 3600, default: Date.now },
});

module.exports = mongoose.model("UserSession", UserSessionSchema);
