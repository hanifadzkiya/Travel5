const express = require("express");
const bcrypt = require("bcrypt");

const userService = require("../services/userService");
const response = require("../util/response");
const jwtService = require("../services/jwtService");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");

userRouter.route("/login")
  .post(async (req, res, next) => {
    try {
      const result = await userService.getByUsername(req.body.username);
      if (result == null) {
        response.responseFailed(res, 404, "Login failed");
        return;
      }
      var hasil = await bcrypt.compare(req.body.password, result.password)
      if (hasil == false){
        response.responseFailed(res, 404, "Login failed");
        return;
      } 
      const token = generateAccessToken({
        'username' : result.username,
        'role' : result.role,
        'name' : result.name,
        'email' : result.email,
        'phone_number' : result.phone_number
      });

      response.responseSuccess(res, {'_token' : token+""});

    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  })

  .get(async (req, res, next) => {
    response.responseFailed(res, 404, "Not Found");
  })

  .put(async (req, res, next) => {
    response.responseFailed(res, 404, "Not Found");
  })

  .delete(async (req, res, next) => {
    response.responseFailed(res, 404, "Not Found");
  })

userRouter.route("/register")
  .post(async (req, res, next) => {
    try {
      var salt = await bcrypt.genSalt(10);
      var hash = await bcrypt.hash(req.body.password,salt);
      req.body.password = hash;
      req.body.role = 0;
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

userRouter.route("/profile")
  .put(async (req, res, next) => { //user dan admin
    try {
      if(req.body.password != null){
        var salt = await bcrypt.genSalt(10);
        var hash = await bcrypt.hash(req.body.password,salt);
        req.body.password = hash;
      }
      const result = await userService.update(req.body.username, req.body);
      if (result == null) {
        response.responseFailed(res, 404, "User not found");
        return;
      }
      response.responseSuccess(res, result);
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  })

//jwt
function generateAccessToken(username) {
  // expires after half and hour (1800 seconds = 30 minutes)
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

module.exports = userRouter;
