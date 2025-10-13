const { body, validationResult } = require('express-validator');

/* ***************************
 *  Validation rules for reviews
 * ************************** */
const reviewRules = () => [
  body('review_text')
    .trim()
    .notEmpty()
    .withMessage('Review text is required.')
    .isLength({ min: 5 })
    .withMessage('Review must be at least 5 characters.'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be a number between 1 and 5.')
];

/* ***************************
 *  Middleware to check validation results
 * ************************** */
const checkReviewData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await require('../utilities').getNav();
    return res.render('review/add-review', {
      title: 'Add Review',
      nav,
      inv_id: req.params.inventoryId,
      errors,
      review_text: req.body.review_text,
      rating: req.body.rating
    });
  }
  next();
};

module.exports = {
  reviewRules,
  checkReviewData
};
