const publicIp = require("public-ip");

const config = require("../config/config");
const Destinations = require("../models/destinationSchema");
const fileUtils = require("../util/fileUtils");
const commonUtils = require("../util/commonUtil");

const getAll = async () => {
  const destinations = await Destinations.find();
  let ip = await commonUtils.getPublicIp();
  for (const destination of destinations) {
    destination.images = fileUtils.buildFileAddress(ip, destination.images)
  }
  return destinations;
};

const add = async (destination) => {
  const newDestination = new Destinations(destination);
  const result = await newDestination.save();
  let ip = await commonUtils.getPublicIp();
  result.images = fileUtils.buildFileAddress(ip, result.images);
  return result;
};

const get = async (id) => {
  const destination = await Destinations.findById(id);
  let ip = await commonUtils.getPublicIp();
  destination.images = fileUtils.buildFileAddress(ip, destination.images);
  return destination;
};

const update = async (id, updateDestination) => {
  const destination = await Destinations.findById(id);
  if (destination == null) {
    return null;
  }
  if (updateDestination.images != null) {
    for (const image of destination.images) {
      fileUtils.deleteFile(image);
    }
  }
  const result = await Destinations.findByIdAndUpdate(
    id,
    { $set: updateDestination },
    { new: true }
  );
  let ip = await commonUtils.getPublicIp();
  result.image = fileUtils.buildFileAddress(ip, result.image);
  return result;
};

const deleteById = async (id) => {
  const destination = await Destinations.findByIdAndDelete(id);
  if (destination == null) {
    return null;
  }
  for (const image of destination.images) {
    fileUtils.deleteFile(image);
  }
  return destination;
};

module.exports = {
  getAll,
  add,
  get,
  update,
  deleteById,
};
