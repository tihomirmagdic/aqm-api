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

process.env.NODE_ENV = 'development';

import express = require('express');
import * as bodyParser from "body-parser";
import { db } from './db';

const app = express();
app.use(bodyParser.json());

// Config
import { config } from "./server/config";
import { defineRoutes } from "./server/api";

defineRoutes(app, config);

const port = 5000;

app.listen(port, () => {
    console.log('\nReady for GET and other requests on http://localhost:' + port);
});
