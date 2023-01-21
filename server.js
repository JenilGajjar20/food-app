require("dotenv").config();
const express = require("express");
const path = require("path");
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("express-flash");
const MongoStore = require("connect-mongo");
const passport = require("passport");

// Creating an express app
const app = express();

const url = process.env.MONGO_URI;
mongoose.connect(url, {});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Database Connected");
});

// Session Store
let mongoStore = new MongoStore({ mongoUrl: url, collection: "sessions" });

// Session Config
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.use(flash());

// Assets
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Passport config
const passportInit = require("./app/config/passport");
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

// Global middleware
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});

// Set the template engine
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

// Require Routes
// Passing 'app' as an parameter to the function.
require("./routes/web")(app);

// Define a PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started at port http://localhost:${PORT}`);
});
