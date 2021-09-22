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
    // return { user: "postgres", password: "pg" };
    return { user: "nshsodqdoimnqo" };
};
const filterProps = (obj, props) => {
    Object.keys(obj).forEach((key) => !props.includes(key) ? delete obj[key] : null);
    return obj;
};
exports.allSettled = (promises) => {
    const wrappedPromises = promises.map((p) => Promise.resolve(p)
        .then(val => ({ status: "ok", result: val }), err => ({ status: err.name || "rejected", reason: filterProps(err, ["code", "detail", "constraint"]) })));
    return Promise.all(wrappedPromises);
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
        this.defaultResponse = (req, res, responseData) => {
            return res.json(responseData);
        };
        // Generic GET handler
        this.GET = (url, handler, responser) => {
            this.app.get(this.getUrl(url), async (req, res) => {
                // res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
                // res.setHeader("Access-Control-Allow-Origin", "*");
                let responseData = {};
                try {
                    const data = await handler(req);
                    responseData = { data, success: true };
                }
                catch (error) {
                    responseData = { error: (error instanceof Error) ? error.message : error, success: false };
                }
                return responser ? responser(req, res, responseData) : this.defaultResponse(req, res, responseData);
                /*
                try {
                  const data = await handler(req);
                  return res.json({ data, success: true });
                } catch (error) {
                  return res.json({ error: error.message || error, success: false });
                }
                */
            });
        };
        // generic GET handler with validation
        this.vGET = (url, validator, handler, responser) => {
            return this.GET(url, (req) => {
                const { error, value } = validator
                    ? validator(req)
                    : { error: null, value: null };
                if (error) {
                    throw new InvalidParamsError("invalid params: " + error);
                }
                return handler(req, value);
            }, responser);
        };
        // generic GET handler with validation and DB
        this.dbGET = (url, validator, handler, responser) => {
            return this.vGET(url, validator, (req, value) => {
                const db = db_1.dbPool.get(exports.getDBContext(req));
                return handler(db, value, req);
            }, responser);
        };
        // Generic POST handler
        this.POST = (url, handler, responser) => {
            this.app.post(this.getUrl(url), async (req, res) => {
                let responseData = {};
                try {
                    const data = await handler(req);
                    responseData = { data, success: true };
                }
                catch (error) {
                    responseData = { error: (error instanceof Error) ? error.message : error, success: false };
                }
                return responser ? responser(req, res, responseData) : this.defaultResponse(req, res, responseData);
                /*
                try {
                  const data = await handler(req);
                  return res.json({ data, success: true });
                } catch (error) {
                  return res.json({ error: error.message || error, success: false });
                }
                */
            });
        };
        // generic POST handler with validation
        this.vPOST = (url, validator, handler, responser) => {
            return this.POST(url, async (req) => {
                const { error, value } = validator
                    ? await validator(req)
                    : { error: null, value: null };
                if (error) {
                    throw new InvalidParamsError("invalid params: " + error);
                }
                return handler(req, value);
            }, responser);
        };
        // generic POST handler with validation and DB
        this.dbPOST = (url, validator, handler, responser) => {
            return this.vPOST(url, validator, (req, value) => {
                const db = db_1.dbPool.get(exports.getDBContext(req));
                return handler(db, value, req);
            }, responser);
        };
        // Generic PUT handler
        this.PUT = (url, handler, responser) => {
            this.app.put(this.getUrl(url), async (req, res) => {
                let responseData = {};
                try {
                    const data = await handler(req);
                    responseData = { data, success: true };
                }
                catch (error) {
                    responseData = { error: (error instanceof Error) ? error.message : error, success: false };
                }
                return responser ? responser(req, res, responseData) : this.defaultResponse(req, res, responseData);
                /*
                try {
                  const data = await handler(req);
                  return res.json({ data, success: true });
                } catch (error) {
                  return res.json({ error: error.message || error, success: false });
                }
                */
            });
        };
        // generic GET handler with validation
        this.vPUT = (url, validator, handler, responser) => {
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
            }, responser);
        };
        // generic GET handler with validation and DB
        this.dbPUT = (url, validator, handler, responser) => {
            return this.vPUT(url, validator, (req, value) => {
                const db = db_1.dbPool.get(exports.getDBContext(req));
                return handler(db, value);
            }, responser);
        };
        // Generic DELETE handler
        this.DELETE = (url, handler, responser) => {
            this.app.delete(this.getUrl(url), async (req, res) => {
                let responseData = {};
                try {
                    const data = await handler(req);
                    responseData = { data, success: true };
                }
                catch (error) {
                    responseData = { error: (error instanceof Error) ? error.message : error, success: false };
                }
                return responser ? responser(req, res, responseData) : this.defaultResponse(req, res, responseData);
                /*
                try {
                  const data = await handler(req);
                  return res.json({ data, success: true });
                } catch (error) {
                  return res.json({ error: error.message || error, success: false });
                }
                */
            });
        };
        // generic DELETE handler with validation
        this.vDELETE = (url, validator, handler, responser) => {
            return this.DELETE(url, async (req) => {
                const { error, value } = validator
                    ? await validator(req)
                    : { error: null, value: null };
                if (error) {
                    throw new InvalidParamsError("invalid params: " + error);
                }
                return handler(req, value);
            }, responser);
        };
        // generic DELETE handler with validation and DB
        this.dbDELETE = (url, validator, handler, responser) => {
            return this.vDELETE(url, validator, (req, value) => {
                const db = db_1.dbPool.get(exports.getDBContext(req));
                return handler(db, value);
            }, responser);
        };
        this.app = app;
        this.config = config;
    }
}
exports.Api = Api;
//# sourceMappingURL=handler.js.map