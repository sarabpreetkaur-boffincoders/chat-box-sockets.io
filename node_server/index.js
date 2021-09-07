const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
app.use("/public", express.static("public"));
app.get("/", (req, res) => {
  try {
    //console.log(__dirname + "/index.html")
    res.sendFile("D:/chat_application/node_server/public/index.html");
  } catch (error) {
    res.send(error);
  }
});
const users = {};
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name || "");
  });

  socket.on("send", (message) => {
    socket.broadcast.emit("recieve", {
      message: message,
      name: users[socket.id],
    });
  });

  socket.on("disconnect",(message)=>{
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  })
});
server.listen(9005, () => {
  console.log("listening on *:9005");
});
