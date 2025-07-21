const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const AppError = require('../utilities/AppError')
const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch (error) {
    next(error)
  }
}

invCont.buildByInventoryId = async function (req, res , next) {
  try {
    const inventory_id = req.params.inventory_id
    const data = await invModel.getDetailByInventoryId(inventory_id)
    if(!data) {
      return next(new AppError("Oh no! We couldn't find your car.", 404))
    } else {
      const page = await utilities.buildDetailPage(data)
      let nav = await utilities.getNav()
      const title = `${data.inv_year} ${data.inv_make} ${data.inv_model}`
      res.render("./inventory/detail", {
        title,
        nav,
        page,
      })
    }
  } catch (error) {
    next(error)
  }
}

module.exports = invCont