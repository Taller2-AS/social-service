const dotenv = require('dotenv');
const grpc = require('@grpc/grpc-js');
const connectMongo = require('./src/database/mongo');
const loadProto = require('./src/utils/loadProto');
const socialService = require('./src/services/socialService');

dotenv.config();

connectMongo().then(() => {
  console.log('✅ Conectado a MongoDB');

  const server = new grpc.Server();
  const SocialProto = loadProto('social');

  server.addService(SocialProto.SocialService.service, socialService);

  const PORT = process.env.GRPC_PORT || 50054;
  const HOST = process.env.SERVER_URL || 'localhost';

  server.bindAsync(`${HOST}:${PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Fallo al iniciar servidor gRPC:', err.message);
      return;
    }
    console.log(`🚀 Servidor gRPC escuchando en ${HOST}:${port}`);
    server.start();
  });
}).catch(err => {
  console.error('❌ Error conectando a MongoDB:', err.message);
});
