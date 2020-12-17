const express = require("express");
const bodyParser = require('body-parser');

const fileUtils = require("../util/fileUtils");
const hotelService = require("../services/hotelService");
const response = require("../util/response");

const hotelRouter = express.Router();
hotelRouter.use(bodyParser.json());
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
      console.log(req.body);
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

hotelRouter
  .route("/:id/review")
  .get(async (req, res, next) => {
    try {
      const hotels = await hotelService.get(req.params.id);
      response.responseSuccess(res, hotels.reviews);
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  })
  .post(async (req, res, next) => {
    try {
      const hotels = await hotelService.addReview(req.params.id, req.body);
      response.responseSuccess(res, hotels);
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  })
  .put(async (req, res, next) => {
    response.responseFailed(res, 405, "Method not allowed");
  })
  .delete(async (req, res, next) => {
    try {
      const result = await hotelService.deleteAllReviews(req.params.id);
      response.responseSuccess(res, result);
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  });

hotelRouter
  .route("/:hotelId/review/:userId")
  .get(async (req, res, next) => {
    try {
      const { hotelId, userId } = req.params;
      const reviews = await hotelService.getReviewUserInHotel(hotelId, userId);
      response.responseSuccess(res, reviews);
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  })
  .post(async (req, res, next) => {
    response.responseFailed(res, 405, "Method not allowed");
  })
  .put(async (req, res, next) => {
    try {
      const { hotelId, userId } = req.params;
      const result = await hotelService.updateReviewInHotelByUser(
        hotelId,
        userId,
        req.body
      );
      console.log(result);
      response.responseSuccess(res, result);
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const { hotelId, userId } = req.params;
      const result = await hotelService.deleteReviewInHotelByUser(
        hotelId,
        userId
      );
      response.responseSuccess(res, result);
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  });

module.exports = hotelRouter;
