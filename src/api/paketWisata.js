const express = require('express');
const bodyParser = require('body-parser');
const response = require("../util/response");

const paketService = require('../services/paketwisataService');

var paketRouter = express.Router();

paketRouter.use(bodyParser.json());

paketRouter.route('/')
    .get(async (req, res, next) => {
        try {
            const paketwisata = await paketService.getAll();
            response.responseSuccess(res, paketwisata);
        } catch (err) {
            response.responseFailed(res, 500, err.message);
        }
    })
    .post(async (req, res, next) => {
        try{
            const newpaket = req.body;
            const paketwisata = await paketService.add(newpaket)
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


paketRouter.route('/:id')
   .get(async (req, res, next) => {
        try {
            const paketwisata = await paketService.getById(req.params.id);
            if (paketwisata){
                response.responseSuccess(res, paketwisata);
            } else{
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
        try{
            const updatedpaket = await paketService.updateById(
                req.params.id,
                req.body
            )
            if(updatedpaket){
                response.responseSuccess(res, updatedpaket);
            } else{
                response.responseFailed(res, 404, "Paket Wisata Not Found");
                return;
            }
        } catch (err) {
            
        }
    })
    .delete(async (req, res, next) => {
        try {
          const deletePaket = await paketService.deleteById(req.params.id);
          response.responseSuccess(res, deletePaket);
        } catch (err) {
          response.responseFailed(res, 500, err.message);
        }
    }); 

module.exports = paketRouter;