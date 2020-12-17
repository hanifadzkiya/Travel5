const Users = require("../models/user");

const insertTransaction = async (username, jenisTransaksi, detailTransaksi) => {
  return await Users.findOneAndUpdate(
    { username: username },
    { $push: { [jenisTransaksi]: detailTransaksi } },
    { new: true }
  );
};

module.exports = {
  insertTransaction,
};
