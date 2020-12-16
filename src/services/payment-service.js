const axios = require("axios");
const config = require("../config/config");

const createPaymentUrl = async (
  { amount },
  { first_name, last_name, email, phone }
) => {
  const response = await axios({
    method: "post",
    url: config.MIDTRANS_API_URL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization:
        "Basic " + Buffer.from(config.MIDTRANS_KEY).toString("base64"),
    },
    data: {
      transaction_details: {
        order_id: "order-csb-" + Math.round(new Date().getTime() / 1000),
        gross_amount: amount,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name,
        last_name,
        email,
        phone,
      },
    },
  });
  console.log(config.MIDTRANS_PAYMENT_URL + response.data.token);
  return config.MIDTRANS_PAYMENT_URL + response.data.token;
};

module.exports = { createPaymentUrl };
