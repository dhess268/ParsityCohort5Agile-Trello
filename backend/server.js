const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const connectDB = require("./config/db");
const passport = require("passport");
const cookieSession = require("cookie-session");
const session = require("express-session");
const mainRoutes = require("./routes/main");
const testRoutes = require("./routes/test");
const boardRoutes = require("./routes/boards");
const orgRoutes = require("./routes/organization");
const userRoutes = require("./routes/users");
const app = express();

connectDB();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(bodyParser.json());
// app.use(passport.initialize());
// app.use(passport.session());
// main routes for login/logout
app.use("/", mainRoutes);
// test routes for adding testing data
app.use("/test", testRoutes);
app.use("/boards", boardRoutes);
app.use("/organization", orgRoutes);
app.use("/user", userRoutes);

module.exports = app.listen(8000, () => {
  console.log(`Node.js listening on port 8000`);
});
