const utilities = require("../utilities/")
const reviewModel = require("../models/review-model")

/* ****************************************
 *  Add review (POST)
 * *************************************** */
async function addReview(req, res, next) {
  try {
    const nav = await utilities.getNav()
    const { inv_id, rating, review_text } = req.body
    const account_id = res.locals?.accountData?.account_id

    // Must be logged in
    if (!account_id) {
      req.flash("notice", "Please log in to leave a review.")
      return res.redirect(`/inv/detail/${inv_id}`)
    }

    const created = await reviewModel.addReview(
      parseInt(inv_id),
      parseInt(account_id),
      parseInt(rating),
      review_text?.trim() || ""
    )

    if (created?.review_id) {
      req.flash("notice", "Thanks for your review!")
      return res.redirect(`/inv/detail/${inv_id}`)
    }

    req.flash("notice", "Could not save your review. Please try again.")
    return res.redirect(`/inv/detail/${inv_id}`)
  } catch (error) {
    next(error)
  }
}

module.exports = { addReview }


