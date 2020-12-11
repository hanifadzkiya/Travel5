const multer = require("multer");
const crypto = require("crypto");
const path = require("path");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    let customFileName = crypto.randomBytes(18).toString("hex");
    let fileExtension = path.extname(file.originalname).split(".")[1];
    cb(null, customFileName + "." + fileExtension);
  },
});

module.exports = multer({ storage });
