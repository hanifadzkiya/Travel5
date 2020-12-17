const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const publicIp = require("public-ip");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    let customFileName = crypto.randomBytes(18).toString("hex");
    let fileExtension = path.extname(file.originalname).split(".")[1];
    cb(null, customFileName + "." + fileExtension);
  },
});

const multerUtil = multer({ storage });

const deleteFile = (file) => {
  const filePath = path.resolve(process.cwd(), `public/images/${file}`);
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
