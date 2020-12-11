var mongoose = require('mongoose');

const config = require('../config/config');

module.exports = async () => {
  let url;
  if (config.MONGODB_PORT == null) {
    url = `mongodb+srv://${config.MONGODB_USER}:${config.MONGODB_PASSWORD}` + 
      `@${config.MONGODB_HOST}/${config.MONGODB_DB_NAME}`;
  } else {
    url = `mongodb://${config.MONGODB_HOST}:${config.MONGODB_PORT}/${config.MONGODB_DB_NAME}`;
  }

  const options = { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
  };

  return await mongoose.connect(url, options);
};