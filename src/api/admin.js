const express = require("express");
const bcrypt = require("bcrypt");

const userService = require("../services/userService");
const response = require("../util/response");

const adminRouter = express.Router();

adminRouter
  .route("/register")
  //register for admin
  .post(async (req, res, next) => {
    try {
      //add foto
      var file = req.files.foto;
      var ext = file.name.split(".").pop();
      file.name = Date.now() + "." + ext;
      await file.mv("./public/images/" + file.name);
      req.body.foto = file.name;
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
  .get(async (req, res, next) => {
    response.responseFailed(res, 404, "Not Found");
  })
  .put(async (req, res, next) => {
    response.responseFailed(res, 404, "Not Found");
  })
  .delete(async (req, res, next) => {
    response.responseFailed(res, 404, "Not Found");
  });

/*adminRouter.route("/login")
//login for admin
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
      response.responseSuccess(res, result);
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
  })*/

adminRouter
  .route("/user")
  .put(async (req, res, next) => {
    response.responseFailed(res, 404, "Not Found");
  })
  //get all user
  .get(async (req, res, next) => {
    //admin
    try {
      const users = await userService.getAll();
      response.responseSuccess(res, users);
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  })
  //delete all user
  .delete(async (req, res, next) => {
    //admin
    try {
      const result = await userService.deleteAll();
      response.responseSuccess(res, result);
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  })
  .post(async (req, res, next) => {
    response.responseFailed(res, 404, "Not Found");
  });

adminRouter
  .route("/user/:username")
  //update for admin
  .put(async (req, res, next) => {
    //admin
    try {
      if (req.body.password != null) {
        var salt = await bcrypt.genSalt(10);
        var hash = await bcrypt.hash(req.body.password, salt);
        req.body.password = hash;
      }
      const result = await userService.update(req.params.username, req.body);
      if (result == null) {
        response.responseFailed(res, 404, "User not found");
        return;
      }
      response.responseSuccess(res, result);
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  })
  //get by username
  .get(async (req, res, next) => {
    //admin
    try {
      const result = await userService.getByUsername(req.params.username);
      if (result == null) {
        response.responseFailed(res, 404, "User not found");
        return;
      }
      response.responseSuccess(res, result);
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  })
  //delete user by username
  .delete(async (req, res, next) => {
    //admin
    try {
      const result = await userService.deleteByUsername(req.params.username);
      if (result == null) {
        response.responseFailed(res, 404, "User not found");
        return;
      }
      response.responseSuccess(res, result);
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  })
  .post(async (req, res, next) => {
    response.responseFailed(res, 404, "Not Found");
  });

module.exports = adminRouter;
