const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const publicIp = require("public-ip");
const config = require("../config/config");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${config.STATIC_PATH}/images`);
  },
  filename: function (req, file, cb) {
    let customFileName = crypto.randomBytes(18).toString("hex");
    let fileExtension = path.extname(file.originalname).split(".")[1];
    cb(null, customFileName + "." + fileExtension);
  },
});

const multerUtil = multer({ storage });

const deleteFile = (file) => {
  const filePath = `${config.STATIC_PATH}/images/${file}`;
  console.log(`Download file in ${filePath}`);
  try {
    fs.unlinkSync(filePath);
  } catch (err) {
    console.log(`Error when delete file err : ${filePath}`);
  }
};

buildFileAddress = (publicIp, file) => {
  return `http://${publicIp}/images/${file}`;
};

module.exports = {
  multer: multerUtil,
  deleteFile,
  buildFileAddress,
};
