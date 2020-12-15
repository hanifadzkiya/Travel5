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
    //required: true
  },
  start_date:  {
    type: Date,
    //required: true
  },
  end_date:  {
    type: Date,
    //required: true
  },
}, {
  timestamps: true
});

const transactionTempatWisataSchema = new Schema({
  idTempatWisata:  {
    type: mongoose.Schema.Types.ObjectId,
    //ref: 'TempatWisata'
  },
  totalTransaksi:  {
      type: Number,
      //required: true
  },
  start_date:  {
    type: Date,
    //required: true
  },
  end_date:  {
    type: Date,
    //required: true
  },
}, {
  timestamps: true
});

const transactionPaketWisataSchema = new Schema({
  idPaketWisata:  {
    type: mongoose.Schema.Types.ObjectId,
    //ref: 'PaketWisata'
  },
  totalTransaksi:  {
      type: Number,
      //required: true
  },
  start_date:  {
    type: Date,
    //required: true
  },
  end_date:  {
    type: Date,
    //required: true
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
        min: 5,
        required: true,
    },
    foto: {
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
