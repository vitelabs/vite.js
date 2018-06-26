const jayson = require('jayson');

// create a server
let server = jayson.server({
    add: function (args, callback) {
        console.log(args);
        callback(null, args[0] + args[1]);
    },
    sub: function (args, callback) {
        console.log(args);
        callback(null, args[0] - args[1]);
    },
    cheng: function (args, callback) {
        console.log(args);
        callback(null, args[0] * args[1]);
    }
});

server.http().listen(8415);
console.log('Listen: http://localhost:8415');