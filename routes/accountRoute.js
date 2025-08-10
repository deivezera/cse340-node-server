const express = require("express")
const router = new express.Router() 
const accController = require("../controllers/accController")
const regValidate = require("../utilities/account-validation")
const regValidateLogin = require("../utilities/login-validation")
const utilities = require("../utilities/");


router.get("/login", accController.buildLogin)
router.get("/register", accController.buildRegister)
router.post('/register', regValidate.registrationRules(), regValidate.checkRegData, accController.registerAccount)
router.post("/login", regValidateLogin.loginRules(), regValidateLogin.checkRegData, accController.accountLogin)
router.get("/logout", accController.logout)
router.get("/", utilities.checkLogin, accController.buildManagement)
router.get("/edit/", accController.getEditAccount)
router.post("/update/", regValidate.updateRules(), regValidate.checkUpdateData, accController.updateAccount)

module.exports = router;