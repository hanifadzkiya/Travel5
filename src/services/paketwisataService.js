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

const getAllReview = async (id) => {
  paketWisata = await PaketWisata.findById(id); 
  return paketWisata.reviews;
};

const addReview = async (id, newReview) => {
  return await PaketWisata.findByIdAndUpdate(
    id, 
    { $push: { "reviews": {userId: newReview.userId, rating: newReview.rating, review: newReview.review} } },
    { new: true }
  );
};

const deleteAllReview = async (id) => {
  return await PaketWisata.findByIdAndUpdate(
    id, 
    { $set: { "reviews": [] } },
    { new: true }
  );
};

const getReviewById = async (idPaket, idReview) => {
  paketWisata = await PaketWisata.findById(idPaket);
  return paketWisata.reviews.id(idReview);
};

const updateReviewById = async (idPaket, idReview, newReview) => {
  paketWisata = await PaketWisata.findById(idPaket);
  oldReview = paketWisata.reviews.id(idReview);
  oldReview.rating = newReview.rating;
  oldReview.review = newReview.review;
  return paketWisata.save()
};

const deleteReviewById = async (idPaket, idReview) => {
  return await PaketWisata.findByIdAndUpdate(
    idPaket,
    { $pull: { "reviews": { _id: idReview } } },
    { new: true }
  );
};

const addHits = async (idPaket) => {
  return await PaketWisata.findByIdAndUpdate( idPaket,
    { $inc: { hits: 1} }
  )
}

const sortByPrice = async (asc) => {
  if (asc == 'ascending'){
    return await PaketWisata.find().sort('total_price');
  } else{
    return await PaketWisata.find().sort('-total_price');
  }
}

const filterByPrice = async (lowest, highest) => { 
  return await PaketWisata.find({ total_price: { $gte: lowest, $lte: highest } } )
}

const filterByDate = async (start, end) => {
  return await PaketWisata.find( 
    { 
      start_date: { $lte: end },
      end_date: {$gte: start}
    }
  )
}

module.exports = {
  getAll,
  add,
  deleteAll,

  getById,
  updateById,
  deleteById,

  getAllReview,
  addReview,
  deleteAllReview,

  getReviewById,
  updateReviewById,
  deleteReviewById,

  addHits,

  sortByPrice,
  filterByPrice,
  filterByDate
};
