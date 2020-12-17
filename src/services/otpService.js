const axios = require("axios");
const config = require("../config/config");

const sendOtp = async (nomor, otp) => {
  var paramOtp = {
    userkey: process.env.OTP_USER,
    passkey: process.env.OTP_KEY,
    to: nomor,
    kode_otp: otp,
  };
  await axios.post(process.env.OTP_API_ENDPOINT, paramOtp);
};
module.exports = {
  sendOtp,
};
