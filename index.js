import 'dotenv/config';
import express from 'express';
import http from 'http';
import mustacheExpress from 'mustache-express';
import { dirname } from 'path';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
// const express = require('express');
// const mustacheExpress = require('mustache-express');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;

app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', mustacheExpress());

app.get('/', (req, res) => {
  res.render('index');
});

io.on('connection', (socket) => {
  console.log('User terhubung..');

  socket.on('user-login', (data) => {
    console.log(`${data} Loginn`);
    socket.username = data;
    socket.broadcast.emit('user-login', `${data} telah bergabung!`);
  });

  socket.on('disconnect', () => {
    console.log('User menghilang..');
  });

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', `${socket.username} : ${msg}`);
  });

  socket.on('typing', (msg) => {
    if (msg) {
      socket.broadcast.emit('typing', `${socket.username} Sedang mengetik..`);
    } else {
      socket.broadcast.emit('typing', false);
    }
  });
});

server.listen(port, () => {
  console.log(`Running on port ${port}`);
});
