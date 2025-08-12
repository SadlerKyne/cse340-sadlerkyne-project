const pool = require("../database/");

/* *****************************
 * Add a new review
 * *************************** */
async function addReview(review_text, inv_id, account_id) {
  try {
    const sql =
      "INSERT INTO public.reviews (review_text, inv_id, account_id) VALUES ($1, $2, $3) RETURNING *";
    const data = await pool.query(sql, [review_text, inv_id, account_id]);
    return data.rows[0];
  } catch (error) {
    console.error("addReview error: " + error);
    return new Error("Error adding review");
  }
}

/* *****************************
 * Get all reviews for a specific inventory item
 * *************************** */
async function getReviewsByInventoryId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT r.review_text, r.review_date, a.account_firstname, a.account_lastname
       FROM public.reviews r
       JOIN public.account a ON r.account_id = a.account_id
       WHERE r.inv_id = $1
       ORDER BY r.review_date DESC`,
      [inv_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getReviewsByInventoryId error: " + error);
    return new Error("Error getting reviews");
  }
}

/* *****************************
 * Get all reviews by account id
 * *************************** */
async function getReviewsByAccountId(account_id) {
  try {
    const data = await pool.query(
      `SELECT r.review_id, r.review_text, r.review_date, i.inv_make, i.inv_model
       FROM public.reviews r
       JOIN public.inventory i ON r.inv_id = i.inv_id
       WHERE r.account_id = $1
       ORDER BY r.review_date DESC`,
      [account_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getReviewsByAccountId error: " + error);
    return new Error("Error getting reviews");
  }
}

/* ***************************
 * Get a single review by review_id
 * ************************** */
async function getReview(review_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.reviews WHERE review_id = $1",
      [review_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getReview error: " + error);
    return new Error("Error getting review");
  }
}

/* ***************************
 * Update a review
 * ************************** */
async function updateReview(review_id, review_text) {
  try {
    const sql =
      "UPDATE public.reviews SET review_text = $1 WHERE review_id = $2 RETURNING *";
    const data = await pool.query(sql, [review_text, review_id]);
    return data.rows[0];
  } catch (error) {
    console.error("updateReview error: " + error);
    return new Error("Error updating review");
  }
}

/* ***************************
 * Delete a review
 * ************************** */
async function deleteReview(review_id) {
  try {
    const sql = "DELETE FROM public.reviews WHERE review_id = $1";
    const data = await pool.query(sql, [review_id]);
    return data;
  } catch (error) {
    console.error("deleteReview error: " + error);
    return new Error("Error deleting review");
  }
}


module.exports = {
  addReview,
  getReviewsByInventoryId,
  getReviewsByAccountId,
  getReview,
  updateReview,
  deleteReview,
};