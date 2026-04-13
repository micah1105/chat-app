const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let users = {};

// random avatar color
function getColor() {
    const colors = ["#ff6b6b", "#6c5ce7", "#00d4ff", "#00ffa3", "#ffd93d"];
    return colors[Math.floor(Math.random() * colors.length)];
}

io.on("connection", (socket) => {

    socket.on("join", (username) => {
        users[socket.id] = {
            name: username,
            color: getColor()
        };

        io.emit("user list", users);
    });

    socket.on("chat message", (data) => {
        data.time = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

        data.color = users[socket.id]?.color || "#fff";

        io.emit("chat message", data);
    });

    socket.on("typing", (username) => {
        socket.broadcast.emit("typing", username);
    });

    socket.on("disconnect", () => {
        delete users[socket.id];
        io.emit("user list", users);
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log("Server running");
});
