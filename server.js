const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const csrf = require("csurf");
const expressSession = require("express-session");

const app = express();
dotenv.config();
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3030;

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Express Session
app.use(
  expressSession({
    secret: "random",
  })
);
app.use(csrf());

const userRoute = require("./routes/routes");
const { urlencoded } = require("express");
app.use("/", userRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
