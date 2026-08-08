const router = require("express").Router();
const ctrl = require("../controllers/suggestionsController");

router.get("/", ctrl.list);
router.patch("/:id/apply", ctrl.apply);

module.exports = router;
