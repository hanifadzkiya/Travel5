const mongoose = require("mongoose");

const Schema = mongoose.Schema;
require("mongoose-currency").loadType(mongoose);

const transactionHotelSchema = new Schema({
  idHotel:  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'hotel'
    //harus required
  },
  totalTransaksi:  {
      type: Number,
      required: true
  },
}, {
  timestamps: true
});

const transactionTempatWisataSchema = new Schema({
  idTempatWisata:  {
    type: mongoose.Schema.Types.ObjectId,
    //ref: 'hotel'
  },
  totalTransaksi:  {
      type: Number,
      required: true
  },
}, {
  timestamps: true
});

const transactionPaketWisataSchema = new Schema({
  idPaketWisata:  {
    type: mongoose.Schema.Types.ObjectId,
    //ref: 'hotel'
  },
  totalTransaksi:  {
      type: Number,
      required: true
  },
}, {
  timestamps: true
});

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    }, 
    name: {
        type: String,
        required: true,
    }, 
    email: {
        type: String,
        required: true,
        unique: true
    }, 
    phone_number: {
        type: String,
        required: true,
        unique: true
    }, 
    password: {
        type: String,
        required: true,
    }, 
    role: {
        type: Boolean,
        required: true,
    }, 
    transactionHotel:[transactionHotelSchema],
    transactionTempatWisata:[transactionTempatWisataSchema],
    transactionPaketWisata:[transactionPaketWisataSchema]
  },{
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
