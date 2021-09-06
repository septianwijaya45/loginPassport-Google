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

const app = express();
dotenv.config();
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

const userRoute = require("./routes/routes");
app.use("/", userRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
