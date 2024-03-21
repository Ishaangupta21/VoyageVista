const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const controllerUser=require("../controllers/users");

router.get("/signup", wrapAsync(controllerUser.newSignup));

router.post(
  "/signup",
  wrapAsync(controllerUser.postSignup)
);

router.get("/login", (req, res) => {
  res.render("./users/login.ejs");
});

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Welome back to Voyage Vista");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }
);


router.get("/logout",controllerUser.Logout);

module.exports = router;
