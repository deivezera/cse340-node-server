const { body, validationResult } = require("express-validator");
const validate = {};

// Validation middleware
validate.reviewRules = () => {
  return [
    body("inv_id").trim().escape().notEmpty().isInt({ min: 1 }).withMessage("Invalid vehicle."),
    body("rating")
      .trim()
      .escape()
      .notEmpty()
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5."),
    body("review_text")
      .trim()
      .escape()
      .isLength({ min: 5, max: 1000 })
      .withMessage("Review must be 5-1000 characters."),
  ]
}

validate.checkReviewData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    req.flash("notice", errors.array()[0]?.msg || "Invalid input")
    return res.redirect(`/inv/detail/${req.body.inv_id}`)
  }
  next()
}

module.exports = validate

