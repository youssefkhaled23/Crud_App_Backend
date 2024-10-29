const express = require("express");
const usersController = require("../Controllers/Users.controller");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();
const multer = require("multer");
const appError = require("../utils/appError");
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Uploads");
  },
  filename: function (req, file, cb) {
    if (!file) {
      return cb(new appError("No file provided", 400));
    }

    const ext = file.mimetype.split("/")[1];
    const fileName = `user-${Date.now()}${ext}`;

    cb(null, fileName);
  },
});
const fileFilter = (req, file, cb) => {
  const imageType = file.mimetype.split("/")[0];
  if (imageType === "image") {
    cb(null, true);
  } else {
    cb(new appError("Invalid Image Type", 400), false);
  }
};
const upload = multer({ storage: diskStorage, fileFilter });

router.get("/users", verifyToken, usersController.getAllUsers);
router.post("/register", upload.single("avatar"), usersController.register);
router.post("/login", usersController.login);

module.exports = router;
