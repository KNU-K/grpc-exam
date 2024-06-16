const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const jsonwebtoken = require('jsonwebtoken');
const path = require('path');
const AUTH_PROTO_PATH = path.join(__dirname, 'auth.proto');
const packageDefinition = protoLoader.loadSync(AUTH_PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const { AuthService } = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();
server.addService(AuthService.Auth.service, {
    login: async (call, callback) => {
        const { userid, password } = call.request;
        console.log(userid, password);
        if (userid === 'test' && password === 'test') {
            const token = jsonwebtoken.sign({ userid }, 'secret', {
                expiresIn: '30m',
            });
            callback(null, { token });
        } else {
            callback({
                code: grpc.status.UNAUTHENTICATED,
                details: 'Invalid credentials',
            });
        }
    },
});

server.bindAsync(
    'localhost:8080',
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
        if (err) {
            console.error('Server bind failed:', err);
            return;
        }
        console.log(`Server running at http://localhost:8080`);
    }
);
