const Users = require("../models/user");

const getAll = async () => {
  return await Users.find();
};

//register
const add = async (user) => {
  const newUser = new Users(user);
  return newUser.save();
};

const deleteAll = async () => {
  return await Users.remove();
};

//login
const getByUsername = async (username) => {
  return await Users.findOne({ 'username' : username });
};

//edit profile
const update = async (username, user) => {
  return await Users.findOneAndUpdate({'username': username}, { $set: user }, { new: true });
};

const deleteByUsername = async (username) => {
  return await Users.findOneAndRemove({ 'username' : username });
};

const insertTransactionHotel = async (username, transaksihotel) => {
  return await Users.findOneAndUpdate({'username': username},{ $push : {transactionHotel : transaksihotel}}, {new: true});
}


module.exports = {
  getAll,
  add,
  deleteAll,
  getByUsername,
  update,
  deleteByUsername,
  insertTransactionHotel,
};
