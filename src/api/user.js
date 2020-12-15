const express = require("express");
const bcrypt = require("bcrypt");

const userService = require("../services/userService");
const response = require("../util/response");
const emailUtil = require("../util/email-util");
const commonUtil = require("../util/commonUtil");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const ejs = require("ejs");

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

      user.isVerified = false;
      const users = await userService.add(user);

      sendRegisterEmailVerification(req.body);
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

  userRouter.route("/register/:token")
  .post(async (req, res, next) => {
    try {
      //add foto
      const token = req.params.token;
      const result = await userService.verifyRegister(token);
      if (result == null) {
        response.responseFailed(res, 401, "Unauthorized, failed to process request");
        return;
      }
      response.responseSuccess(res, result);
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

sendRegisterEmailVerification = async (user) => {
  const token = generateAccessToken({
    username : user.username,
    "command": "register"
  });
  const verifyLink = `http://${commonUtil.getPublicIp()}/register/${token}`;
  const emailContent = await ejs.renderFile(
    "./src/view/email-verification.ejs",
    { user: user.username, verifyLink }
  );
    
  emailUtil.sendEmail(user.email, "Welcome to Traveldung ! Please Register Your Email ..", emailContent);
}

  //post transaksi paket wisata
  //post transaksi tempat wisata

//jwt
function generateAccessToken(username) {
  // expires after half and hour (1800 seconds = 30 minutes)
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

module.exports = userRouter;
