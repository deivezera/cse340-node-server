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
    const classificationSelect = await utilities.buildClassificationList();
    res.render("./inventory/management", {
      title: "Management",
      nav,
      classificationSelect,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0]?.inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
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
      req?.body?.classification_id
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

invCont.getEditInventory = async function (req, res, next) {
  try {
    const { inventory_id } = req.params;
    let invId = parseInt(inventory_id);
    let nav = await utilities.getNav();
    const {
      inv_id,
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
    } = await invModel.getDetailByInventoryId(invId);
    const classification = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classification,
      errors: null,
      inv_id,
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
    });
  } catch (error) {
    next(error);
  }
};

invCont.getDeleteInventory = async function (req, res, next) {
  try {
    const { inventory_id } = req.params;
    let invId = parseInt(inventory_id);
    let nav = await utilities.getNav();
    const {
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
    } = await invModel.getDetailByInventoryId(invId);
    const itemName = `${inv_make} ${inv_model}`;
    res.render("./inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
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
      classification_id
    );

    const classification = await utilities.buildClassificationList(
      req?.body?.classification_id
    );

    if (regResult) {
      const classificationSelect = await utilities.buildClassificationList();
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${inv_make} ${inv_model}.`
      );
      res.status(200).render("./inventory/management", {
        title: "New Vehicle",
        nav,
        errors: null,
        classificationSelect,
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

invCont.updateInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const {
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body;
    const updateResult = await invModel.updateInventory(
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    );

    if (updateResult) {
      const itemName = updateResult.inv_make + " " + updateResult.inv_model;
      req.flash("notice", `The ${itemName} was successfully updated.`);
      res.redirect("/inv/");
    } else {
      const classification = await utilities.buildClassificationList(
        classification_id
      );
      const itemName = `${inv_make} ${inv_model}`;
      req.flash("notice", "Sorry, the insert failed.");
      res.status(501).render("inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classification,
        errors: null,
        inv_id,
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
      });
    }
  } catch (error) {
    next(error);
  }
};

invCont.deleteInventory = async function (req, res, next) {
  try {
    const {
      inv_id,
      inv_make,
      inv_model
    } = req.body;
    const deletedResult = await invModel.deleteInventory(
      inv_id
    );

    if (deletedResult) {
      const itemName = inv_make + " " + inv_model;
      req.flash("notice", `The ${itemName} was successfully deleted.`);
      res.redirect("/inv/");
    } else {
      req.flash("notice", "Sorry, the deletion failed.");
      res.status(501).render("/inv/");
    }
  } catch (error) {
    next(error);
  }
};


module.exports = invCont;
