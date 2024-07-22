const db = require('./database/db');

const app = require('./app');
const http = require('http'); // Load https server

const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const HOSTNAME = process.env.HOSTNAME;

db.connectDB()
  .then(() => {
    server.listen(
      PORT, HOSTNAME,
      console.log(`Server ${HOSTNAME} running on port: ${PORT}`)
    )
  })
  .catch((err) => {
    console.log('Error: MongoDB not connected: ');
    console.log(err);
  })
