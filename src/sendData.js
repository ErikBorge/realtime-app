let socket = require('socket.io-client')('http://localhost:3001');

let number = 0;

setInterval(function () {
    number = Math.round(Math.random()*10);
    console.log('Changed number to: ', number);
    socket.emit('incoming data', number);
}, 1000);
