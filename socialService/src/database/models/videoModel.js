const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  videoId: { type: String, required: true, unique: true },
  titulo: String,
  genero: String,
  createdAt: Date
});

module.exports = mongoose.model('Video', videoSchema);
