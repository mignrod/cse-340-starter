const express = require('express');
const router = new express.Router();
const reviewController = require('../controllers/reviewController');
const utilities = require('../utilities');
const reviewValidate = require('../utilities/review-validation');

// Show add review form
router.get(
  '/add/:inventoryId',
  utilities.checkLogin,
  utilities.handleErrors(reviewController.buildAddReview)
);

// Process the add review
router.post(
  '/add/:inventoryId',
  utilities.checkLogin,
  reviewValidate.reviewRules(),
  reviewValidate.checkReviewData,
  utilities.handleErrors(reviewController.addReview)
);

// Delete reviews
router.post(
  '/delete/:reviewId',
  utilities.checkLogin,
  utilities.handleErrors(reviewController.deleteReview)
);

module.exports = router;
