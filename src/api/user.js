const express = require("express");
const bcrypt = require("bcrypt");

const userService = require("../services/userService");
const response = require("../util/response");
const fs = require("fs");

const userRouter = express.Router();
//const upload = require("../util/multer");
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
  })

userRouter.route("/register")
  .post(async (req, res, next) => {
    try {
      //add foto
      var file = req.files.foto;
      var ext = file.name.split(".").pop();
      file.name = Date.now() + '.'+ext;
      await file.mv('./public/images/'+file.name);
      req.body.foto = file.name;      
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
  .put(async (req, res, next) => {
    try {
      const user = await userService.getByUsername(req.body.username);
      if(req.files !== null){
        const filePath = './public/images/'+user.foto;
        fs.unlinkSync(filePath);
        //add foto
        var file = req.files.foto;
        var ext = file.name.split(".").pop();
        file.name = Date.now() + '.'+ext;
        await file.mv('./public/images/'+file.name);
        req.body.foto = file.name ;   
      }else{
        req.body.foto = user.foto;
      }
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

userRouter.route("/:username/transaksihotel")
//post transaksi hotel
  .post(async (req, res, next) => {
    try {
      const result = await userService.getByUsername(req.params.username);
      if (result == null) {
        response.responseFailed(res, 404, "User not found");
        return;
      }
      const transaksi = await userService.insertTransactionHotel(req.params.username, req.body)
      response.responseSuccess(res, transaksi);
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  })

  //post transaksi paket wisata
  //post transaksi tempat wisata


module.exports = userRouter;
