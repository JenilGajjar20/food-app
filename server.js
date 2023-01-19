const express = require("express");
const path = require("path");
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");

// Creating an express app
const app = express();

app.use(express.static("public"));

// Set the template engine
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

// Assets
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/cart", (req, res) => {
  res.render("customers/cart");
});

app.get("/login", (req, res) => {
  res.render("auth/login");
});

app.get("/register", (req, res) => {
  res.render("auth/register");
});

// Define a PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started at port http://localhost:${PORT}`);
});
