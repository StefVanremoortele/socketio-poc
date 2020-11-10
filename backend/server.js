const websockets = require('./websockets');


var app = require('express');
var http = require('http').createServer(app);
const io = require('socket.io')({
    path: '/websockets/flightData',
    serveClient: false,
});

const ioHandler = new websockets.Manager(io);


io.attach(http, {
    path: '/websockets/flightData',
});



http.listen(4001, () => {
    console.log('listening on *:3000');
});



