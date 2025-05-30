const videosConsumer = require('./consumers/videoConsumer');
const usersConsumer = require('./consumers/usersConsumer');

const initializeQueueConsumers = async () => {
  await videosConsumer();
  await usersConsumer();
};

module.exports = initializeQueueConsumers;
