const express = require("express");
const path = require("path");
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");

// Creating an express app
const app = express();

// Assets
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home");
});

// Set the template engine
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

// Define a PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started at port http://localhost:${PORT}`);
});
