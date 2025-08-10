const pool = require("../database/")

/* *****************************
 * Create a new review for an inventory item
 * ***************************** */
async function addReview(inv_id, account_id, rating, review_text) {
  try {
    const sql = `
      INSERT INTO public.review (inv_id, account_id, rating, review_text)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `
    const result = await pool.query(sql, [inv_id, account_id, rating, review_text])
    return result.rows[0]
  } catch (error) {
    return new Error("Error creating review")
  }
}

/* *****************************
 * Get reviews by inventory id (with reviewer name)
 * ***************************** */
async function getReviewsByInventoryId(inv_id) {
  try {
    const sql = `
      SELECT r.review_id, r.inv_id, r.account_id, r.rating, r.review_text, r.created_at,
             a.account_firstname, a.account_lastname
      FROM public.review AS r
      JOIN public.account AS a ON r.account_id = a.account_id
      WHERE r.inv_id = $1
      ORDER BY r.created_at DESC
    `
    const result = await pool.query(sql, [inv_id])
    return result.rows
  } catch (error) {
    return []
  }
}

module.exports = { addReview, getReviewsByInventoryId }


