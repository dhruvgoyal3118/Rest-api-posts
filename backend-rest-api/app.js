const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");
const multer = require("multer");
// const { Server } = require("socket.io");
const URI =
  "mongodb+srv://dhruv:delhi880@cluster0.vdse5qw.mongodb.net/messages?retryWrites=true&w=majority";



const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == -"image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else cb(null, false);
};

const app = express();
// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>

app.use(bodyParser.json()); // application/json

app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
  }).single("image")
);

app.use("/images", express.static(path.join(__dirname, "images")));

//its needed as we are connecting two different domains 8080 and 3000
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With,socket.io"
  );
  next();
});

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(URI)
  .then(() => {
    console.log("Database Connected Vamos!");
    const server = app.listen(8080, () => {
      console.log("server started 8080 port.");
    });

    const io = require('./socket').init(server);
    io.on('connection', (socket) => {
      console.log("connected via socket");
    });
  })
  .catch((err) => {
    console.log(err);
    next(err);
  });
