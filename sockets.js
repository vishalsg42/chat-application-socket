module.exports = {
    onConnect: (socket) => {
        const socketConnected = global.socketConnected;
        const io = global.io;
        console.log("Socket Connected", socket.id);
        socketConnected.add(socket.id);
        console.log("socketList", socketConnected)

        // emit the client once socket is connected
        io.emit("clients-total", socketConnected.size);

        // While disconnecting need to remove the socket from the set
        socket.on("disconnect", () => {
            console.log("Disconnecting socked", socket.id);
            socketConnected.delete(socket.id);
            io.emit("clients-total", socketConnected.size);
        });

        socket.on("message", (data) => {
            socket.broadcast.emit("chat-message",data);
        })

        socket.on("feedback", (data) => {
            socket.broadcast.emit("feedback",data);
        })
    }
}