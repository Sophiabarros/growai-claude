const router = require("express").Router();
const ctrl = require("../controllers/settingsController");

router.get("/notifications", ctrl.getNotifications);
router.patch("/notifications", ctrl.updateNotifications);

module.exports = router;
