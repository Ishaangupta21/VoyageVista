const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedin, isReviewAuthor } = require("../middleware.js");

const controllerReview = require("../controllers/reviews.js");

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new expressError(400, error);
  } else {
    next();
  }
};

router.post(
  "/",
  isLoggedin,
  validateReview,
  wrapAsync(controllerReview.postReview)
);

router.delete(
  "/:reviewId",
  isLoggedin,
  isReviewAuthor,
  wrapAsync(controllerReview.destroyReview)
);

module.exports = router;
