var QRCode = require("qrcode");

const generate = async (content) => QRCode.toDataURL(content, { version: 10 });

module.exports = { generate };
