"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handler_1 = require("./handler");
const default_schemas_1 = require("./default-schemas");
const devicetypes_1 = require("../db/repos/devicetypes");
const configurations_1 = require("../db/repos/configurations");
const configurationitems_1 = require("../db/repos/configurationitems");
const regiontypes_1 = require("../db/repos/regiontypes");
const regions_1 = require("../db/repos/regions");
const owners_1 = require("../db/repos/owners");
const firmwares_1 = require("../db/repos/firmwares");
const devices_1 = require("../db/repos/devices");
const data_1 = require("../db/repos/data");
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
    // Configurations REST API
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