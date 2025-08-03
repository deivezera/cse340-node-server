const express = require("express")
const router = new express.Router() 
const accController = require("../controllers/accController")
const regValidate = require("../utilities/account-validation")

router.get("/login", accController.buildLogin)
router.get("/register", accController.buildRegister)
router.post('/register', regValidate.registrationRules(), regValidate.checkRegData, accController.registerAccount)
router.post("/login", regValidate.loginRules(), regValidate.checkLoginData, accController.accountLogin)
module.exports = router;