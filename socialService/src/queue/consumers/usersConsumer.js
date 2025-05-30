const { getChannel } = require('../config/connection');
const User = require('../../database/models/userModel');

const usersConsumer = async () => {
  const channel = await getChannel();
  const queue = 'user-events-queue';

  await channel.assertQueue(queue, { durable: true });

  await channel.consume(queue, async (msg) => {
    if (!msg) return;

    try {
      const content = JSON.parse(msg.content.toString());

      if (content.event === 'USER_CREATED') {
        await User.findOneAndUpdate(
          { userId: content.id },
          { userId: content.id, email: content.email },
          { upsert: true, new: true }
        );
        console.log('👤 Usuario replicado:', content.id);
      }

      channel.ack(msg);
    } catch (err) {
      console.error('❌ Error procesando evento de usuario:', err.message);
      channel.nack(msg, false, true);
    }
  });

  console.log('👂 Escuchando eventos en "user-events-queue"...');
};

module.exports = usersConsumer;
