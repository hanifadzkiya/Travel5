const mongoose = require("mongoose");

const Schema = mongoose.Schema;
require("mongoose-currency").loadType(mongoose);
var Currency = mongoose.Types.Currency;

var reviewSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

var destinationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    lat: Number,
    long: Number,
    images: [String],
    price: {
      type: Currency,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
    },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Destination", destinationSchema);
