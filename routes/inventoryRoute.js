const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const regInvValidate = require("../utilities/inventory-validation")
const regClassValidate = require("../utilities/classification-validation")
const utilities = require("../utilities")

router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inventory_id", invController.buildByInventoryId)
router.get("/", utilities.checkLogin, invController.buildManagement)
router.get("/add-classification", invController.buildAddClassification);
router.get("/add-inventory", invController.buildAddInventory);
router.get("/getInventory/:classification_id", invController.getInventoryJSON)
router.get("/edit/:inventory_id", invController.getEditInventory)
router.post("/register/inventory", regInvValidate.registrationRules(), regInvValidate.checkInventoryData, invController.registerInventory);
router.post("/register/classification", regClassValidate.registrationRules(), regClassValidate.checkRegData, invController.registerClassification);
router.post("/update/", regInvValidate.updateRules(), regInvValidate.checkUpdateData, invController.updateInventory)

module.exports = router;