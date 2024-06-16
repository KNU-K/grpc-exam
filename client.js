const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, 'auth.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const { AuthService } = grpc.loadPackageDefinition(packageDefinition);

const client = new AuthService.Auth(
    'localhost:8080',
    grpc.credentials.createInsecure()
);

const loginRequest = {
    userid: 'test',
    password: 'test',
};

client.login(loginRequest, (err, response) => {
    if (err) {
        console.error('Login failed:', err.details);
        return;
    }
    const { token } = response;
    console.log('Token:', token);
});
