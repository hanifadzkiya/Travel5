const config = require("../config/config");

const getPublicIp = async () => {
  if (config.NODE_ENV == "production") {
    return await publicIp.v4();
  }
  return `127.0.0.1:${config.PORT}`;
};

module.exports = { getPublicIp };
