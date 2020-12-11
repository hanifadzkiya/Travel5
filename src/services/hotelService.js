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

module.exports = {
  getAll,
  add,
  deleteAll,
};
