const Like = require('../database/models/likeModel');
const Comment = require('../database/models/commentModel');
const Video = require('../database/models/videoModel');
const User = require('../database/models/userModel');
const publishLog = require('../queue/publisher/logPublisher');

const LikeVideo = async (call, callback) => {
  const { videoId, userId } = call.request;

  try {
    const videoExists = await Video.exists({ videoId });
    const userExists = await User.exists({ userId });

    if (!videoExists || !userExists) {
      await publishLog('error', {
        userId,
        email: '',
        error: 'Video o usuario no válido',
        date: new Date().toISOString()
      });
      return callback(new Error('Video o usuario no válido'));
    }

    await Like.create({ videoId, userId });

    await publishLog('action', {
      userId,
      email: '',
      method: 'LikeVideo',
      url: `/videos/${videoId}/like`,
      action: 'DAR LIKE',
      date: new Date().toISOString()
    });

    callback(null, { message: 'Like registrado con éxito' });
  } catch (error) {
    await publishLog('error', {
      userId,
      email: '',
      error: error.message,
      date: new Date().toISOString()
    });
    callback(error);
  }
};

const CommentVideo = async (call, callback) => {
  const { videoId, userId, comment } = call.request;

  try {
    const videoExists = await Video.exists({ videoId });
    const userExists = await User.exists({ userId });

    if (!videoExists || !userExists) {
      await publishLog('error', {
        userId,
        email: '',
        error: 'Video o usuario no válido',
        date: new Date().toISOString()
      });
      return callback(new Error('Video o usuario no válido'));
    }

    await Comment.create({ videoId, userId, comment });

    await publishLog('action', {
      userId,
      email: '',
      method: 'CommentVideo',
      url: `/videos/${videoId}/comment`,
      action: 'DEJAR COMENTARIO',
      date: new Date().toISOString()
    });

    callback(null, { message: 'Comentario registrado con éxito' });
  } catch (error) {
    await publishLog('error', {
      userId,
      email: '',
      error: error.message,
      date: new Date().toISOString()
    });
    callback(error);
  }
};

const GetInteractions = async (call, callback) => {
  const { videoId, userId } = call.request;
  console.log(`🔎 Buscando interacciones para videoId: "${videoId}"`);

  try {
    const likes = await Like.find({ videoId });
    const comments = await Comment.find({ videoId });

    await publishLog('action', {
      userId: userId || '',
      email: '',
      method: 'GetInteractions',
      url: `/videos/${videoId}/interactions`,
      action: 'CONSULTAR INTERACCIONES',
      date: new Date().toISOString()
    });

    callback(null, {
      likes: likes.map(l => l.userId),
      comments: comments.map(c => c.comment)
    });
  } catch (error) {
    await publishLog('error', {
      userId: userId || '',
      email: '',
      error: error.message,
      date: new Date().toISOString()
    });
    callback(error);
  }
};

module.exports = {
  LikeVideo,
  CommentVideo,
  GetInteractions
};
