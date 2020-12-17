var express = require("express");
const helloWorld = require("../services/index");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send(helloWorld());
});

module.exports = router;
