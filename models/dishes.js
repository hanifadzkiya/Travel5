const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;
 
var reviewSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
   timestamps: true 
});

var destinationSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    lat: Number,
    long: Number,
    image: String,
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true
    },
    reviews: [reviewSchema]
}, {
    timestamps: true
});
 
var Dishes = mongoose.model('Dish', destinationSchema);
 
module.exports = Dishes;