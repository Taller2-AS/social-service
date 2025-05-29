const mongoose = require('mongoose');

const connectMongo = async () => {
  const uri = process.env.MONGODB_URI;
  await mongoose.connect(uri);
};

module.exports = connectMongo;
