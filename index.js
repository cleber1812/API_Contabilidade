const express = require('express');
const cors = require('cors');
const routes = require('./routes/routes');
const app = express();

require('dotenv').config({path: './config/.env'});

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(routes);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "X-PINGOTHER, Content-Type, Authorization");
  app.use(cors());
  next();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.warn(`App listening on http://localhost:${PORT}`);
})
