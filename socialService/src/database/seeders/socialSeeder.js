const fs = require('fs');
const path = require('path');
const Video = require('../models/videoModel');
const Like = require('../models/likeModel');
const Comment = require('../models/commentModel');
const User = require('../models/userModel');

const insertSocialData = async () => {
  const dataPath = path.join(__dirname, '../../../data');

  // Poblar videos
  const videosRaw = fs.readFileSync(path.join(dataPath, 'videos.json'), 'utf8');
  const videos = JSON.parse(videosRaw);
  for (const v of videos) {
    await Video.findOneAndUpdate(
      { videoId: v.id || v._id },
      {
        videoId: v.id || v._id,
        titulo: v.titulo || '',
        genero: v.genero || '',
        createdAt: v.createdAt ? new Date(v.createdAt) : new Date()
      },
      { upsert: true, new: true }
    );
  }

  // Poblar usuarios
  const usersRaw = fs.readFileSync(path.join(dataPath, 'usuarios.json'), 'utf8');
  const users = JSON.parse(usersRaw);
  for (const u of users) {
    await User.findOneAndUpdate(
      { userId: u.id },
      { userId: u.id, email: u.email },
      { upsert: true, new: true }
    );
  }

  // Poblar likes
  const likesRaw = fs.readFileSync(path.join(dataPath, 'likes.json'), 'utf8');
  const likes = JSON.parse(likesRaw);
  await Like.insertMany(likes);

  // Poblar comentarios
  const commentsRaw = fs.readFileSync(path.join(dataPath, 'comments.json'), 'utf8');
  const comments = JSON.parse(commentsRaw);
  await Comment.insertMany(comments);
};

module.exports = insertSocialData;
