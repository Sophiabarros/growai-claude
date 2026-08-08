const router = require("express").Router();
const ctrl = require("../controllers/stationsController");

router.get("/", ctrl.list);
router.post("/", ctrl.create);
router.get("/:id", ctrl.getOne);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);
router.get("/:id/readings/latest", ctrl.getLatestReading);
router.get("/:id/photos/latest", ctrl.getLatestPhoto);

module.exports = router;
