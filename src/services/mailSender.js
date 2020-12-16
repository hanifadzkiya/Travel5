const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD // naturally, replace both with your real credentials or an application-specific password
    }
});
const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: '',
    subject: 'Link untuk Reset Password',
    text: '',  
};

const kirimEmail = (email,link) =>{

    mailOptions.to = email;
    mailOptions.text = link;
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
    });
};
module.exports = {
    kirimEmail
};