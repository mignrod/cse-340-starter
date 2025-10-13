const reviewModel = require('../models/review-model');
const utilities = require('../utilities/');

/* ***************************
 *  Show add review form
 * ************************** */
async function buildAddReview(req, res, next) {
  let nav = await utilities.getNav();
  const inv_id = req.params.inventoryId;
  res.render('review/add-review', {
    title: 'Add Review',
    nav,
    inv_id,
    errors: null
  });
}

/* ***************************
 *  Process add review
 * ************************** */
async function addReview(req, res, next) {
  let nav = await utilities.getNav();
  const inv_id = req.params.inventoryId;
  const { review_text, rating } = req.body;
  const account_id = req.session.account_id;
  try {
    await reviewModel.addReview(inv_id, account_id, review_text, rating);
    req.flash('success', 'Your review was added successfully.');
    res.redirect(`/inv/detail/${inv_id}`);
  } catch (error) {
    req.flash('error', 'There was an error adding your review.');
    res.status(500).render('review/add-review', {
      title: 'Add Review',
      nav,
      inv_id,
      errors: null,
      review_text,
      rating
    });
  }
}

/* ***************************
 *  Delete review (optional)
 * ************************** */
async function deleteReview(req, res, next) {
  const review_id = req.params.reviewId;
  const inv_id = req.body.inv_id;
  const account_id = req.session.account_id;
  try {
    const result = await reviewModel.deleteReview(review_id, account_id);
    if (result) {
      req.flash('notice', 'Review deleted.');
    } else {
      req.flash('notice', 'Unable to delete review.');
    }
    res.redirect(`/inv/detail/${inv_id}`);
  } catch (error) {
    req.flash('notice', 'Error deleting review.');
    res.redirect(`/inv/detail/${inv_id}`);
  }
}

module.exports = {
  buildAddReview,
  addReview,
  deleteReview
};
