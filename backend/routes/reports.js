const router = require("express").Router();
const ctrl = require("../controllers/reportsController");

router.get("/weekly", ctrl.getWeekly);

module.exports = router;
