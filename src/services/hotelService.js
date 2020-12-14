const publicIp = require("public-ip");

const config = require("../config/config");
const hotels = require("../models/hotels");
const Hotels = require("../models/hotels");
const fileUtils = require("../util/fileUtils");
const commonUtils = require("../util/commonUtil");

const getAll = async () => {
  const hotels = await Hotels.find();
  let ip = await commonUtils.getPublicIp();
  for (const hotel of hotels) {
    hotel.photos = hotel.photos.map((photo) =>
      fileUtils.buildFileAddress(ip, photo)
    );
  }
  return hotels;
};

const add = async (hotel) => {
  const newHotel = new Hotels(hotel);
  const result = await newHotel.save();
  let ip = await commonUtils.getPublicIp();
  result.photos = result.photos.map((photo) =>
    fileUtils.buildFileAddress(ip, photo)
  );
  return result;
};

const deleteAll = async () => {
  const hotels = await Hotels.find();
  for (const hotel of hotels) {
    for (const photo of hotel.photos) {
      fileUtils.deleteFile(photo);
    }
  }
  return await Hotels.remove();
};

const get = async (id) => {
  const hotel = await Hotels.findById(id);
  let ip = await commonUtils.getPublicIp();
  hotel.photos = hotel.photos.map((photo) =>
    fileUtils.buildFileAddress(ip, photo)
  );
  return hotel;
};

const update = async (id, updateHotel) => {
  const hotel = await Hotels.findById(id);
  if (hotel == null) {
    return null;
  }
  if (updateHotel.photos != null) {
    for (const photo of hotel.photos) {
      fileUtils.deleteFile(photo);
    }
  }
  const result = await Hotels.findByIdAndUpdate(
    id,
    { $set: updateHotel },
    { new: true }
  );
  let ip = await commonUtils.getPublicIp();
  result.photos = result.photos.map((photo) =>
    fileUtils.buildFileAddress(ip, photo)
  );
  return result;
};

const deleteById = async (id) => {
  const hotel = await Hotels.findByIdAndDelete(id);
  if (hotel == null) {
    return null;
  }
  for (const photo of hotel.photos) {
    fileUtils.deleteFile(photo);
  }
  return hotel;
};

module.exports = {
  getAll,
  add,
  deleteAll,
  get,
  update,
  deleteById,
};
