const mongoose = require("mongoose");
const Schema = mongoose.Schema;

require("mongoose-currency").loadType(mongoose);

const hotelSchema = new Schema({
  hotelId: {
    type: mongoose.Types.ObjectId,
    require: true,
  },
  roomId: {
    type: mongoose.Types.ObjectId,
    require: true,
  },
  start_date: Date,
  end_date: Date,
});

const tempatwisataSchema = new Schema({
  tempat_wisataId: {
    type: mongoose.Types.ObjectId,
    require: true,
  },
  start_date: Date,
  end_date: Date,
});

const reviewSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  rating: Number,
  review: String,
});

const paketwisataSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    total_price: mongoose.Types.Currency,
    hotels: {
      type: [hotelSchema],
      required: true,
    },
    tempat_wisata: {
      type: [tempatwisataSchema],
      required: true,
    },
    reviews: [reviewSchema],
    hits: Number
  },
  {
    timestamps: true,
  }
);

var PaketWisata = mongoose.model(
  "paketwisata",
  paketwisataSchema,
  "paketwisata"
);
module.exports = PaketWisata;
