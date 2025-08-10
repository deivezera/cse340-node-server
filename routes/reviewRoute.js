const express = require("express")
const router = new express.Router()
const reviewController = require("../controllers/reviewController")
const utilities = require("../utilities/")
const regReviewValidation = require("../utilities/review-validation")

router.post("/add", utilities.checkLogin, regReviewValidation.reviewRules(), regReviewValidation.checkReviewData, reviewController.addReview)

module.exports = router


