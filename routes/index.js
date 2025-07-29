const router = require('express').Router();
const baseController = require("../controllers/baseController")

router.use("/inv", require('./inventoryRoute'))
router.get('/', baseController.buildHome)

module.exports = router;
