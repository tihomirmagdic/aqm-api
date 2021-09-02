"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handler_1 = require("./handler");
const default_schemas_1 = require("./default-schemas");
const devicetypes_1 = require("../db/repos/devicetypes");
const translations_1 = require("../db/repos/translations");
const dictionary_1 = require("../db/repos/dictionary");
const configurations_1 = require("../db/repos/configurations");
const configurationitems_1 = require("../db/repos/configurationitems");
const filters_1 = require("../db/repos/filters");
const filteritems_1 = require("../db/repos/filteritems");
const regiontypes_1 = require("../db/repos/regiontypes");
const regions_1 = require("../db/repos/regions");
const owners_1 = require("../db/repos/owners");
const firmwares_1 = require("../db/repos/firmwares");
const devices_1 = require("../db/repos/devices");
const data_1 = require("../db/repos/data");
// import { passport } from "../db/repos/passport-setup";
const passport = require('passport');
const passport_setup_1 = require("../db/repos/passport-setup");
exports.defineRoutes = (app, config) => {
    const routes = new handler_1.Api(app, config);
    //////////////////////////////////////////////
    // Device types REST API
    //////////////////////////////////////////////
    // get all device types
    routes.dbGET("/devicetypes", null, (db) => db.devicetypes.get());
    // get device types by IDs
    routes.dbPOST("/devicetypes", (req) => handler_1.multiValidator([handler_1.valid(req.body, default_schemas_1.shDefaultIDsAsText)]), (db, values) => db.devicetypes.getByIDs(values[0].ids));
    // create new device type
    routes.dbPOST("/devicetypes/:type", (req) => handler_1.multiValidator([handler_1.valid(req.params, default_schemas_1.shDefaultTypeCreate), handler_1.valid(req.body, devicetypes_1.shDeviceTypesCreate)]), (db, values) => db.devicetypes.add(values[0].type, values[1]));
    // update device type(s)
    routes.dbPUT("/devicetypes/:type", (req) => handler_1.multiValidator([handler_1.valid(req.params, default_schemas_1.shDefaultTypeUpdate), handler_1.valid(req.body, devicetypes_1.shDeviceTypesUpdate)]), (db, values) => db.devicetypes.update(values[0].type, values[1]));
    // remove device type(s)
    routes.dbDELETE("/devicetypes", (req) => handler_1.multiValidator([handler_1.valid(req.body, default_schemas_1.shDefaultIDsAsText)]), (db, values) => db.devicetypes.delete(values[0].ids));
    //////////////////////////////////////////////
    // Translations REST API
    //////////////////////////////////////////////
    // get all translations
    routes.dbGET("/translations", null, (db) => db.translations.get());
    // get translations by IDs
    routes.dbPOST("/translations", (req) => handler_1.multiValidator([handler_1.valid(req.body, default_schemas_1.shDefaultIDsAsText)]), (db, values) => db.translations.getByIDs(values[0].ids));
    // create new translation
    routes.dbPOST("/translations/:type", (req) => handler_1.multiValidator([handler_1.valid(req.params, default_schemas_1.shDefaultTypeCreate), handler_1.valid(req.body, translations_1.shTranslationsCreate)]), (db, values) => db.translations.add(values[0].type, values[1]));
    // update translation(s)
    routes.dbPUT("/translations/:type", (req) => handler_1.multiValidator([handler_1.valid(req.params, default_schemas_1.shDefaultTypeUpdate), handler_1.valid(req.body, translations_1.shTranslationsUpdate)]), (db, values) => db.translations.update(values[0].type, values[1]));
    // remove translation(s)
    routes.dbDELETE("/translations", (req) => handler_1.multiValidator([handler_1.valid(req.body, default_schemas_1.shDefaultIDsAsText)]), (db, values) => db.translations.delete(values[0].ids));
    //////////////////////////////////////////////
    // Dictionary REST API
    //////////////////////////////////////////////
    // get dictionary by translation
    routes.dbGET("/dictionary/:id", (req) => handler_1.multiValidator([handler_1.valid(req.params, default_schemas_1.shText)]), (db, values) => db.dictionary.getByTranslation(values[0].id));
    // get some dictionaries
    routes.dbPOST("/dictionary", (req) => handler_1.multiValidator([handler_1.valid(req.body, dictionary_1.shDictionaryIds)]), (db, values) => db.dictionary.getByIDs(values[0].ids));
    // create new translation
    routes.dbPOST("/dictionary/:type", (req) => handler_1.multiValidator([handler_1.valid(req.params, default_schemas_1.shDefaultTypeCreate), handler_1.valid(req.body, dictionary_1.shDictionaryCreate)]), (db, values) => db.dictionary.add(values[0].type, values[1]));
    // update translation(s)
    routes.dbPUT("/dictionary/:type", (req) => handler_1.multiValidator([handler_1.valid(req.params, default_schemas_1.shDefaultTypeUpdate), handler_1.valid(req.body, dictionary_1.shDictionaryUpdate)]), (db, values) => db.dictionary.update(values[0].type, values[1]));
    // remove translation(s)
    routes.dbDELETE("/dictionary", (req) => handler_1.multiValidator([handler_1.valid(req.body, dictionary_1.shDictionaryIds)]), (db, values) => db.dictionary.delete(values[0].ids));
    //////////////////////////////////////////////
    // Configurations REST API
    //////////////////////////////////////////////
    // get all configurations
    routes.dbGET("/config", null, (db) => db.configurations.get());
    // get configurations by IDs
    routes.dbPOST("/config", (req) => handler_1.multiValidator([handler_1.valid(req.body, default_schemas_1.shDefaultIDsAsText)]), (db, values) => db.configurations.getByIDs(values[0].ids));
    // create new configuration
    routes.dbPOST("/config/:type", (req) => handler_1.multiValidator([handler_1.valid(req.params, default_schemas_1.shDefaultTypeCreate), handler_1.valid(req.body, configurations_1.shConfigurationsCreate)]), (db, values) => db.configurations.add(values[0].type, values[1]));
    // update configuration(s)
    routes.dbPUT("/config/:type", (req) => handler_1.multiValidator([handler_1.valid(req.params, default_schemas_1.shDefaultTypeUpdate), handler_1.valid(req.body, configurations_1.shConfigurationsUpdate)]), (db, values) => db.configurations.update(values[0].type, values[1]));
    // remove configuration(s)
    routes.dbDELETE("/config", (req) => handler_1.multiValidator([handler_1.valid(req.body, default_schemas_1.shDefaultIDsAsText)]), (db, values) => db.configurations.delete(values[0].ids));
    //////////////////////////////////////////////
    // Configuration items REST API
    //////////////////////////////////////////////
    // get all configuration items
    routes.dbGET("/config-items", null, (db) => db.configurationitems.get());
    // get configuration items by configuration
    routes.dbGET("/config-items/:id", (req) => handler_1.multiValidator([handler_1.valid(req.params, default_schemas_1.shText)]), (db, values) => db.configurationitems.getByConfiguration(values[0].id));
    // get configuration items by IDs
    routes.dbPOST("/config-items", (req) => handler_1.multiValidator([handler_1.valid(req.body, configurationitems_1.shConfigurationItemsIds)]), (db, values) => db.configurationitems.getByIDs(values[0].ids));
    // create new configuration item
    routes.dbPOST("/config-items/:type", (req) => handler_1.multiValidator([handler_1.valid(req.params, default_schemas_1.shDefaultTypeCreate), handler_1.valid(req.body, configurationitems_1.shConfigurationItemsCreate)]), (db, values) => db.configurationitems.add(values[0].type, values[1]));
    // update configuration item(s)
    routes.dbPUT("/config-items/:type", (req) => handler_1.multiValidator([handler_1.valid(req.params, default_schemas_1.shDefaultTypeUpdate), handler_1.valid(req.body, configurationitems_1.shConfigurationItemsUpdate)]), (db, values) => db.configurationitems.update(values[0].type, values[1]));
    // remove configuration item(s)
    routes.dbDELETE("/config-items", (req) => handler_1.multiValidator([handler_1.valid(req.body, configurationitems_1.shConfigurationItemsIds)]), (db, values) => db.configurationitems.delete(values[0].ids));
    //////////////////////////////////////////////
    // Filters REST API
    //////////////////////////////////////////////
    // get all filters
    routes.dbGET("/filters", null, (db) => db.filters.get());
    // get filters by IDs
    routes.dbPOST("/filters", (req) => handler_1.multiValidator([handler_1.valid(req.body, default_schemas_1.shDefaultIDs)]), (db, values) => db.filters.getByIDs(values[0].ids));
    // create new filter
    routes.dbPOST("/filters/:type", (req) => handler_1.multiValidator([handler_1.valid(req.params, default_schemas_1.shDefaultTypeCreate), handler_1.valid(req.body, filters_1.shFiltersCreate)]), (db, values) => db.filters.add(values[0].type, values[1]));
    // update filter(s)
    routes.dbPUT("/filters/:type", (req) => handler_1.multiValidator([handler_1.valid(req.params, default_schemas_1.shDefaultTypeUpdate), handler_1.valid(req.body, filters_1.shFiltersUpdate)]), (db, values) => db.filters.update(values[0].type, values[1]));
    // remove filter(s)
    routes.dbDELETE("/filters", (req) => handler_1.multiValidator([handler_1.valid(req.body, default_schemas_1.shDefaultIDs)]), (db, values) => db.filters.delete(values[0].ids));
    //////////////////////////////////////////////
    // Filter items REST API
    //////////////////////////////////////////////
    // get all filter items
    routes.dbGET("/filter-items", null, (db) => db.filteritems.get());
    // get filter items by filter
    routes.dbGET("/filter-items/:id", (req) => handler_1.multiValidator([handler_1.valid(req.params, default_schemas_1.shText)]), (db, values) => db.filteritems.getByFilter(values[0].id));
    // get filter items by IDs
    routes.dbPOST("/filter-items", (req) => handler_1.multiValidator([handler_1.valid(req.body, filteritems_1.shFilterItemsIds)]), (db, values) => db.filteritems.getByIDs(values[0].ids));
    // create new filter item
    routes.dbPOST("/filter-items/:type", (req) => handler_1.multiValidator([handler_1.valid(req.params, default_schemas_1.shDefaultTypeCreate), handler_1.valid(req.body, filteritems_1.shFilterItemsCreate)]), (db, values) => db.filteritems.add(values[0].type, values[1]));
    // update filter item(s)
    routes.dbPUT("/filter-items/:type", (req) => handler_1.multiValidator([handler_1.valid(req.params, default_schemas_1.shDefaultTypeUpdate), handler_1.valid(req.body, filteritems_1.shFilterItemsUpdate)]), (db, values) => db.filteritems.update(values[0].type, values[1]));
    // remove filter item(s)
    routes.dbDELETE("/filter-items", (req) => handler_1.multiValidator([handler_1.valid(req.body, filteritems_1.shFilterItemsIds)]), (db, values) => db.filteritems.delete(values[0].ids));
    //////////////////////////////////////////////
    // Region types REST API
    //////////////////////////////////////////////
    // get all region types
    routes.dbGET("/regiontypes", null, (db) => db.regiontypes.get());
    // get region types by IDs
    routes.dbPOST("/regiontypes", (req) => handler_1.multiValidator([handler_1.valid(req.body, default_schemas_1.shDefaultIDsAsText)]), (db, values) => db.regiontypes.getByIDs(values[0].ids));
    // create new region type
    routes.dbPOST("/regiontypes/:type", (req) => handler_1.multiValidator([handler_1.valid(req.params, default_schemas_1.shDefaultTypeCreate), handler_1.valid(req.body, regiontypes_1.shRegionTypesCreate)]), (db, values) => db.regiontypes.add(values[0].type, values[1]));
    // update region type(s)
    routes.dbPUT("/regiontypes/:type", (req) => handler_1.multiValidator([handler_1.valid(req.params, default_schemas_1.shDefaultTypeUpdate), handler_1.valid(req.body, regiontypes_1.shRegionTypesUpdate)]), (db, values) => db.regiontypes.update(values[0].type, values[1]));
    // remove region type(s)
    routes.dbDELETE("/regiontypes", (req) => handler_1.multiValidator([handler_1.valid(req.body, default_schemas_1.shDefaultIDsAsText)]), (db, values) => db.regiontypes.delete(values[0].ids));
    //////////////////////////////////////////////
    // Regions REST API
    //////////////////////////////////////////////
    // get all regions
    routes.dbGET("/regions", null, (db) => db.regions.get());
    // get regions by IDs
    routes.dbPOST("/regions", (req) => handler_1.multiValidator([handler_1.valid(req.body, default_schemas_1.shDefaultIDsAsText)]), (db, values) => db.regions.getByIDs(values[0].ids));
    // create new region
    routes.dbPOST("/regions/:type", (req) => handler_1.multiValidator([handler_1.valid(req.params, default_schemas_1.shDefaultTypeCreate), handler_1.valid(req.body, regions_1.shRegionsCreate)]), (db, values) => db.regions.add(values[0].type, values[1]));
    // update region(s)
    routes.dbPUT("/regions/:type", (req) => handler_1.multiValidator([handler_1.valid(req.params, default_schemas_1.shDefaultTypeUpdate), handler_1.valid(req.body, regions_1.shRegionsUpdate)]), (db, values) => db.regions.update(values[0].type, values[1]));
    // remove region(s)
    routes.dbDELETE("/regions", (req) => handler_1.multiValidator([handler_1.valid(req.body, default_schemas_1.shDefaultIDsAsText)]), (db, values) => db.regions.delete(values[0].ids));
    //////////////////////////////////////////////
    // Owners REST API
    //////////////////////////////////////////////
    // get all owners
    routes.dbGET("/owners", null, (db) => db.owners.get());
    // get owners by IDs
    routes.dbPOST("/owners", (req) => handler_1.multiValidator([handler_1.valid(req.body, default_schemas_1.shDefaultIDs)]), (db, values) => db.owners.getByIDs(values[0].ids));
    // create new owner
    routes.dbPOST("/owners/:type", (req) => handler_1.multiValidator([handler_1.valid(req.params, default_schemas_1.shDefaultTypeCreate), handler_1.valid(req.body, owners_1.shOwnersCreate)]), (db, values) => db.owners.add(values[0].type, values[1]));
    // update owner(s)
    routes.dbPUT("/owners/:type", (req) => handler_1.multiValidator([handler_1.valid(req.params, default_schemas_1.shDefaultTypeUpdate), handler_1.valid(req.body, owners_1.shOwnersUpdate)]), (db, values) => db.owners.update(values[0].type, values[1]));
    // remove owner(s)
    routes.dbDELETE("/owners", (req) => handler_1.multiValidator([handler_1.valid(req.body, default_schemas_1.shDefaultIDs)]), (db, values) => db.owners.delete(values[0].ids));
    //////////////////////////////////////////////
    // Auth REST API
    //////////////////////////////////////////////
    passport_setup_1.setup(app, passport);
    const ensureAuthenticated = (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login');
    };
    app.get("/api/v1/auth/test", (req, res) => {
        if (req.user) {
            // res.send("user " + req.user.email + " logged in");
            res.status(200).json({ currentuser: { name: req.user.name, email: req.user.email, admin: req.user.admin }, success: true });
        }
        else {
            // res.send("user not logged in");
            res.status(401).end('Unauthorized'); // .send("user not logged in");
        }
    });
    app.get("/api/v1/auth/currentuser", (req, res) => {
        if (req.user) {
            // res.send("user " + req.user.email + " logged in");
            res.status(200).json({ currentuser: { name: req.user.name, email: req.user.email, admin: req.user.admin }, success: true });
        }
        else {
            // res.send("user not logged in");
            res.status(401).end('Unauthorized'); // .send("user not logged in");
        }
    });
    // login - type is google, facebook
    // routes.dbPOST(["/auth/:type", "/login/:type"]
    app.get("/aapi/v1/auth/google", (req, res, next) => {
        // res.setHeader("Access-Control-Allow-Origin", "*");
        next();
    }, passport.authenticate('google', { scope: ['email', 'profile'] }));
    app.get("/api/v1/auth/google", passport.authenticate('google', { scope: ['email', 'profile'] }), (req, res) => {
        console.log("google auth");
        res.send("google auth");
    });
    app.get("/api/v1/auth/facebook", passport.authenticate('facebook', { scope: ['email'] }), (req, res) => {
        console.log("facebook auth");
        res.send("facebook auth");
    });
    const signToken = (user) => {
        return user;
    };
    app.post("/api/v1/auth/local", passport.authenticate('local'), (req, res) => {
        console.log("local auth with user:", req.user);
        /*
        const token = signToken(req.user);
    res.cookie('access_token', token, {
      httpOnly: true
        });
        */
        res.status(200).json({ user: { name: req.user.name, email: req.user.email, admin: req.user.admin }, success: true });
    });
    app.get("/api/v1/auth/google/redirect", passport.authenticate('google'), (req, res) => {
        // res.send("google auth redirected");
        res.redirect("http://localhost:4200/auth");
        // res.status(200).json(req.user);
    });
    app.get("/api/v1/auth/facebook/redirect", passport.authenticate('facebook'), (req, res) => {
        // res.send("facebook auth redirected");
        res.redirect("http://localhost:4200/auth");
        // res.status(200).json(req.user);
    });
    app.delete("/api/v1/auth", (req, res) => {
        console.log("before logout");
        if (req.logout) {
            console.log("user logged out");
            req.logout();
            // res.clearCookie('access_token');
        }
        console.log("after logout");
        res.status(200).json({ success: true });
    });
    /*
    routes.dbPOST("/auth",
        (req: Request) => multiValidator([valid(req.body, shAuthCreateLocal)]),
        (db: DB, values: any[]) => db.auth.create(values[0]));
    */
    // logout
    routes.dbDELETE("/auth", null, (db, values) => db.auth.delete());
    //////////////////////////////////////////////
    // Firmwares REST API
    //////////////////////////////////////////////
    // get all firmwares
    routes.dbGET("/firmwares", null, (db) => db.firmwares.get());
    // get firmwares by IDs
    routes.dbPOST("/firmwares", (req) => handler_1.multiValidator([handler_1.valid(req.body, default_schemas_1.shDefaultIDs)]), (db, values) => db.firmwares.getByIDs(values[0].ids));
    // create new firmware
    routes.dbPOST("/firmwares/:type", (req) => handler_1.multiValidator([handler_1.valid(req.params, default_schemas_1.shDefaultTypeCreate), handler_1.valid(req.body, firmwares_1.shFirmwaresCreate)]), (db, values) => db.firmwares.add(values[0].type, values[1]));
    // update firmware(s)
    routes.dbPUT("/firmwares/:type", (req) => handler_1.multiValidator([handler_1.valid(req.params, default_schemas_1.shDefaultTypeUpdate), handler_1.valid(req.body, firmwares_1.shFirmwaresUpdate)]), (db, values) => db.firmwares.update(values[0].type, values[1]));
    // remove firmware(s)
    routes.dbDELETE("/firmwares", (req) => handler_1.multiValidator([handler_1.valid(req.body, default_schemas_1.shDefaultIDs)]), (db, values) => db.firmwares.delete(values[0].ids));
    //////////////////////////////////////////////
    // Devices REST API
    //////////////////////////////////////////////
    // get all devices
    routes.dbGET("/devices", null, (db) => db.devices.get());
    // get devices by IDs
    routes.dbPOST("/devices", (req) => handler_1.multiValidator([handler_1.valid(req.body, default_schemas_1.shDefaultIDs)]), (db, values) => db.devices.getByIDs(values[0].ids));
    // get devices by owner
    routes.dbGET("/devices/:id", (req) => handler_1.multiValidator([handler_1.valid(req.params, default_schemas_1.shID)]), (db, values) => db.devices.getByOwner(values[0].id));
    // create new device
    routes.dbPOST("/devices/:type", (req) => handler_1.multiValidator([handler_1.valid(req.params, default_schemas_1.shDefaultTypeCreate), handler_1.valid(req.body, devices_1.shDevicesCreate)]), (db, values) => db.devices.add(values[0].type, values[1]));
    // update device(s)
    routes.dbPUT("/devices/:type", (req) => handler_1.multiValidator([handler_1.valid(req.params, default_schemas_1.shDefaultTypeUpdate), handler_1.valid(req.body, devices_1.shDevicesUpdate)]), (db, values) => db.devices.update(values[0].type, values[1]));
    // remove device(s)
    routes.dbDELETE("/devices", (req) => handler_1.multiValidator([handler_1.valid(req.body, default_schemas_1.shDefaultIDs)]), (db, values) => db.devices.delete(values[0].ids));
    //////////////////////////////////////////////
    // Data REST API
    //////////////////////////////////////////////
    // get data (first page)
    routes.dbPOST("/data", // first page
    (req) => handler_1.multiValidator([handler_1.valid(req.body, data_1.shDataRetreive)]), (db, values) => db.data.get(1, values[0]));
    // get data (with page)
    routes.dbPOST("/data/:page", (req) => handler_1.multiValidator([handler_1.valid(req.params, data_1.shDataRetrievePage), handler_1.valid(req.body, data_1.shDataRetreive)]), (db, values) => db.data.get(values[0].page, values[1]));
    //////////////////////////////////////////////
    // Telemetry REST API
    //////////////////////////////////////////////
    // create new data
    routes.dbPOST("/telemetry/:type", (req) => handler_1.multiValidator([handler_1.valid(req.params, data_1.shshTypeCreateData), handler_1.valid({ "apikey": req.headers.apikey }, data_1.shDataCreateHeader), handler_1.valid(req.body, data_1.shDataCreate)]), (db, values) => db.data.add(values[0].type, values[1].apikey, values[2]));
};
//# sourceMappingURL=api.js.map