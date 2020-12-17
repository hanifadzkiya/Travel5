const weatherService = require('../services/weatherService');
const express = require("express");
const weatherRouter = express.Router();
const response = require("../util/response");
weatherRouter
  .route("/")
  .get(async (req,res)=>{
    const data = await weatherService.getWeatherByCity('BANDUNG');
    response.responseSuccess(res, {
        'forecasting':data.weather[0].description,
        'date' : new Date()
    });
  });
  
weatherRouter
  .route("/forecast/:day")
  .get(async (req,res)=>{
    if (req.params.day >= 9 || req.params.day <= 0){
        response.responseFailed(res, 404, "Max forecast is in a week");
    } else {
        const data = await weatherService.getForecastWeatherBandung();
        const today = new Date()
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + req.params.day*1)
        response.responseSuccess(res, {
            'forecasting':data.daily[req.params.day-1].weather[0].description,
            'date' : tomorrow
        });
    }
  });

  module.exports = weatherRouter;