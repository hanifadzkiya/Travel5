var mongoose = require('mongoose');

const config = require('../config/config')

module.exports = async () => {
  var url = `mongodb://${config.MONGODB_HOST}:${config.MONGODB_PORT}/${config.MONGODB_DB_NAME}`;
  return await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
};