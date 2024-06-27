const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const cors = require('cors');
app.use(cors());

const users = {
  "Samuel": "12062006YT"
};

// Serve la cartella 'public' come root iniziale
app.use(express.static('public'));


io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("getPlan", (data) => {
    const { name, password } = data;
    if (users[name] && users[name] === password) {
      console.log(`User authenticated: ${name}`);

      // Cambia la root delle risorse statiche per questo client specifico
      socket.emit('authenticated', { success: true });
    } else {
      console.log(`User authentication failed: ${name}`);
      socket.emit("authenticated", { success: false });
    }
  });
});

// Middleware per servire le risorse statiche in base all'autenticazione
app.get('/scheda', (req, res, next) => {
  const name = req.query.name;
  if (users[name]) {
    app.use(express.static(path.join(__dirname, 'schede', `scheda${name}`)));
    res.sendFile(path.join(__dirname, 'schede', `scheda${name}`, 'index.html'));
  } else {
    res.status(403).send('Access Denied');
  }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, function() {
    console.log(`Server in ascolto sulla porta ${PORT}`);
});
