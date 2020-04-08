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
process.env.NODE_ENV = 'development';
const express = require("express");
const bodyParser = __importStar(require("body-parser"));
const app = express();
app.use(bodyParser.json());
// Config
const config_1 = require("./server/config");
const api_1 = require("./server/api");
api_1.defineRoutes(app, config_1.config);
const port = 5000;
app.listen(port, () => {
    console.log('\nReady for GET and other requests on http://localhost:' + port);
});
//# sourceMappingURL=index.js.map