const express = require("express");
const bodyParser = require("body-parser");
const response = require("../util/response");

const paketService = require("../services/paketwisataService");

var paketRouter = express.Router();

paketRouter.use(bodyParser.json());

paketRouter
  .route("/")
  .get(async (req, res, next) => {
    try {
      const paketwisata = await paketService.getAll();
      response.responseSuccess(res, paketwisata);
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  })
  .post(async (req, res, next) => {
    try {
      const newpaket = req.body;
      const paketwisata = await paketService.add(newpaket);
      response.responseSuccess(res, paketwisata);
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  })
  .put(async (req, res, next) => {
    response.responseFailed(res, 405, "Method Not Allowed");
  })
  .delete(async (req, res, next) => {
    try {
      const deletePaket = await paketService.deleteAll();
      response.responseSuccess(res, deletePaket);
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  });


paketRouter
  .route("/:id")
  .get(async (req, res, next) => {
    try {
      const paketwisata = await paketService.getById(req.params.id);
      if (paketwisata) {
        response.responseSuccess(res, paketwisata);
      } else {
        response.responseFailed(res, 404, "Paket Wisata Not Found");
        return;
      }
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  })
  .post(async (req, res, next) => {
    response.responseFailed(res, 405, "Method Not Allowed");
  })
  .put(async (req, res, next) => {
    try {
      const updatedpaket = await paketService.updateById(
        req.params.id,
        req.body
      );
      if (updatedpaket) {
        response.responseSuccess(res, updatedpaket);
      } else {
        response.responseFailed(res, 404, "Paket Wisata Not Found");
        return;
      }
    } catch (err) {}
  })
  .delete(async (req, res, next) => {
    try {
      const deletePaket = await paketService.deleteById(req.params.id);
      response.responseSuccess(res, deletePaket);
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  });


paketRouter
  .route('/:id/review')
  .get(async (req, res, next) => {
    try {
      const paketwisata = await paketService.getAllReview(req.params.id);
      if (paketwisata) {
        response.responseSuccess(res, paketwisata);
      } else {
        response.responseFailed(res, 404, "Reviews Not Found");
        return;
      }
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  })
  .post(async (req, res, next) => {
    try {
      const newReview = req.body;
      const paketwisata = await paketService.addReview(req.params.id, newReview);
      response.responseSuccess(res, paketwisata);
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const deleteReview = await paketService.deleteAllReview(req.params.id);
      response.responseSuccess(res, deleteReview);
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  });


paketRouter
  .route('/:id/review/:idReview')
  .get(async (req, res, next) => {
    try {
      const review = await paketService.getReviewById(req.params.id, req.params.idReview);
      if (review) {
        response.responseSuccess(res, review);
      } else {
        response.responseFailed(res, 404, "Reviews Not Found");
        return;
      }
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  })
  .put(async (req, res, next) => {
    try {
      const updatedReview = await paketService.updateReviewById(
        req.params.id,
        req.params.idReview,
        req.body
      );
      if (updatedReview) {
        response.responseSuccess(res, updatedReview);
      } else {
        response.responseFailed(res, 404, "Review Not Found");
        return;
      }
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const deleteReview = await paketService.deleteAllReview(req.params.id);
      response.responseSuccess(res, deleteReview);
    } catch (err) {s
      response.responseFailed(res, 500, err.message);
    }
  });

paketRouter
  .route('/:id/hits')
  .put(async (req, res, next) => {
    try{
      const addHits = await paketService.addHits(req.params.id);
      if (addHits){
        response.responseSuccess(res, addHits);
      } else {
        response.responseFailed(res, 404, "Not Found");
        return;
      }
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  })

paketRouter
  .route('/price/sort/:asc')
  .get(async (req, res, next) => {
    console.log("ASDASDASD")
    try {
      console.log("ASDASD")
      const asc = req.params.asc;
      console.log(asc);
      const result = await paketService.sortByPrice(asc);
      if (result) {
        response.responseSuccess(res, result);
      } else {
        response.responseFailed(res, 404, "Not Found");
        return;
      }
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  })

paketRouter
  .route('/price/:lowest/:highest')
  .get(async (req, res, next) => {
    try {
      const lowest_price = req.params.lowest;
      const highest_price = req.params.highest;
      const result = await paketService.filterByPrice(lowest_price, highest_price);
      if (result) {
        response.responseSuccess(res, result);
      } else {
        response.responseFailed(res, 404, "Not Found");
        return;
      }
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  })

module.exports = paketRouter;
