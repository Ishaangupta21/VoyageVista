const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const expressError = require("../utils/expressError.js");
const Listing = require("../models/listing.js");
const { isLoggedin, isOwner } = require("../middleware.js");
const controllerListing = require("../controllers/listings.js");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new expressError(400, error);
  } else {
    next();
  }
};

//index Route
router.get("/", wrapAsync(controllerListing.index));

//New Route

router.get("/new", isLoggedin, wrapAsync(controllerListing.newListing));

// Show Route
router.get(
  "/:id",
  wrapAsync(controllerListing.showListing)
);

// Create Route

router.post(
  "/",
  isLoggedin,
  validateListing,
  wrapAsync(controllerListing.createListing)
);

//edit Route
router.get(
  "/:id/edit",
  isLoggedin,
  isOwner,
  wrapAsync(controllerListing.editListing)
);

//update Route

router.put(
  "/:id",
  isLoggedin,
  isOwner,
  validateListing,
  wrapAsync(controllerListing.updateListing)
);

//delete route

router.delete(
  "/:id",
  isLoggedin,
  isOwner,
  wrapAsync(controllerListing.deleteListing)
);

module.exports = router;
