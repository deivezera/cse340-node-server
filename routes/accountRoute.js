const express = require("express")
const router = new express.Router() 
const accController = require("../controllers/accController")
const regValidate = require("../utilities/account-validation")
const regValidateLogin = require("../utilities/login-validation")


router.get("/login", accController.buildLogin)
router.get("/register", accController.buildRegister)
router.post('/register', regValidate.registrationRules(), regValidate.checkRegData, accController.registerAccount)
router.post("/login", regValidateLogin.loginRules(), regValidateLogin.checkRegData, accController.accountLogin)
module.exports = router;