const mongoose = require("mongoose");

const Schema = mongoose.Schema;
require("mongoose-currency").loadType(mongoose);

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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
