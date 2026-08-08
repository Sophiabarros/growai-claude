const router = require("express").Router();
const ctrl = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");
const { uploadAvatar } = require("../config/upload");

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);
router.get("/me", requireAuth, ctrl.me);
// requireAuth runs first so config/upload.js can name the file using req.user.id
router.put("/me", requireAuth, uploadAvatar.single("avatar"), ctrl.updateMe);

module.exports = router;
