const fs = require("fs");
const path = require("path");
const multer = require("multer");

const AVATARS_DIR = path.join(__dirname, "..", "uploads", "avatars");
fs.mkdirSync(AVATARS_DIR, { recursive: true });

const ALLOWED_TYPES = { "image/png": ".png", "image/jpeg": ".jpg", "image/webp": ".webp" };

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, AVATARS_DIR),
  filename: (req, file, cb) => {
    var ext = ALLOWED_TYPES[file.mimetype];
    cb(null, `user-${req.user.id}-${Date.now()}${ext}`);
  },
});

const uploadAvatar = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_TYPES[file.mimetype]) {
      return cb(new Error("Formato de imagem não suportado (use PNG, JPG ou WEBP)"));
    }
    cb(null, true);
  },
});

module.exports = { uploadAvatar, AVATARS_DIR };
