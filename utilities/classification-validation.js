const utilities = require(".")
const { body, validationResult } = require("express-validator")
const inventoryModel = require("../models/inventory-model")
const validate = {}

/*  ****************************************************
*  Registration new Classification Data Validation Rules
* ***************************************************** */
validate.registrationRules = () => {
  return [
    // valid classification name is required and cannot already exist in the DB
    body("classification_name")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("A valid name is required.")
    .custom(async (classification_name) => {
      const classificationExists = await inventoryModel.checkExistingClassification(classification_name)
      if (classificationExists){
        throw new Error("Classification already exists. Please register another one")
      }
    }),
  ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      errors,
      title: "New Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

module.exports = validate