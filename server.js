const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
var session = require("express-session");
var multer = require("multer");
const fs = require("fs");

require("dotenv").config();

const app = express();

require("./config/passport")(passport);

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/*Upload, Download and View Files */
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/");
  },
  filename: function (req, file, cb) {
    var filename = file.originalname;
    cb(null, req.query.id + "_" + filename);
  },
});

var upload = multer({ storage: storage }).single("file");

app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).send(req.file);
  });
});

app.get("/display/:id", (req, res) => {
  var id = req.query.id;
  var filess = [];
  var filePath = "./public/"; // Or format the path using the `id` rest param
  fs.readdir(filePath, (err, files) => {
    files.forEach((file) => {
      var res = file.split("_");
      if (res[0] == id) {
        var file1 = file.replace(res[0] + "_", "");
        filess.push(file1);
      }
    });
    res.send(filess);
  });
});

app.get("/download/:id", (req, res) => {
  var id = req.query.id;
  var filename = req.query.fileName;
  var filepath = "./public/";
  const fileToSend = filepath + id + "_" + filename;
  res.download(fileToSend);
});

/*Upload Photos  */
var storagePhotos = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./photos/");
  },
  filename: function (req, file, cb) {
    var filename = file.originalname;
    console.log(filename);
    var ending = filename.split(".");
    var and = ending[ending.length - 1];
    cb(null, req.query.id);
  },
});

var uploadPhotos = multer({ storage: storagePhotos }).single("file");

app.post("/uploadPhoto", (req, res) => {
  uploadPhotos(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).send(req.file);
  });
});

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/* connect to DB*/
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established succesfully");
});
//Express Session
app.use(
  session({
    cookie: {
      path: "/",
      maxAge: 360000,
    },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const usersRouter = require("./routes/users");
app.use("/users", usersRouter);

// Socket.io
var server = require("http").createServer(app);
var io = require("socket.io")(server);

io.on("connection", (socket) => {
  socket.on("roomMessage", (info) => {
    console.log(info);
    socket.broadcast.to(info.room).emit("roomMessage", info);
  });

  socket.on("connected", (info) => {
    console.log("The user " + info.nam + " wants to talk to " + info.name);
    var person = info.name;
    socket.broadcast.emit(person, info.nam);
  });

  socket.on("join", (info) => {
    socket.join(info.userRoom);
    console.log(info.nf + " joined room " + info.userRoom);
  });

  /* Video call config */
  socket.on("videoConnection", (info) => {
    console.log(
      "The user " + info.nam + " wants to video chat with " + info.name
    );
    var person = info.name;
    socket.broadcast.emit(person + "video", info.nam);
  });
});

/*Access photos from FrontEnd*/
app.use("/photos", express.static(__dirname + "/photos"));

server.listen(port, () => {
  console.log("Server listens on port: " + port);
});

// app.listen(port, () => {
//   console.log("Server is running on port: " + port);
// });
