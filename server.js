const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const MemoryStore = require("memorystore")(expressSession);
const passport = require("passport");
const flash = require("connect-flash");
const path = require("path");
const bodyParser = require("body-parser");
const multer = require("multer");
// const fileUpload = require("express-fileupload");

const app = express();
dotenv.config();

connectDB();

// file upload

// let dateTime = new Date();
// const offset = dateTime.getTimezoneOffset();
// dateTime = new Date(dateTime.getTime() - offset * 60 * 1000);
// dateTime = dateTime.toISOString().split("T")[0];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, "file-" + new Date().getTime() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

app.use(
  multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 125000 * 100 },
  }).single("images")
);

const PORT = process.env.PORT || 3030;

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Cookie
app.use(cookieParser("random"));

// Express Session
app.use(
  expressSession({
    secret: "random",
    resave: true,
    saveUninitialized: false,
    maxAge: 60 * 1000,
    store: new MemoryStore({
      checkPeriod: 86400000, //expired after 24h
    }),
  })
);

app.use(csrf({ cookie: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  next();
});

const { urlencoded } = require("express");
const { session } = require("passport");

const userRoute = require("./routes/userRouter");
const fileUploadRouter = require("./routes/fileRouter");
app.use("/", userRoute);
app.use("/file-upload", fileUploadRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
