const express = require("express")
const router = new express.Router() 
const accController = require("../controllers/accController")

router.get("/login", accController.buildLogin);

module.exports = router;