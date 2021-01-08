"use strict";

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const app = express();


app.use(
  helmet({
    frameguard: {
      action: 'deny',
    },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
      },
    },
  })
);
app.use(cors('*'));


module.exports = app;
