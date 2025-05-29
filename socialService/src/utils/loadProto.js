const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

function loadProto(serviceName) {
  const PROTO_PATH = path.join(__dirname, '..', 'protos', `${serviceName}.proto`);

  const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });

  return grpc.loadPackageDefinition(packageDefinition).social;
}

module.exports = loadProto;
