const pool = require('../database');

/* ***************************
 *  Add a new review to database
 * ************************** */
async function addReview(inv_id, account_id, review_text, rating) {
  try {
    const sql = `INSERT INTO review 
            (inv_id, account_id, review_text, rating)
            VALUES ($1, $2, $3, $4) RETURNING *`;
    const result = await pool.query(sql, [
      inv_id,
      account_id,
      review_text,
      rating
    ]);
    return result.rows[0];
  } catch (error) {
    console.error('Error adding review: ' + error);
    throw error;
  }
}

/* ***************************
 *  Get all reviews for a specific inventory item
 * ************************** */
async function getReviewsByInventoryId(inv_id) {
  try {
    const sql = `SELECT r.*, a.account_firstname, a.account_lastname
                     FROM review r
                     JOIN account a ON r.account_id = a.account_id
                     WHERE r.inv_id = $1
                     ORDER BY r.created_at DESC`;
    const result = await pool.query(sql, [inv_id]);
    return result.rows;
  } catch (error) {
    console.error('Error getting reviews by inventory ID: ' + error);
    throw error;
  }
}

/* ***************************
 *  Delete his own review
 * ************************** */
async function deleteReview(review_id, account_id) {
  try {
    const sql = 'DELETE FROM review WHERE review_id = $1 AND account_id = $2';
    const result = await pool.query(sql, [review_id, account_id]);
    return result.rowCount > 0; // Returns true if a row was deleted
  } catch (error) {
    console.error('Error deleting review: ' + error);
    throw error;
  }
}

module.exports = {
  addReview,
  getReviewsByInventoryId,
  deleteReview
};
