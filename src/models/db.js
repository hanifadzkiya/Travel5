var mongoose = require('mongoose');

const config = require('../config/config');

module.exports = async () => {
  let url;
  if (config.NODE_ENV == 'production') {
    url = `mongodb+srv://${config.MONGODB_USER}:${config.MONGODB_PASSWORD}` + 
      `@${config.MONGODB_HOST}/${config.MONGODB_DB_NAME}`;
  } else {
    url = `mongodb://${config.MONGODB_HOST}:${config.MONGODB_PORT}/${config.MONGODB_DB_NAME}`;
  }

  const options = { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
  };

  console.log(`Connect to mongodb with url ${url} and options ${JSON.stringify(options)}`);
  mongoose.set('debug', true);
  return await mongoose.connect(url, options);
};