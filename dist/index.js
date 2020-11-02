"use strict";
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_ENV = "development";
require('dotenv').config();
const express = require("express");
const bodyParser = __importStar(require("body-parser"));
const os = require("os");
const cors = require("cors");
const app = express();
app.use(cors({
    origin: "*",
    credentials: true
}));
/*
const options = {
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
  ],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: '*',
  preflightContinue: false,
};
app.use(cors(options));
*/
app.use(bodyParser.json());
// Config
const config_1 = require("./server/config");
const api_1 = require("./server/api");
api_1.defineRoutes(app, config_1.config);
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
app.use((error, req, res, next) => {
    console.error("Bad request", error);
    if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
        console.error("JSON syntax error");
    }
    console.error(error.stack);
    res.status(400).end();
    //res.status(400).send('Bad request')
});
const server = app.listen(port, () => {
    console.log(
    //"\nReady for GET and other requests on http://localhost:" + port;
    "\nReady for GET and other requests on http://" + os.hostname() + ":" + port);
});
//# sourceMappingURL=index.js.map