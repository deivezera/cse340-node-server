const express = require("express")
const router = new express.Router() 
const accController = require("../controllers/accController")
const regValidate = require("../utilities/account-validation")

router.get("/login", accController.buildLogin)
router.get("/register", accController.buildRegister)
router.post('/register', regValidate.registationRules(), regValidate.checkRegData, accController.registerAccount)
router.post("/login", (req, res) => {
  res.status(200).send('login process')
})

module.exports = router;