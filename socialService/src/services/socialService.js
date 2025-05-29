const Like = require('../database/models/likeModel');
const Comment = require('../database/models/commentModel');
const Video = require('../database/models/videoModel');
const User = require('../database/models/userModel');

const LikeVideo = async (call, callback) => {
  const { videoId, userId } = call.request;

  try {
    const videoExists = await Video.exists({ videoId });
    const userExists = await User.exists({ userId });

    if (!videoExists || !userExists) {
      return callback(new Error('Video o usuario no válido'));
    }

    await Like.create({ videoId, userId });
    callback(null, { message: 'Like registrado con éxito' });
  } catch (error) {
    callback(error);
  }
};

const CommentVideo = async (call, callback) => {
  const { videoId, userId, comment } = call.request;

  try {
    const videoExists = await Video.exists({ videoId });
    const userExists = await User.exists({ userId });

    if (!videoExists || !userExists) {
      return callback(new Error('Video o usuario no válido'));
    }

    await Comment.create({ videoId, userId, comment });
    callback(null, { message: 'Comentario registrado con éxito' });
  } catch (error) {
    callback(error);
  }
};

const GetInteractions = async (call, callback) => {
  const { videoId } = call.request;
  console.log(`🔎 Buscando interacciones para videoId: "${videoId}"`);


  try {
    const likes = await Like.find({ videoId });
    const comments = await Comment.find({ videoId });

    callback(null, {
      likes: likes.map(l => l.userId),
      comments: comments.map(c => c.comment)
    });
  } catch (error) {
    callback(error);
  }
};

module.exports = {
  LikeVideo,
  CommentVideo,
  GetInteractions
};
