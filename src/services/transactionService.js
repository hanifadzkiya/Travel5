const Users = require("../models/user");

const emailUtil = require("../util/email-util");
const qrcodeUtil = require("../util/qrcode-utils");
const commonUtil = require("../util/commonUtil");
const paymentService = require("../services/payment-service");
const insertTransaction = async (username, jenisTransaksi, detailTransaksi) => {
  const result = await Users.findOneAndUpdate(
    { username: username },
    { $push: { [jenisTransaksi]: detailTransaksi } },
    { new: true }
  );
  const transactionId =
    result.transactionPaketWisata[result.transactionPaketWisata.length - 1]._id;
  const route = {
    transactionPaketWisata: "tour",
    transactionTempatWisata: "destination",
    transactionHotel: "hotel",
  };
  const url = `http://${commonUtil.getPublicIp()}/${
    route[jenisTransaksi]
  }/detail/${username}/${transactionId}`;
  const qrcode = await qrcodeUtil.generate(
    "http://127.0.0.1:3000/tour/detail/hanifadzkiya/5fdc9f443b1fefbc2d3aa0c7"
  );
  result.qrcode = qrcode;
  console.log("HSHSHS");
  const urlPayment = await paymentService.createPaymentUrl(
    { amount: 10000 },
    {
      first_name: result.user,
      last_name: result.username,
      email: result.email,
      phone: result.phone,
    }
  );
  emailUtil.sendEmail(result.email, "Your Package is Ready", `Please pay your bill in <a href="${urlPayment}"> here </a>`);
  // console.log(`<img src="${qrcode}" width="500" height="600">`);
  return result;
};

module.exports = {
  insertTransaction,
};
