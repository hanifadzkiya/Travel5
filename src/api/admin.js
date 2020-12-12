const express = require("express");
const bcrypt = require("bcrypt");

const userService = require("../services/userService");
const response = require("../util/response");

const adminRouter = express.Router();

adminRouter.route("/register")
  .post(async (req, res, next) => {
    try {
      var salt = await bcrypt.genSalt(10);
      var hash = await bcrypt.hash(req.body.password, salt);
      req.body.password = hash;
      req.body.role = 1;
      const user = req.body;
      const users = await userService.add(user);
      response.responseSuccess(res, users);
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  })

  .put(async (req, res, next) => {
    response.responseFailed(res, 404, "Not Found");
  })

  .get(async (req, res, next) => {
    response.responseFailed(res, 404, "Not Found");
  })

  .delete(async (req, res, next) => {
    response.responseFailed(res, 404, "Not Found");
  });

  //login admin
  //update admin
  //delete admin by username
  //delete all admin
  //get all
  //get user by username
  //delet all username
  //delet user by username
  //update user

  module.exports = adminRouter;