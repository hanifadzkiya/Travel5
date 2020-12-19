const express = require("express");
const bodyParser = require("body-parser");
const response = require("../util/response");

const recService = require("../services/rekomendasiService");

var recRouter = express.Router();

recRouter.use(bodyParser.json());

recRouter
    .route("/paketwisata/:username")
    .get(async (req, res, next) => {
            const username = req.params.username;
            const result = await recService.getRecPaket(username);
            response.responseSuccess(res, result);
    })


module.exports = recRouter;