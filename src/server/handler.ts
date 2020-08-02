import { Request, Response } from "express";
import * as Joi from "@hapi/joi";
import { DB, dbPool } from "../db";
import { any } from "bluebird";

export class InvalidParamsError extends Error {
  constructor(m: string) {
    super(m);
    Object.setPrototypeOf(this, InvalidParamsError.prototype);
  }
}

export class UserNotLoggedInError extends Error {
  constructor(m: string) {
    super(m);
    Object.setPrototypeOf(this, UserNotLoggedInError.prototype);
  }
}

// fetcher for DBPool
export const getDBContext = (req?: Request) => {
  // return { user: "testuser1", password: "pg" };
  //return { user: "postgres", password: "pg" };
  return {};
};

interface Validation {
  params: any;
  schema: any;
  options?: any;
}

export const valid = (params: any, schema: any, options?: any): Validation => ({
  params,
  schema,
  options,
});

const check = (params: any, schema: any, options?: any) =>
  schema.validate(params, options);

export const multiValidator = (c: Validation[]) => {
  const value: any[] = [];
  let r;
  const all = c.every((v: Validation) => {
    r = check(v.params, v.schema, v.options);
    value.push(r.value);
    return !r.error;
  });
  return all ? { value } : r; // return error
};

const defaultValidator = (params: any, sh: any) => {
  const result = multiValidator([valid(params, sh)]);
  console.log("defaultValidator:", result);
  return result;
};

export const preparePolygonValues = (values: any) => {
  if (values) {
    if (
      values[0][0] !== values[values.length - 1][0] &&
      values[0][1] !== values[values.length - 1][1]
    ) {
      values.push(values[0]);
    }
    if (values.length < 4) {
      throw new Error("Polygon with insufficient number of points");
    }
  }
  return values;
};

export const checkModifiedId = (data: any, key: string) => {
  if (data.values[key]) {
    data.ids.map((item: any) => {
      item[key] = data.values.hasOwnProperty(key)
        ? data.values[key]
        : item[key];
    });
  }
};

export const checkModifiedIDs = (data: any, keys: string[]) => {
  keys.forEach((key: string) => checkModifiedId(data, key));
};

export class Api {
  private app: any;
  private config: any;
  private URL = "/api/v1";

  constructor(app: any, config: any) {
    this.app = app;
    this.config = config;
  }

  private getUrl = (endpoint: string): string => {
    return this.URL + endpoint;
  };

  // Generic GET handler
  public GET = (url: string, handler: (req: Request) => any) => {
    this.app.get(this.getUrl(url), async (req: Request, res: Response) => {
      try {
        const data = await handler(req);
        return res.json({ data, success: true });
      } catch (error) {
        return res.json({ error: error.message || error, success: false });
      }
    });
  };

  // generic GET handler with validation
  public vGET = (
    url: string,
    validator: (req: Request) => any,
    handler: (req: Request, value: any) => any
  ) => {
    return this.GET(url, (req: Request) => {
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
  public dbGET = (
    url: string,
    validator: (req: Request) => any,
    handler: (db: DB, value: any, req: Request) => any
  ) => {
    return this.vGET(url, validator, (req: Request, value: any) => {
      const db = dbPool.get(getDBContext(req));
      return handler(db, value, req);
    });
  };

  // Generic POST handler
  public POST = (url: string, handler: (req: Request) => any) => {
    this.app.post(this.getUrl(url), async (req: Request, res: Response) => {
      try {
        const data = await handler(req);
        return res.json({ data, success: true });
      } catch (error) {
        return res.json({ error: error.message || error, success: false });
      }
    });
  };

  // generic POST handler with validation
  public vPOST = (
    url: string,
    validator: (req: Request) => any,
    handler: (req: Request, value: any) => any
  ) => {
    return this.POST(url, async (req: Request) => {
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
  public dbPOST = (
    url: string,
    validator: (req: Request) => any,
    handler: (db: DB, value: any, req: Request) => any
  ) => {
    return this.vPOST(url, validator, (req: Request, value: any) => {
      const db = dbPool.get(getDBContext(req));
      return handler(db, value, req);
    });
  };

  // Generic PUT handler
  public PUT = (url: string, handler: (req: Request) => any) => {
    this.app.put(this.getUrl(url), async (req: Request, res: Response) => {
      try {
        const data = await handler(req);
        return res.json({ data, success: true });
      } catch (error) {
        return res.json({ error: error.message || error, success: false });
      }
    });
  };

  // generic GET handler with validation
  public vPUT = (
    url: string,
    validator: (req: Request) => any,
    handler: (req: Request, value: any) => any
  ) => {
    return this.PUT(url, async (req: Request) => {
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
  public dbPUT = (
    url: string,
    validator: (req: Request) => any,
    handler: (db: DB, value: any) => any
  ) => {
    return this.vPUT(url, validator, (req: Request, value: any) => {
      const db = dbPool.get(getDBContext(req));
      return handler(db, value);
    });
  };

  // Generic DELETE handler
  public DELETE = (url: string, handler: (req: Request) => any) => {
    this.app.delete(this.getUrl(url), async (req: Request, res: Response) => {
      try {
        const data = await handler(req);
        return res.json({ data, success: true });
      } catch (error) {
        return res.json({ error: error.message || error, success: false });
      }
    });
  };

  // generic DELETE handler with validation
  public vDELETE = (
    url: string,
    validator: (req: Request) => any,
    handler: (req: Request, value: any) => any
  ) => {
    return this.DELETE(url, async (req: Request) => {
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
  public dbDELETE = (
    url: string,
    validator: (req: Request) => any,
    handler: (db: DB, value: any) => any
  ) => {
    return this.vDELETE(url, validator, (req: Request, value: any) => {
      const db = dbPool.get(getDBContext(req));
      return handler(db, value);
    });
  };
}
