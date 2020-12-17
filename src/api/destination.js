const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");

const response = require("../util/response");
const fileUtils = require("../util/fileUtils");
const destinations = require("../models/destinationSchema");
const destinationService = require("../services/destinationService");
const { set } = require("../app");
const app = require("../app");

var destinationRouter = express.Router();

destinationRouter.use(fileUpload());
destinationRouter.use(bodyParser.json());

destinationRouter
  .route("/")
  .get(async (req, res, next) => {
    try {
      const destinations = await destinationService.getAll();
      response.responseSuccess(res, destinations);
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  })
  .post(async (req, res, next) => {
    try {
      console.log(req.body);
      var images = req.files.images;
      var ext = images.name.split(".").pop();
      images.name = Date.now() + "." + ext;
      await images.mv("./public/images/" + images.name);
      req.body.images = images.name;
      const destination = req.body;
      const destinations = await destinationService.add(destination);
      response.responseSuccess(res, destinations);
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  })
  .put(async (req, res, next) => {
    response.responseFailed(res, 404, "PUT Operation Not Support");
  })
  .delete(async (req, res, next) => {
    response.responseFailed(res, 404, "Can not DELETE all Destination");
  });

destinationRouter
  .route("/:id")
  .get(async (req, res, next) => {
    try {
      const result = await destinationService.get(req.params.id);
      if (result == null) {
        response.responseFailed(res, 404, "Destination not found");
        return;
      }
      response.responseSuccess(res, result);
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  })
  .post((req, res, next) => {
    response.responseFailed(res, 403, "POST Operation Not Support");
  })
  .put(async (req, res, next) => {
    try {
      const result = await destinationService.deleteById(req.params.id);
      if (result == null) {
        response.responseFailed(res, 404, "Destination not found");
        return;
      }

      var images = req.files.images;
      var ext = images.name.split(".").pop();
      images.name = Date.now() + "." + ext;
      await images.mv("./public/images/" + images.name);
      req.body.images = images.name;
      const destination = req.body;
      const destinations = await destinationService.add(destination);
      response.responseSuccess(res, destinations);
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const result = await destinationService.deleteById(req.params.id);
      if (result == null) {
        response.responseFailed(res, 404, "3estination not found");
        return;
      }
      response.responseSuccess(res, result);
      console.log("Delete Succsess");
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  });

destinationRouter
  .route("/:id/reviews")
  .get((req, res, next) => {
    destinations.findById(req.params.id).then((destination) => {
      if (destination != null) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(destination.reviews);
      } else {
        response.responseFailed(res, 403, "Reviews not found");
      }
    });
  })

  .post((req, res, next) => {
    destinations.findById(req.params.id).then((destination) => {
      destination.reviews.push(req.body);
      destination.save((err, destination) => {
        if (err) throw err;
        res.statusCode = 200;
        console.log("Updated reviews Succsess", destination.reviews);
        res.setHeader("Content-Type", "application/json");
        res.json(destination.reviews);
      });
    });
  })

  .put((req, res, next) => {
    response.responseFailed(res, 403, "Put operation is not supported");
  })

  .delete(function (req, res, next) {
    destinations.findById(req.params.id).then((destination) => {
      for (var i = destination.reviews.length - 1; i >= 0; i--) {
        destination.reviews.id(destination.reviews[i]._id).remove();
      }
      destination.save((err, result) => {
        if (err) throw err;
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end("Deleted all reviews");
      });
    });
  });

destinationRouter
  .route("/:id/reviews/:reviewId")
  .get((req, res, next) => {
    destinations.findById(req.params.id).then((destinations) => {
      if (destinations != null) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(destinations.reviews.id(req.params.reviewId));
      } else {
        response.responseFailed(res, 403, "Reviews not found");
      }
    });
  })

  .post((req, res, next) => {
    response.responseFailed(res, 403, "POST operation is not supported");
  })

  .put((req, res, next) => {
    destinations.findById(req.params.id).then((destination) => {
      destination.reviews.id(req.params.reviewId).remove();
      destination.reviews.push(req.body);
      destination.save((err, destination) => {
        if (err) throw err;
        res.statusCode = 200;
        console.log("Updated reviews Success");
        res.json(destination.reviews);
      });
    });
  })

  .delete((req, res, next) => {
    destinations.findById(req.params.id).then((destination) => {
      destination.reviews.id(req.params.reviewId).remove();
      destination.save((err, resp) => {
        if (err) throw err;
        res.statusCode = 200;
        res.json(resp.reviews);
      });
    });
  });

module.exports = destinationRouter;
