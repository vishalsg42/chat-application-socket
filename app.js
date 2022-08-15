const express = require("express");
const path = require("path");
const { onConnect } = require("./sockets");
const app = express();

const PORT = process.env.PORT || 8008;

app.use(express.static(path.join(__dirname, 'public')));


const server = app.listen(PORT, () => {
    console.log(
    `
    Chat Application👨🏽‍💻 is running⚡️ on port:${PORT} 
    Link: http://localhost:${PORT}
    `
    );
})

const io = require("socket.io")(server);
global.io = io;

let socketConnected = new Set();
global.socketConnected = socketConnected;
io.on("connection", onConnect);