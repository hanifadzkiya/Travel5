const PaketWisata = require("../models/paketWisata");

const getAll = async () => {
  return await PaketWisata.find();
};

const add = async (data) => {
  const newPaketWisata = new PaketWisata(data);
  return newPaketWisata.save();
};

const deleteAll = async () => {
  return await PaketWisata.remove();
};

const getById = async (id) => {
  return await PaketWisata.findById(id);
};

const updateById = async (id, data) => {
  return await PaketWisata.findByIdAndUpdate(id, { $set: data });
};

const deleteById = async (id) => {
  return await PaketWisata.findByIdAndDelete(id);
};

module.exports = {
  getAll,
  add,
  deleteAll,

  getById,
  updateById,
  deleteById,
};
