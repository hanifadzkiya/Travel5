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
    result[jenisTransaksi][result[jenisTransaksi].length - 1]._id;
  const route = {
    transactionPaketWisata: "tour",
    transactionTempatWisata: "destination",
    transactionHotel: "hotel",
  };
  const url = `http://${commonUtil.getPublicIp()}/transaction/${
    route[jenisTransaksi]
  }/detail/${username}/${transactionId}`;
  const qrcode = await qrcodeUtil.generate(url);
  console.log(qrcode);
  Object.assign(result, { qrcode: qrcode });
  const urlPayment = await paymentService.createPaymentUrl(
    { amount: 10000 },
    {
      first_name: result.user,
      last_name: result.username,
      email: result.email,
      phone: result.phone,
    }
  );
  require("fs").writeFileSync(
    `public/images/${transactionId}.png`,
    qrcode.replace(/^data:image\/png;base64,/, ""),
    "base64"
  );
  const urlImage = `http://${commonUtil.getPublicIp()}/images/${transactionId}.png`;
  emailUtil.sendEmail(
    result.email,
    "Your Package is Ready",
    `Please pay your bill in <a href="${urlPayment}"> here </a> Qr code : <img src="${urlImage}" height="400" width="400"/>`
  );
  return result;
};

module.exports = {
  insertTransaction,
};
