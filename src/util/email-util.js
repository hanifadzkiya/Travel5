const config = require("../config/config");
const nodemailer = require("nodemailer");

const sendEmail = (to, subject, html) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.EMAIL_ADDRESS,
      pass: config.EMAIL_PASSWORD,
    },
  });
  var mailOptions = {
    from: config.EMAIL_ADDRESS,
    to,
    subject,
    html
  };

  result = transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
