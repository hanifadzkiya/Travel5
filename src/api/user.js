const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fileUpload = require('express-fileupload');

const userService = require("../services/userService");
const response = require("../util/response");
const emailUtil = require("../util/email-util");
const commonUtil = require("../util/commonUtil");
const fs = require("fs");
const ejs = require("ejs");

const userRouter = express.Router();
//const upload = require("../util/multer");
const jwtService = require("../services/jwtService");
const mailSender = require("../services/mailSender");
const otpService = require("../services/otpService");

var otp;

userRouter.use(fileUpload());
userRouter
  .route("/login")
  .post(async (req, res, next) => {
    try {
      const result = await userService.getByUsername(req.body.username);
      if (result == null || !result.isVerified) {
        response.responseFailed(res, 401, "Login failed");
        return;
      }
      var hasil = await bcrypt.compare(req.body.password, result.password);
      if (hasil == false) {
        response.responseFailed(res, 401, "Login failed");
        return;
      }
      const token = generateAccessToken({
        username: result.username,
        role: result.role,
        name: result.name,
        email: result.email,
        phone_number: result.phone_number,
      });

      response.responseSuccess(res, { _token: token + "" });
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

userRouter
  .route("/register")
  .post(async (req, res, next) => {
    try {
      var salt = await bcrypt.genSalt(10);
      var hash = await bcrypt.hash(req.body.password, salt);
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

userRouter
  .route("/register/:token")
  .post(async (req, res, next) => {
    try {
      //add foto
      const token = req.params.token;
      const result = await userService.verifyRegister(token);
      if (result == null) {
        response.responseFailed(
          res,
          401,
          "Unauthorized, failed to process request"
        );
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

userRouter
  .route("/profile")
  .put(jwtService.authenticateTokenUser, async (req, res, next) => {
    //user dan admin
    try {
      if (req.body.password != null) {
        var salt = await bcrypt.genSalt(10);
        var hash = await bcrypt.hash(req.body.password, salt);
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
  });

userRouter
  .route("/forgetpassword/:username")
  .get(async (req, res, next) => {
    try {
      const result = await userService.getByUsername(req.params.username);
      if (result == null) {
        response.responseFailed(res, 404, "Username not found");
        return;
      }
      const token = generateAccessToken({
        username: result.username,
        reset_password: 1,
      });

      mailSender.kirimEmail(
        result.email,
        "http://127.0.0.1:3000/resetPassword/" + token
      );

      response.responseSuccess(res, {
        message: "Email sent to " + result.email,
      });
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  })
  .put(async (req, res, next) => {
    response.responseFailed(res, 404, "Not Found");
  })
  .post(async (req, res, next) => {
    response.responseFailed(res, 404, "Not Found");
  })
  .delete(async (req, res, next) => {
    response.responseFailed(res, 404, "Not Found");
  });

//post transaksi paket wisata
//post transaksi tempat wisata
userRouter
  .route("/resetPassword/:token")
  .post(jwtService.authenticateTokenResetPassword, async (req, res, next) => {
    try {
      var data = jwt.verify(req.params.token, process.env.TOKEN_SECRET);
      const result = await userService.getByUsername(data.username);
      if (result == null) {
        response.responseFailed(res, 404, "Username not found");
        return;
      }
      if (req.body.password != null) {
        var salt = await bcrypt.genSalt(10);
        var hash = await bcrypt.hash(req.body.password, salt);
        req.body.password = hash;
      }
      const newPassword = await userService.update(data.username, req.body);
      response.responseSuccess(res, newPassword);
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

sendRegisterEmailVerification = async (user) => {
  const token = generateAccessToken({
    username: user.username,
    command: "register",
  });
  const verifyLink = `http://${commonUtil.getPublicIp()}/register/${token}`;
  const emailContent = await ejs.renderFile(
    "./src/view/email-verification.ejs",
    { user: user.username, verifyLink }
  );

  emailUtil.sendEmail(
    user.email,
    "Welcome to Traveldung ! Please Register Your Email ..",
    emailContent
  );
};

userRouter
  .route("/login/otp/:username")
  .post(async (req, res, next) => {
    if (!req.session.otp) {
      response.responseFailed(res, 404, "OTP expired");
    }
    if (
      req.body.otp == req.session.otp &&
      req.params.username == req.session.username
    ) {
      req.session.otp = "";
      req.session.username = "";
      const result = await userService.getByUsername(req.params.username);
      const token = generateAccessToken({
        username: result.username,
        role: result.role,
        name: result.name,
        email: result.email,
        phone_number: result.phone_number,
      });
      response.responseSuccess(res, { _token: token + "" });
    } else {
      response.responseFailed(res, 404, "OTP incorrect");
    }
    console.log(req.session.otp);
  })

  .get(async (req, res, next) => {
    try {
      const result = await userService.getByUsername(req.params.username);
      otp = Math.random();
      otp = otp * 10000;
      otp = parseInt(otp) + "";
      otpService.sendOtp(result.phone_number, otp);
      req.session.otp = otp;
      req.session.username = result.username;
      response.responseSuccess(res, {
        message: "otp sent to " + result.phone_number,
      });
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  })

  .put(async (req, res, next) => {
    response.responseFailed(res, 404, "Not Found");
  })

  .delete(async (req, res, next) => {
    response.responseFailed(res, 404, "Not Found");
  });

//jwt
function generateAccessToken(username) {
  // expires after half and hour (1800 seconds = 30 minutes)
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: "1800s" });
}

module.exports = userRouter;
