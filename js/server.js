const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: ["http://127.0.0.1:5502", "http://localhost:5502"],
    methods: ["GET", "POST"],
  },
});


// Store connected users
const users = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("new-user-joined", (name) => {
    console.log("New user:", name);
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });


  socket.on('send', (message) => {
    socket.broadcast.emit("receive", {message: message,name: users[socket.id],
    });
  });

  socket.on("disconnect", () => {
    const name = users[socket.id];
    delete users[socket.id];
    socket.broadcast.emit("leave", name);
    console.log("User disconnected:", name);
    delete users[socket.id];
  });
});

server.listen(8000, () => {
  console.log("Server running on http://127.0.0.1:8000");
});
