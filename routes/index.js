const router = require('express').Router();
const baseController = require("../controllers/baseController")

router.use("/inv", require('./inventoryRoute'))
router.use("/account", require('./accountRoute'))
router.use("/reviews", require('./reviewRoute'))
router.get('/', baseController.buildHome)

module.exports = router;
