"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
class InvalidParamsError extends Error {
    constructor(m) {
        super(m);
        Object.setPrototypeOf(this, InvalidParamsError.prototype);
    }
}
exports.InvalidParamsError = InvalidParamsError;
class UserNotLoggedInError extends Error {
    constructor(m) {
        super(m);
        Object.setPrototypeOf(this, UserNotLoggedInError.prototype);
    }
}
exports.UserNotLoggedInError = UserNotLoggedInError;
// fetcher for DBPool
exports.getDBContext = (req) => {
    // return { user: "testuser1", password: "pg" };
    //return { user: "postgres", password: "pg" };
    return { user: "nshsodqdoimnqo" };
};
exports.valid = (params, schema, options) => ({
    params,
    schema,
    options,
});
const check = (params, schema, options) => schema.validate(params, options);
exports.multiValidator = (c) => {
    const value = [];
    let r;
    const all = c.every((v) => {
        r = check(v.params, v.schema, v.options);
        value.push(r.value);
        return !r.error;
    });
    return all ? { value } : r; // return error
};
const defaultValidator = (params, sh) => {
    const result = exports.multiValidator([exports.valid(params, sh)]);
    console.log("defaultValidator:", result);
    return result;
};
exports.preparePolygonValues = (values) => {
    if (values) {
        if (values[0][0] !== values[values.length - 1][0] &&
            values[0][1] !== values[values.length - 1][1]) {
            values.push(values[0]);
        }
        if (values.length < 4) {
            throw new Error("Polygon with insufficient number of points");
        }
    }
    return values;
};
exports.checkModifiedId = (data, key) => {
    if (data.values[key]) {
        data.ids.map((item) => {
            item[key] = data.values.hasOwnProperty(key)
                ? data.values[key]
                : item[key];
        });
    }
};
exports.checkModifiedIDs = (data, keys) => {
    keys.forEach((key) => exports.checkModifiedId(data, key));
};
class Api {
    constructor(app, config) {
        this.URL = "/api/v1";
        this.getUrl = (endpoint) => {
            return this.URL + endpoint;
        };
        // Generic GET handler
        this.GET = (url, handler) => {
            this.app.get(this.getUrl(url), async (req, res) => {
                try {
                    const data = await handler(req);
                    return res.json({ data, success: true });
                }
                catch (error) {
                    return res.json({ error: error.message || error, success: false });
                }
            });
        };
        // generic GET handler with validation
        this.vGET = (url, validator, handler) => {
            return this.GET(url, (req) => {
                const { error, value } = validator
                    ? validator(req)
                    : { error: null, value: null };
                if (error) {
                    throw new InvalidParamsError("invalid params: " + error);
                }
                return handler(req, value);
            });
        };
        // generic GET handler with validation and DB
        this.dbGET = (url, validator, handler) => {
            return this.vGET(url, validator, (req, value) => {
                const db = db_1.dbPool.get(exports.getDBContext(req));
                return handler(db, value, req);
            });
        };
        // Generic POST handler
        this.POST = (url, handler) => {
            this.app.post(this.getUrl(url), async (req, res) => {
                try {
                    const data = await handler(req);
                    return res.json({ data, success: true });
                }
                catch (error) {
                    return res.json({ error: error.message || error, success: false });
                }
            });
        };
        // generic POST handler with validation
        this.vPOST = (url, validator, handler) => {
            return this.POST(url, async (req) => {
                const { error, value } = validator
                    ? await validator(req)
                    : { error: null, value: null };
                if (error) {
                    throw new InvalidParamsError("invalid params: " + error);
                }
                return handler(req, value);
            });
        };
        // generic POST handler with validation and DB
        this.dbPOST = (url, validator, handler) => {
            return this.vPOST(url, validator, (req, value) => {
                const db = db_1.dbPool.get(exports.getDBContext(req));
                return handler(db, value, req);
            });
        };
        // Generic PUT handler
        this.PUT = (url, handler) => {
            this.app.put(this.getUrl(url), async (req, res) => {
                try {
                    const data = await handler(req);
                    return res.json({ data, success: true });
                }
                catch (error) {
                    return res.json({ error: error.message || error, success: false });
                }
            });
        };
        // generic GET handler with validation
        this.vPUT = (url, validator, handler) => {
            return this.PUT(url, async (req) => {
                const { error, value } = validator
                    ? await validator(req)
                    : { error: null, value: null };
                if (error) {
                    throw new InvalidParamsError("invalid params: " + error);
                }
                // console.log("validated value:", JSON.stringify(value));
                // console.log("validated error:", error);
                return handler(req, value);
            });
        };
        // generic GET handler with validation and DB
        this.dbPUT = (url, validator, handler) => {
            return this.vPUT(url, validator, (req, value) => {
                const db = db_1.dbPool.get(exports.getDBContext(req));
                return handler(db, value);
            });
        };
        // Generic DELETE handler
        this.DELETE = (url, handler) => {
            this.app.delete(this.getUrl(url), async (req, res) => {
                try {
                    const data = await handler(req);
                    return res.json({ data, success: true });
                }
                catch (error) {
                    return res.json({ error: error.message || error, success: false });
                }
            });
        };
        // generic DELETE handler with validation
        this.vDELETE = (url, validator, handler) => {
            return this.DELETE(url, async (req) => {
                const { error, value } = validator
                    ? await validator(req)
                    : { error: null, value: null };
                if (error) {
                    throw new InvalidParamsError("invalid params: " + error);
                }
                return handler(req, value);
            });
        };
        // generic DELETE handler with validation and DB
        this.dbDELETE = (url, validator, handler) => {
            return this.vDELETE(url, validator, (req, value) => {
                const db = db_1.dbPool.get(exports.getDBContext(req));
                return handler(db, value);
            });
        };
        this.app = app;
        this.config = config;
    }
}
exports.Api = Api;
//# sourceMappingURL=handler.js.map