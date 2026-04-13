const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

// store users + rooms
let users = {};
let userRooms = {};

// simple message memory (for now)
let messages = {};

io.on("connection", (socket) => {

    // LOGIN
    socket.on("login", (username) => {
        users[socket.id] = username;

        // default room
        userRooms[socket.id] = "general";
        socket.join("general");

        if (!messages["general"]) messages["general"] = [];

        socket.emit("logged in", username);
        socket.emit("load messages", messages["general"]);

        io.emit("user list", users);
    });

    // JOIN ROOM
    socket.on("join room", (room) => {
        socket.leave(userRooms[socket.id]);
        socket.join(room);

        userRooms[socket.id] = room;

        if (!messages[room]) messages[room] = [];

        socket.emit("load messages", messages[room]);
    });

    // CHAT MESSAGE
    socket.on("chat message", (data) => {

        const room = userRooms[socket.id];

        const msg = {
            user: users[socket.id],
            text: data.text,
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            })
        };

        messages[room].push(msg);

        io.to(room).emit("chat message", msg);
    });

    // TYPING
    socket.on("typing", () => {
        const room = userRooms[socket.id];
        socket.to(room).emit("typing", users[socket.id]);
    });

    // DISCONNECT
    socket.on("disconnect", () => {
        delete users[socket.id];
        delete userRooms[socket.id];

        io.emit("user list", users);
    });
});

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
