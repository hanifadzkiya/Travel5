const responseSuccess = (res, data) => {
  res.status(200);
  res.type("application/json");
  res.json(data);
};

const responseFailed = (res, status, message) => {
  res.status(status);
  res.send({ status, message });
};

module.exports = { responseSuccess, responseFailed };
