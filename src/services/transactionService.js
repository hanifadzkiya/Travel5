const Users = require("../models/user");

const emailUtil = require("../util/email-util");
const qrcodeUtil = require("../util/qrcode-utils");
const commonUtil = require("../util/commonUtil");
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
  // emailUtil.sendEmail(result.email, "Your Package is Ready", `<img src="${qrcode}" width="500" height="600">`);
  // console.log(`<img src="${qrcode}" width="500" height="600">`);
  return result;
};

module.exports = {
  insertTransaction,
};
