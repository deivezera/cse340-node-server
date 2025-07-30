const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const AppError = require("../utilities/AppError");
const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(
      classification_id
    );
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    });
  } catch (error) {
    next(error);
  }
};

invCont.buildByInventoryId = async function (req, res, next) {
  try {
    const inventory_id = req.params.inventory_id;
    const data = await invModel.getDetailByInventoryId(inventory_id);
    if (!data) {
      return next(new AppError("Oh no! We couldn't find your car.", 404));
    } else {
      const page = await utilities.buildDetailPage(data);
      let nav = await utilities.getNav();
      const title = `${data.inv_year} ${data.inv_make} ${data.inv_model}`;
      res.render("./inventory/detail", {
        title,
        nav,
        page,
      });
    }
  } catch (error) {
    next(error);
  }
};

invCont.buildManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("./inventory/management", {
      title: "Management",
      nav,
    });
  } catch (error) {
    next(error);
  }
};

invCont.buildAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
      title: "New Classification",
      nav,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

invCont.buildAddInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const classification = await utilities.buildClassificationList(
      req?.body?.classification_name
    );
    res.render("./inventory/add-inventory", {
      title: "New Inventory",
      nav,
      classification,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

/* ****************************************
 *  Process Registration Inventory
 * *************************************** */
invCont.registerInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const {
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body;
    const regResult = await invModel.registerInventory(
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    );

    const classification = await utilities.buildClassificationList(
      req?.body?.classification_id
    );

    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${inv_make} ${inv_model}.`
      );
      res.status(200).render("./inventory/management", {
        title: "New Vehicle",
        nav,
        errors: null,
      });
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      res.status(501).render("./inventory/add-inventory", {
        title: "New Vehicle",
        nav,
        classification,
        errors: null,
      });
    }
  } catch (error) {
    next(error);
  }
};

/* ****************************************
 *  Process Registration
 * *************************************** */
invCont.registerClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body;
    const regResult = await invModel.registerClassification(
      classification_name
    );
    let nav = await utilities.getNav();

    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${classification_name}.`
      );
      res.status(200).render("./inventory/add-classification", {
        title: "New Classification",
        nav,
        errors: null,
      });
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      res.status(501).render("./inventory/add-classification", {
        title: "New Classification",
        nav,
        errors: null,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = invCont;
