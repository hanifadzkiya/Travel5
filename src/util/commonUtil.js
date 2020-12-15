const config = require("../config/config");

const getPublicIp = () => {
  if (config.NODE_ENV == "production") {
    return `54.163.242.157:${config.PORT}`;
  }
  return `127.0.0.1:${config.PORT}`;
};

module.exports = { getPublicIp };
