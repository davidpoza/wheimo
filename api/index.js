"use strict";
require('dotenv').config();

const app = require('./app');
const port = 8080;

app.listen(port, () => {
  console.log('Server running on: localhost:' + port);
});

process.on('SIGINT', function () {
  // control exit....
  process.exit(0);
});

process.on('uncaughtException', function () {
  // control exit....
  process.exit(0);
});
