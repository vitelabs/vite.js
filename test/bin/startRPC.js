const jayson = require('jayson');

// create a server
let server = jayson.server({
    jsonrpcSuccess: function (args, callback) {
        callback(null, args[0] + args[1]);
    },
    jsonrpcError: function (args, callback) {
        callback({ code: 0, message: JSON.stringify(args) });
    },
    jsonrpcTimeoutSuccess: function (args, callback) {
        setTimeout(() => {
            callback(null, args[0] + args[1]);
        }, 100);
    },
    jsonrpcTimeoutError: function (args, callback) {
        setTimeout(() => {
            callback(null, args[0] + args[1]);
        }, 1000);
    }
});

server.http().listen(8415);
console.log('Listen: http://localhost:8415');