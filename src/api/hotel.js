const express = require("express");

const hotelService = require("../services/hotelService");
const response = require("../util/response");

const hotelRouter = express.Router();

hotelRouter
  .route("/")
  .get(async (req, res, next) => {
    try {
      const hotels = await hotelService.getAll();
      response.responseSuccess(res, hotels);
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  })
  .post(async (req, res, next) => {
    try {
      const hotel = req.body;
      const hotels = await hotelService.add(hotel);
      response.responseSuccess(res, hotels);
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  })
  .put(async (req, res, next) => {
    response.responseFailed(res, 404, "Not Found");
  })
  .delete(async (req, res, next) => {
    try {
      const result = await hotelService.deleteAll();
      response.responseSuccess(res, result);
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  });

module.exports = hotelRouter;
