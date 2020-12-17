//erikborge
//mariokartisaverygoodgame123

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require('cors');

//Port from environment variable or default - 4001
const port = process.env.PORT || 3001;
// const port = 3001;

//Setting up express and adding socketIo middleware
const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
});
const server = http.createServer(app);
const io = socketIo(server);

//Setting up a socket with the namespace "connection" for new sockets
io.on("connection", socket => {
    console.log("New client connected");

    //Here we listen on a new namespace called "incoming data"
    socket.on("incoming data", (data)=>{
      console.log('data recieved: ', data);
        //Here we broadcast it out to all other sockets EXCLUDING the socket which sent us the data
       socket.broadcast.emit("outgoing data", data);
       socket.emit("outgoing data", data);
       //to exclude the source that sent the data? use socket.broadcast.emit instead
    });

    //for highlighting focused field
    socket.on("incoming highlight", (data)=>{
      console.log('highlight recieved: ', data);
      socket.broadcast.emit("outgoing highlight", data);
      socket.emit("outgoing highlight", data);
    });
    //A special namespace "disconnect" for when a client disconnects
    socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(port, () => console.log(`Listening on port ${port}`));
