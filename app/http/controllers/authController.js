const User = require("../../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");

function authController() {
  return {
    login(req, res) {
      res.render("auth/login");
    },
    createLogin(req, res, next) {
      passport.authenticate("local", (err, user, info) => {
        if (err) {
          req.flash("error", info.message);
          return next(err);
        }

        if (!user) {
          req.flash("error", info.message);
          return res.redirect("/login");
        }

        req.logIn(user, (err) => {
          if (err) {
            req.flash("error", info.message);
            return next(err);
          }
          return res.redirect("/");
        });
      })(req, res, next);
    },
    register(req, res) {
      res.render("auth/register");
    },
    async createAccount(req, res) {
      const { name, email, password } = req.body;

      // If any field is empty
      if (!name || !email || !password) {
        req.flash("error", "All fields are required");
        req.flash("name", name);
        req.flash("email", email);

        return res.redirect("/register");
      }

      // If email already exists
      User.exists({ email: email }, (err, result) => {
        if (result) {
          req.flash("error", "Email already exists");
          req.flash("name", name);
          req.flash("email", email);

          return res.redirect("/register");
        }
      });

      // Password Hashing
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      // Create a new user
      const user = new User({
        name,
        email,
        password: hashedPassword,
      });

      user
        .save()
        .then(() => {
          return res.redirect("/login");
        })
        .catch((err) => {
          req.flash("error", "Something went wrong. Try again.");
          return res.redirect("/register");
        });
    },
    logout(req, res, next) {
      req.logout(function (err) {
        if (err) {
          return next(err);
        }
        return res.redirect("/login");
      });
    },
  };
}

module.exports = authController;
