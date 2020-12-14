const express = require("express");
const bcrypt = require("bcrypt");

const userService = require("../services/userService");
const transactionService = require("../services/transactionService");
const response = require("../util/response");

const transactionRouter = express.Router();

transactionRouter.route("/hotel/:username")
//post transaksi hotel
  .post(async (req, res, next) => {
    try {
      const result = await userService.getByUsername(req.params.username);
      if (result == null) {
        response.responseFailed(res, 404, "User not found");
        return;
      }
      const transaksi = await transactionService.insertTransaction(req.params.username, 'transactionHotel' ,req.body)
      response.responseSuccess(res, transaksi);
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  })
  //get transaksi hotel by username
  .get(async (req, res, next) => {
    try {
      const result = await userService.getByUsername(req.params.username);
      if (result == null) {
        response.responseFailed(res, 404, "User not found");
        return;
      }
      const hasil = await result.transactionHotel;
      response.responseSuccess(res, hasil);
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  })

transactionRouter.route("/destination/:username")
  //post transaksi tempatwisata
    .post(async (req, res, next) => {
      try {
        const result = await userService.getByUsername(req.params.username);
        if (result == null) {
          response.responseFailed(res, 404, "User not found");
          return;
        }
        const transaksi = await transactionService.insertTransaction(req.params.username, 'transactionTempatWisata' ,req.body)
        response.responseSuccess(res, transaksi);
      } catch (err) {
        response.responseFailed(res, 500, err.message);
      }
    })
    //get transaksi destination by username
    .get(async (req, res, next) => {
      try {
        const result = await userService.getByUsername(req.params.username);
        if (result == null) {
          response.responseFailed(res, 404, "User not found");
          return;
        }
        const hasil = await result.transactionTempatWisata;
        response.responseSuccess(res, hasil);
      } catch (err) {
        response.responseFailed(res, 500, err.message);
      }
    })

transactionRouter.route("/tour/:username")
    //post transaksi paket wisata
    .post(async (req, res, next) => {
        try {
          const result = await userService.getByUsername(req.params.username);
          if (result == null) {
            response.responseFailed(res, 404, "User not found");
            return;
          }
          const transaksi = await transactionService.insertTransaction(req.params.username, 'transactionPaketWisata' ,req.body)
          response.responseSuccess(res, transaksi);
        } catch (err) {
          response.responseFailed(res, 500, err.message);
        }
    })
    //get transaction tour by username
    .get(async (req, res, next) => {
      try {
        const result = await userService.getByUsername(req.params.username);
        if (result == null) {
          response.responseFailed(res, 404, "User not found");
          return;
        }
        const hasil = await result.transactionPaketWisata;
        response.responseSuccess(res, hasil);
      } catch (err) {
        response.responseFailed(res, 500, err.message);
      }
    })

transactionRouter.route("/hotel/:username/:idHotel")
  //get transaksi hotel by username and id
  .get(async (req, res, next) => {
    try {
      const result = await userService.getByUsername(req.params.username);
      if (result == null) {
        response.responseFailed(res, 404, "User not found");
        return;
      }
      const hasil = await result.transactionHotel.id(req.params.idHotel);
      response.responseSuccess(res, hasil);
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  })
  //put transaksi hotel by username and id
  .put(async (req, res, next) => {
    try {
      const result = await userService.getByUsername(req.params.username);
      if (result == null) {
        response.responseFailed(res, 404, "User not found");
        return;
      }
      const hasil = await result.transactionHotel.id(req.params.idHotel);
      if(hasil == null){
        response.responseFailed(res, 404, "Hotel not found");
        return;
      }
      req.body.totalTransaksi = req.body.totalTransaksi || hasil.totalTransaksi;
      req.body.start_date = req.body.start_date || hasil.start_date;
      req.body.end_date = req.body.end_date || hasil.end_date;
      hasil.remove();
      result.save(async function (err,result){
        if(err){
          console.log(err);
          response.responseFailed(res, 404, "Hotel not found");
        }else{
          const transaksi = await transactionService.insertTransaction(req.params.username, 'transactionHotel', req.body)
          response.responseSuccess(res, transaksi);
        }
      });
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  })

transactionRouter.route("/destination/:username/:idDestination")
  //get transaksi destination by username and id
  .get(async (req, res, next) => {
    try {
      const result = await userService.getByUsername(req.params.username);
      if (result == null) {
        response.responseFailed(res, 404, "User not found");
        return;
      }
      const hasil = await result.transactionTempatWisata.id(req.params.idDestination);
      response.responseSuccess(res, hasil);
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  })
  //put transaksi destination by username and id
  .put(async (req, res, next) => {
    try {
      const result = await userService.getByUsername(req.params.username);
      if (result == null) {
        response.responseFailed(res, 404, "User not found");
        return;
      }
      const hasil = await result.transactionTempatWisata.id(req.params.idDestination);
      if(hasil == null){
        response.responseFailed(res, 404, "Destination not found");
        return;
      }
      req.body.totalTransaksi = req.body.totalTransaksi || hasil.totalTransaksi;
      req.body.start_date = req.body.start_date || hasil.start_date;
      req.body.end_date = req.body.end_date || hasil.end_date;
      hasil.remove();
      result.save(async function (err,result){
        if(err){
          console.log(err);
          response.responseFailed(res, 404, "Destination not found");

        }else{
          const transaksi = await transactionService.insertTransaction(req.params.username, 'transactionTempatWisata', req.body)
          response.responseSuccess(res, transaksi);
        }
      });
    } catch (err) {
      response.responseFailed(res, 500, err.message);
    }
  })

transactionRouter.route("/tour/:username/:idTour")
 //get transaksi tour by username and id
 .get(async (req, res, next) => {
  try {
    const result = await userService.getByUsername(req.params.username);
    if (result == null) {
      response.responseFailed(res, 404, "User not found");
      return;
    }
    const hasil = await result.transactionPaketWisata.id(req.params.idTour);
    response.responseSuccess(res, hasil);
  } catch (err) {
    response.responseFailed(res, 500, err.message);
  }
})

//put transaksi tour by username and id
.put(async (req, res, next) => {
  try {
    const result = await userService.getByUsername(req.params.username);
    if (result == null) {
      response.responseFailed(res, 404, "User not found");
      return;
    }
    const hasil = await result.transactionPaketWisata.id(req.params.idTour);
    if(hasil == null){
      response.responseFailed(res, 404, "Tour not found");
      return;
    }
    req.body.totalTransaksi = req.body.totalTransaksi || hasil.totalTransaksi;
    req.body.start_date = req.body.start_date || hasil.start_date;
    req.body.end_date = req.body.end_date || hasil.end_date;
    hasil.remove();
    result.save(async function (err,result){
      if(err){
        console.log(err);
        response.responseFailed(res, 404, "Tour not found");

      }else{
        const transaksi = await transactionService.insertTransaction(req.params.username, 'transactionPaketWisata', req.body)
        response.responseSuccess(res, transaksi);
      }
    });
  } catch (err) {
    response.responseFailed(res, 500, err.message);
  }
})

transactionRouter.route("/all/hotel")
//get all transaction hotel
 .get(async (req, res, next) => {
  try {
    const result = await userService.getAll();
    if (result == null) {
      response.responseFailed(res, 404, "User not found");
      return;
    }
    const allData= [];
    for (var i=0; i < result.length; i++) {
      var transaksi = result[i].transactionHotel;
      for(var j=0; j<transaksi.length; j++) {
        var data = {
          'username' : result[i].username,
          'idTransaksi' : transaksi[j].id, 
          'totalTransaksi' : transaksi[j].totalTransaksi,
          'updatedAt' : transaksi[j].updatedAt,
          'createdAt' : transaksi[j].createdAt
        }
        allData.push(data);
      }  
    }
    response.responseSuccess(res, allData);
  } catch (err) {
    response.responseFailed(res, 500, err.message);
  }
})

transactionRouter.route("/all/destination")
 //get all transaction destination
 .get(async (req, res, next) => {
  try {
    const result = await userService.getAll();
    if (result == null) {
      response.responseFailed(res, 404, "User not found");
      return;
    }
    const allData= [];
    for (var i=0; i < result.length; i++) {
      var transaksi = result[i].transactionTempatWisata;
      for(var j=0; j<transaksi.length; j++) {
        var data = {
          'username' : result[i].username,
          'idTransaksi' : transaksi[j].id, 
          'totalTransaksi' : transaksi[j].totalTransaksi,
          'updatedAt' : transaksi[j].updatedAt,
          'createdAt' : transaksi[j].createdAt
        }
        allData.push(data);
      }  
    }
    response.responseSuccess(res, allData);
  } catch (err) {
    response.responseFailed(res, 500, err.message);
  }
})

transactionRouter.route("/all/tour")
 //get all transaction destination
 .get(async (req, res, next) => {
  try {
    const result = await userService.getAll();
    if (result == null) {
      response.responseFailed(res, 404, "User not found");
      return;
    }
    const allData= [];
    for (var i=0; i < result.length; i++) {
      var transaksi = result[i].transactionPaketWisata;
      for(var j=0; j<transaksi.length; j++) {
        var data = {
          'username' : result[i].username,
          'idTransaksi' : transaksi[j].id, 
          'totalTransaksi' : transaksi[j].totalTransaksi,
          'updatedAt' : transaksi[j].updatedAt,
          'createdAt' : transaksi[j].createdAt
        }
        allData.push(data);
      }  
    }
    response.responseSuccess(res, allData);
  } catch (err) {
    response.responseFailed(res, 500, err.message);
  }
})
module.exports = transactionRouter;