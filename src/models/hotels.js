const mongoose = require("mongoose");

const Schema = mongoose.Schema;
require("mongoose-currency").loadType(mongoose);

const roomSchema = Schema({
  type: String,
  price: mongoose.Types.Currency,
  facility: [String],
});

const reviewSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  rating: Number,
  review: String,
});

const hotelSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    }, // String is shorthand for {type: String}
    address: String,
    lat: Number,
    long: Number,
    room: [roomSchema],
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Hotel", hotelSchema);
