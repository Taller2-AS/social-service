const mongoose = require('mongoose');
const dotenv = require('dotenv');
const insertSocialData = require('./socialSeeder');

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

mongoose.connect(MONGO_URI).then(async () => {
  if (process.argv.includes('--fresh')) {
    await mongoose.connection.dropDatabase();
    console.log('Base de datos limpiada');
  }

  await insertSocialData();
  await mongoose.disconnect();
  console.log('✅ Datos de prueba insertados y desconexión completada');
}).catch(err => console.error('Error conectando a MongoDB:', err));
