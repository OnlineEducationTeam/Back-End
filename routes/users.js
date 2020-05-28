const router = require("express").Router();
let User = require("../models/user.model");
const UserSession = require("../models/UserSession");
const ProfessorReview = require("../models/reviews.model");

const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

//file uploading packages

router.route("/findonline").get((req, res) => {
  User.find(
    { _id: req.query.id, professor: true },
    "_id lastName firstName email aboutSelf subject"
  )
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/auth").get((req, res) => {
  res.json(req.sessionStore.sessions);
});

router.route("/signup").post(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { firstName, lastName, email, password, subject } = req.body;
  const professor = Boolean(req.body.professor);
  try {
    let user = await User.findOne({
      email,
    });
    if (user) {
      return res.status(400).json({
        msg: "User Already Exists",
      });
    }

    user = new User({
      firstName,
      lastName,
      email,
      password,
      professor,
      subject,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save().then(() => res.json("User added!"));
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error in Saving");
  }
});

router.route("/signin/:email").get((req, res) => {
  User.findOne({ email: req.params.email })
    .then((user) => {
      if (user.password === req.body.password) {
        console.log("okey");
        return res.json("authenticated");
      }
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

//Login Handle
router.post("/login", passport.authenticate("local"), function (req, res) {
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  // Then you can send your json as response.
  const userSession = new UserSession();
  userSession.userId = req.user._id;
  userSession
    .save()
    .then(() => {
      return res.send({
        token: userSession.userId,
      });
    })
    .catch((err) => res.return(err));
});

router.post("/postreview/:review", (req, res) => {
  const professorReview = new ProfessorReview();
  professorReview.userId = req.query.id;
  professorReview.review = req.query.review;
  professorReview.stars = req.query.stars;
  professorReview
    .save()
    .then(() => {
      return res.send("Review Added");
    })
    .catch((err) => res.return(err));
});

router.get("/whichuser/:session", (req, res) => {
  User.findOne(
    {
      _id: req.query.userId,
    },
    "_id firstName lastName email professor aboutSelf"
  )
    .then((user) => {
      res.json(user);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.post("/updateUser/:id", (req, res) => {
  User.findById(req.query.id)
    .then((user) => {
      user.firstName = req.query.firstName;
      user.lastName = req.query.lastName;
      user.email = req.query.email;
      user.aboutSelf = req.query.aboutSelf;

      user
        .save()
        .then(() => res.json("user updated!"))
        .catch((err) => res.status(400).json("Error :" + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
