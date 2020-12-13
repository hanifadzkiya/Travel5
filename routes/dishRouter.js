const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Dishes = require('../models/dishes');
const { set } = require('../app');
const app = require('../app');

var dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
    .get((req, res, next) => {
        Dishes.find({})
        .then((dishes) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(dishes);
        });
})
.post((req, res, next) => {
    Dishes.create(req.body)
    .then((dish) => {
        console.log('Dish created', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    });
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('Put operation is not supported');
});

dishRouter.route('/:dishId')
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
        .then((dish) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(dish);
        });
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation is not supported');
})
.put((req, res, next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, { $set: req.body }, { new: true })
    .then((dish) => {
        console.log('Dish update', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    });
})
.delete((req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
        console.log('Dish removed', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    });
});

dishRouter.route('/:dishId/reviews')
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
        .then((dishes) => {
            if (dishes != null){
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(dishes.reviews);
            }else {
                res.statusCode = 404;
                res.end('reviews not founds');
            }
        });
    })

.post((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        dish.reviews.push(req.body);
        dish.save((err, dish) => {
        if(err) throw err;
            res.statusCode = 200;
            console.log('Updated reviews Succsess', dish.reviews);
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.reviews);
        });
    });
})

.put((req, res, next) => {
    res.statusCode = 403;
    res.end('Put operation is not supported');
})

.delete(function (req, res, next) {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
      for (var i = (dish.reviews.length -1 ); i >= 0; i--) {
        dish.reviews.id(dish.reviews[i]._id).remove();
      }
      dish.save((err, result) => {
        if(err) throw err;
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end('Deleted all reviews');
      });
    });
});

dishRouter.route('/:dishId/reviews/:commentId')
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
        .then((dishes) => {
            if (dishes != null){
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(dishes.reviews.id(req.params.commentId));
            }else {
                res.statusCode = 404;
                res.end('reviews not founds');
            }
        });
    })

.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation is not supported');
})

.put((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        dish.reviews.id(req.params.commentId).remove();
        dish.reviews.push(req.body);
        dish.save((err, dish) => {
            if(err) throw err;
            res.statusCode = 200;
            console.log('Updated reviews Success');
            res.json(dish.reviews);
        });
    });
})

.delete((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        dish.reviews.id(req.params.commentId).remove();
        dish.save((err, resp) => {
            if(err) throw err;
            res.statusCode = 200;
            res.json(resp.reviews);
        });
    });
});

module.exports = dishRouter;