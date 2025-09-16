const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");
const express = require("express");
const router = express.Router({mergeParams: true});
const {listingSchema,reviewSchema} = require("../schema.js");
const {isLoggedIn,isReviewAuthor} = require("../middleware");
const reviewController = require("../controllers/review.js");



const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg );
    } else {
        next();
    }
}


router.post("/",validateReview,isLoggedIn,wrapAsync(reviewController.createReview));

//Delete Review Route

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;