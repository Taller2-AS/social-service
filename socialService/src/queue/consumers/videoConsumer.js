const { getChannel } = require('../config/connection');
const Video = require('../../database/models/videoModel');

const videosConsumer = async () => {
  const channel = await getChannel();
  const queue = 'video-events-queue';

  await channel.assertQueue(queue, { durable: true });

  await channel.consume(queue, async (msg) => {
    if (!msg) return;

    try {
      const content = JSON.parse(msg.content.toString());

      if (content.event === 'VIDEO_CREATED') {
        await Video.findOneAndUpdate(
          { videoId: content.videoId },
          {
            videoId: content.videoId,
            titulo: content.titulo,
            genero: content.genero,
            createdAt: new Date(content.timestamp)
          },
          { upsert: true, new: true }
        );
        console.log('📼 Video creado replicado en interacciones:', content.videoId);
      }

      if (content.event === 'VIDEO_DELETED') {
        await Video.deleteOne({ videoId: content.videoId });
        console.log('❌ Video eliminado de interacciones:', content.videoId);
      }

      channel.ack(msg);
    } catch (err) {
      console.error('❌ Error al procesar evento de video:', err.message);
      channel.nack(msg, false, true);
    }
  });

  console.log('🛰️ Escuchando eventos de video en "video-events-queue"...');
};

module.exports = videosConsumer;
