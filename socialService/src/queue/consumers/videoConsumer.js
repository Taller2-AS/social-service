const { getChannel } = require('../config/connection');
const Video = require('../../database/models/videoModel');

const videoConsumer = async () => {
  const channel = await getChannel();

  await channel.assertQueue('video-events-queue', { durable: true });

  channel.consume('video-events-queue', async (msg) => {
    if (!msg) return;

    try {
      const event = JSON.parse(msg.content.toString());

      switch (event.event) {
        case 'VIDEO_CREATED':
          await Video.findOneAndUpdate(
            { videoId: event.videoId },
            {
              videoId: event.videoId,
              titulo: event.titulo,
              genero: event.genero,
              createdAt: new Date(event.timestamp)
            },
            { upsert: true, new: true }
          );
          console.log(`✅ Video registrado: ${event.videoId}`);
          break;

        case 'VIDEO_DELETED':
          await Video.deleteOne({ videoId: event.videoId });
          console.log(`❌ Video eliminado: ${event.videoId}`);
          break;
      }

      channel.ack(msg);
    } catch (err) {
      console.error('❌ Error procesando evento de video:', err.message);
      channel.nack(msg);
    }
  });

  console.log('🎧 Escuchando eventos de video...');
};

module.exports = videoConsumer;
