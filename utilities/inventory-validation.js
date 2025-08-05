const utilities = require(".")
const { body, validationResult } = require("express-validator")
const inventoryModel = require("../models/inventory-model")
const validate = {}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */

validate.checkInventoryData = async (req, res, next) => {
  let errors = []
  const body = req.body
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    const classification = await utilities.buildClassificationList(
      req?.body?.classification_id
    );
    let nav = await utilities.getNav()
    res.render("./inventory/add-inventory", {
      errors,
      title: "New Vehicle",
      classification,
      nav,
    })
    return
  }
  next()
}

/* ******************************
 * Check data and return errors or continue to updating
 * ***************************** */

validate.checkUpdateData = async (req, res, next) => {
  let errors = []
  const body = req.body
  console.log(body)
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    const classification = await utilities.buildClassificationList(
      body?.classification_id
    );
    let nav = await utilities.getNav()
    const itemName = `${body.inv_make} ${body.inv_model}`
    res.render("./inventory/edit-inventory", {
      errors,
      title: `Edit ${itemName}`,
      classification,
      nav,
      inv_id: body.inv_id
    })
    return
  }
  next()
}
/*  ****************************************************
*  Update Inventory Data Validation Rules
* ***************************************************** */
validate.updateRules = () => {
  return [
    body("inv_id")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("A valid id is required"),
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("A valid make is required"),
    
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("A valid model is required"),

    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 4, max: 4 })
      .withMessage("A valid year is required"),

    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("A valid description is required"),

    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("A valid description is required"),

    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("A valid miles is required"),

    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("A valid color is required"),

    // valid classification name is required and cannot already exist in the DB
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("A valid classification is required.")
  ]
}


/*  ****************************************************
*  Registration new Inventory Data Validation Rules
* ***************************************************** */
validate.registrationRules = () => {
  return [
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("A valid make is required"),
    
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("A valid model is required"),

    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 4, max: 4 })
      .withMessage("A valid year is required"),

    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("A valid description is required"),

    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("A valid description is required"),

    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("A valid miles is required"),

    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("A valid color is required"),

    // valid classification name is required and cannot already exist in the DB
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("A valid classification is required.")
  ]
}

module.exports = validate