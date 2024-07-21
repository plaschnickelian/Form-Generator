const express = require('express'); //Load framework for routing and request handling and middelware
const cors = require('cors');// Load cross origin ressource sharing 
const bodyParser = require('body-parser');
const dotenv = require('dotenv');// Load environment variables from .env file

const userRoutes = require('./routes/userRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const { errorResponder, errorLogger } = require('./middleware/errorMiddleware.js');

let envFile;



switch (process.env.NODE_ENV) {
  case "dev": envFile = '.env.dev';
    break;
  default: envFile = '.env';
    break;
}
dotenv.config({ path: envFile });

const app = express();

app.use(cors({ origin: '*' }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/user', userRoutes)
app.use('/admin', adminRoutes)

app.use("/*", function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
})

app.use(errorLogger)
app.use(errorResponder)

module.exports = app;
