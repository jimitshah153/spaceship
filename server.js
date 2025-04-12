const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('voice', (data) => {
    socket.broadcast.emit('voice', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Set host and port
const HOST = '0.0.0.0'; // Listen on all network interfaces
const PORT = 3001;

server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
