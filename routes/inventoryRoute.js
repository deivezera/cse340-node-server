const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const regInvValidate = require("../utilities/inventory-validation")
const regClassValidate = require("../utilities/classification-validation")

router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inventory_id", invController.buildByInventoryId)
router.get("/", invController.buildManagement)
router.get("/add-classification", invController.buildAddClassification);
router.get("/add-inventory", invController.buildAddInventory);
router.post("/register/inventory", regInvValidate.registrationRules(), regInvValidate.checkRegData, invController.registerInventory);
router.post("/register/classification", regClassValidate.registrationRules(), regClassValidate.checkRegData, invController.registerClassification);

module.exports = router;