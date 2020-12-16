const express = require("express");

const fileUtils = require("../util/fileUtils");
const hotelService = require("../services/hotelService");
const response = require("../util/response");

const hotelRouter = express.Router();

hotelRouter
  .route("/:id")
  .get(async (req, res, next) => {
    try {
      const result = await hotelService.get(req.params.id);
      if (result == null) {
        response.responseFailed(res, 404, "Hotel not found");
        return;
      }
      response.responseSuccess(res, result);
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  })
  .post(async (req, res, next) => {
    response.responseFailed(res, 404, "Not Found");
  })
  .put(fileUtils.multer.array("photos"), async (req, res, next) => {
    try {
      console.log(`Update hotel : ${JSON.stringify(req.body)}`);
      body = req.body;
      console.log(body.room);
      const hotel = {
        name: body.name,
        room: JSON.parse(body.room),
        address: body.address,
        photos: req.files.map((file) => file.filename),
      };
      const result = await hotelService.update(req.params.id, hotel);
      if (result == null) {
        response.responseFailed(res, 404, "Hotel not found");
        return;
      }
      response.responseSuccess(res, result);
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const result = await hotelService.deleteById(req.params.id);
      if (result == null) {
        response.responseFailed(res, 404, "Hotel not found");
        return;
      }
      response.responseSuccess(res, result);
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  });

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
  .post(fileUtils.multer.array("photos"), async (req, res, next) => {
    try {
      const body = req.body;
      const hotel = {
        name: body.name,
        room: JSON.parse(body.room),
        address: body.address,
        photos: req.files.map((file) => file.filename),
      };
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