const mongoose = require("mongoose");
const User = mongoose.model("User");
const passport = require("passport");

exports.validateSignup = (req, res, next) => {
  /**sanitize to protect from virus */
  req.sanitizeBody("name");
  req.sanitizeBody("email");
  req.sanitizeBody("password");

  /**name field non-null and between 4 and 15 chars */
  req.checkBody("name", "Enter a name").notEmpty();
  req
    .checkBody("name", "Name must be between 4 and 15 characters.")
    .isLength({ min: 4, max: 15 });

  /**email non null and must be email */
  req
    .checkBody("email", "Enter a valid email.")
    .isEmail()
    .normalizeEmail();

  /**name field non-null and between 4 and 15 chars */
  req.checkBody("password", "Enter a password").notEmpty();
  req
    .checkBody("password", "Password must be between 4 and 15 characters.")
    .isLength({ min: 4, max: 10 });

  /**handle errors */
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map(err => err.msg)[0];
    return res.status(400).send(firstError);
  }

  next();
};

exports.signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await new User({ name, email, password });
  await User.register(user, password, (err, user) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json(user.name);
  });
};

exports.signin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(400).send(err.message);
    }

    if (!user) {
      return res.status(500).send(info.message);
    }

    req.login(user, err => {
      if (err) {
        return res.status(500).send(err.message);
      }
      res.json(user);
    });
  })(req, res, next);
};

exports.signout = (req, res, next) => {
  res.clearCookie("next-connect.sid");
  req.logout();
  res.json({ message: "You have successfully logged out." });
};

exports.checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/signin");
  return;
};
