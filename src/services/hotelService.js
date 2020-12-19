const publicIp = require("public-ip");

const config = require("../config/config");
const hotels = require("../models/hotels");
const Hotels = require("../models/hotels");
const fileUtils = require("../util/fileUtils");
const commonUtils = require("../util/commonUtil");
const { ObjectId } = require("mongodb");

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
  if (hotel == null) {
    return null;
  }
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

const addReview = async (id, review) => {
  const hotel = await Hotels.findOne({
    _id: id,
    reviews: { $elemMatch: { userId: review.userId } },
  });
  if (hotel != null) {
    throw new Error("User is already review");
  }
  return await Hotels.findOneAndUpdate(
    { _id: id },
    { $push: { reviews: review } },
    { new: true }
  );
};

const deleteAllReviews = async (id) => {
  return await Hotels.update({ _id: id }, { $set: { reviews: [] } });
};

const getReviewUserInHotel = async (hotelId, userId) => {
  const hotel = await get(hotelId);
  if (hotel == null) {
    return null;
  }
  const review = hotel.reviews.filter((x) => (x.userId = userId));
  if (review.length == 0) {
    return null;
  }
  return review[0];
};

const deleteReviewInHotelByUser = async (hotelId, userId) => {
  return await Hotels.findByIdAndUpdate(
    hotelId,
    { $pull: { reviews: { userId: userId } } },
    { new: true }
  );
};

const updateReviewInHotelByUser = async (hotelId, userId, newReview) => {
  console.log(ObjectId.isValid(userId));
  const hotel = await Hotels.findById({ _id: hotelId });
  if (hotel == null) {
    return null;
  }
  hotel.reviews.map((review) => {
    if (review.userId != userId) {
      return review;
    }
    newReview._id = review._id;
    newReview.userId = userId;
    newReview.rating = newReview.rating || review.rating;
    newReview.review = newReview.review || review.review;
    return newReview;
  });

  const result = await hotel.save();
  return newReview;
};

module.exports = {
  getAll,
  add,
  deleteAll,
  get,
  update,
  deleteById,
  addReview,
  deleteAllReviews,
  getReviewUserInHotel,
  deleteReviewInHotelByUser,
  updateReviewInHotelByUser,
};
