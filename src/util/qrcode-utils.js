var QRCode = require("qrcode");

const generate = async (content) => QRCode.toDataURL(content, { version: 2 });

module.exports = { generate };
