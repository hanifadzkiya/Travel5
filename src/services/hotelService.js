const hotels = require("../models/hotels");
const Hotels = require("../models/hotels");

const getAll = async () => {
  return await Hotels.find();
};

const add = async (hotel) => {
  const newHotel = new Hotels(hotel);
  return newHotel.save();
};

const deleteAll = async () => {
  return await Hotels.remove();
};

const get = async (id) => {
  return await Hotels.findById(id);
};

const update = async (id, hotel) => {
  return await Hotels.findByIdAndUpdate(id, { $set: hotel }, { new: true });
};

const deleteById = async (id) => {
  return await Hotels.findByIdAndDelete(id);
};

module.exports = {
  getAll,
  add,
  deleteAll,
  get,
  update,
  deleteById,
};
