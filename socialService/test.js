const mongoose = require('mongoose');
const Video = require('./src/database/models/videoModel');
const Like = require('./src/database/models/likeModel');
const Comment = require('./src/database/models/commentModel');
const User = require('./src/database/models/userModel');

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const videos = await Video.find();
  const likes = await Like.find();
  const comments = await Comment.find();
  const users = await User.find();

  console.log('Videos:', videos.length);
  console.log('Likes:', likes.length);
  console.log('Comments:', comments.length);
  console.log('Users:', users.length);

  mongoose.disconnect();
});
