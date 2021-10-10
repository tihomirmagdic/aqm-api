/**
 *
 * Air quality measuring - REST API
 *
 * version 1.0
 * created by Tihomir Magdic
 * created 2020-3-30
 *
 * It uses PostgreSQL with pg-promise interface.
 * TODO: params, events, rules, log, security, config
 *
 * Note: code structure is mainly based on Vitaly Tomilov (author of pg-promise)
 * https://github.com/vitaly-t/pg-promise-demo
 *
 */

process.env.NODE_ENV = "development";

require('dotenv').config();
import express = require("express");
import os = require("os");
const cors = require("cors");
import helmet = require("helmet");

const app = express();
/*
app.use(
  cors({
    origin: "*",
    credentials: true
  })
);
*/
const options = {
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
    'X-prevent-preflight',
    'X-preflight-content-type'
  ],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: '*',
  maxAge: 60, // to eliminate preflight requests
  preflightContinue: false,
};
app.use(cors(options));

app.use((req: any, res: any, next: any) => {
  req.headers['content-type'] = 'application/json';

  if (req.headers['X-prevent-preflight']) {
    req.headers['Content-type'] = req.headers['X-preflight-content-type'];
  }

  next();
});

// app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(helmet());

// Config
import { config } from "./server/config";
import { defineRoutes } from "./server/api";

defineRoutes(app, config);

const port = process.env.PORT || 5000;

app.use((req, res, next) => {
  Promise.resolve()
    .then(() => {
      throw new Error("Path not found: " + req.originalUrl);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).end();
    });
});

interface ResponseError extends Error {
  status?: number;
}

app.use((error: ResponseError, req: any, res: any, next: any) => {
  console.error("Bad request", error);
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    console.error("JSON syntax error");
  }
  console.error(error.stack);
  res.status(400).end();
  // res.status(400).send('Bad request')
});

const server = app.listen(port, () => {
  console.log(
    // "\nReady for GET and other requests on http://localhost:" + port;
    "\nReady for GET and other requests on http://" + os.hostname() + ":" + port
  );
});
