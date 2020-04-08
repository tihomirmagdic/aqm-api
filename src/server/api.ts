import { Request } from "express";
import { DB } from "../db";
import { multiValidator, valid, Api } from "./handler";

import { shID, shDefaultIDs, shDefaultIDsAsText, shText, shDefaultTypeCreate, shDefaultTypeUpdate } from "./default-schemas";

import { shDeviceTypesCreate, shDeviceTypesUpdate } from "../db/repos/devicetypes";
import { shConfigurationsCreate, shConfigurationsUpdate } from "../db/repos/configurations";
import { shConfigurationItemsIds, shConfigurationItemsCreate, shConfigurationItemsUpdate } from "../db/repos/configurationitems";
import { shRegionTypesCreate, shRegionTypesUpdate } from "../db/repos/regiontypes";
import { shRegionsCreate, shRegionsUpdate } from "../db/repos/regions";
import { shOwnersCreate, shOwnersUpdate } from "../db/repos/owners";
import { shFirmwaresCreate, shFirmwaresUpdate } from "../db/repos/firmwares";
import { shDevicesCreate, shDevicesUpdate } from "../db/repos/devices";
import { shDataRetrievePage, shshTypeCreateData, shDataCreateHeader, shDataCreate, shDataRetreive } from "../db/repos/data";

export const defineRoutes = (app: any, config: any) => {
	const routes: any = new Api(app, config);

	//////////////////////////////////////////////
	// Device types REST API
	//////////////////////////////////////////////

	// get all device types
	routes.dbGET("/devicetypes", null,
		(db: DB) => db.devicetypes.get());

	// get device types by IDs
	routes.dbPOST("/devicetypes",
		(req: Request) => multiValidator([valid(req.body, shDefaultIDsAsText)]),
		(db: DB, values: any[]) => db.devicetypes.getByIDs(values[0].ids));

	// create new device type
	routes.dbPOST("/devicetypes/:type",
		(req: Request) => multiValidator([valid(req.params, shDefaultTypeCreate), valid(req.body, shDeviceTypesCreate)]),
		(db: DB, values: any[]) => db.devicetypes.add(values[0].type, values[1]));

	// update device type(s)
	routes.dbPUT("/devicetypes/:type",
		(req: Request) => multiValidator([valid(req.params, shDefaultTypeUpdate), valid(req.body, shDeviceTypesUpdate)]),
		(db: DB, values: any[]) => db.devicetypes.update(values[0].type, values[1]));

	// remove device type(s)
	routes.dbDELETE("/devicetypes",
		(req: Request) => multiValidator([valid(req.body, shDefaultIDsAsText)]),
		(db: DB, values: any) => db.devicetypes.delete(values[0].ids));

	//////////////////////////////////////////////
	// Configurations REST API
	//////////////////////////////////////////////

	// get all configurations
	routes.dbGET("/config", null,
		(db: DB) => db.configurations.get());

	// get configurations by IDs
	routes.dbPOST("/config",
		(req: Request) => multiValidator([valid(req.body, shDefaultIDsAsText)]),
		(db: DB, values: any[]) => db.configurations.getByIDs(values[0].ids));

	// create new configuration
	routes.dbPOST("/config/:type",
		(req: Request) => multiValidator([valid(req.params, shDefaultTypeCreate), valid(req.body, shConfigurationsCreate)]),
		(db: DB, values: any[]) => db.configurations.add(values[0].type, values[1]));

	// update configuration(s)
	routes.dbPUT("/config/:type",
		(req: Request) => multiValidator([valid(req.params, shDefaultTypeUpdate), valid(req.body, shConfigurationsUpdate)]),
		(db: DB, values: any[]) => db.configurations.update(values[0].type, values[1]));

	// remove configuration(s)
	routes.dbDELETE("/config",
		(req: Request) => multiValidator([valid(req.body, shDefaultIDsAsText)]),
		(db: DB, values: any) => db.configurations.delete(values[0].ids));

	//////////////////////////////////////////////
	// Configurations REST API
	//////////////////////////////////////////////

	// get all configuration items
	routes.dbGET("/config-items", null,
		(db: DB) => db.configurationitems.get());

	// get configuration items by configuration
	routes.dbGET("/config-items/:id",
		(req: Request) => multiValidator([valid(req.params, shText)]),
		(db: DB, values: any[]) => db.configurationitems. getByConfiguration(values[0].id));

	// get configuration items by IDs
	routes.dbPOST("/config-items",
		(req: Request) => multiValidator([valid(req.body, shConfigurationItemsIds)]),
		(db: DB, values: any[]) => db.configurationitems.getByIDs(values[0].ids));

	// create new configuration item
	routes.dbPOST("/config-items/:type",
		(req: Request) => multiValidator([valid(req.params, shDefaultTypeCreate), valid(req.body, shConfigurationItemsCreate)]),
		(db: DB, values: any[]) => db.configurationitems.add(values[0].type, values[1]));

	// update configuration item(s)
	routes.dbPUT("/config-items/:type",
		(req: Request) => multiValidator([valid(req.params, shDefaultTypeUpdate), valid(req.body, shConfigurationItemsUpdate)]),
		(db: DB, values: any[]) => db.configurationitems.update(values[0].type, values[1]));

	// remove configuration item(s)
	routes.dbDELETE("/config-items",
		(req: Request) => multiValidator([valid(req.body, shConfigurationItemsIds)]),
		(db: DB, values: any) => db.configurationitems.delete(values[0].ids));

	//////////////////////////////////////////////
	// Region types REST API
	//////////////////////////////////////////////

	// get all region types
	routes.dbGET("/regiontypes", null,
		(db: DB) => db.regiontypes.get());

	// get region types by IDs
	routes.dbPOST("/regiontypes",
		(req: Request) => multiValidator([valid(req.body, shDefaultIDsAsText)]),
		(db: DB, values: any[]) => db.regiontypes.getByIDs(values[0].ids));

	// create new region type
	routes.dbPOST("/regiontypes/:type",
		(req: Request) => multiValidator([valid(req.params, shDefaultTypeCreate), valid(req.body, shRegionTypesCreate)]),
		(db: DB, values: any[]) => db.regiontypes.add(values[0].type, values[1]));

	// update region type(s)
	routes.dbPUT("/regiontypes/:type",
		(req: Request) => multiValidator([valid(req.params, shDefaultTypeUpdate), valid(req.body, shRegionTypesUpdate)]),
		(db: DB, values: any[]) => db.regiontypes.update(values[0].type, values[1]));

	// remove region type(s)
	routes.dbDELETE("/regiontypes",
		(req: Request) => multiValidator([valid(req.body, shDefaultIDsAsText)]),
		(db: DB, values: any) => db.regiontypes.delete(values[0].ids));

	//////////////////////////////////////////////
	// Regions REST API
	//////////////////////////////////////////////

	// get all regions
	routes.dbGET("/regions", null,
		(db: DB) => db.regions.get());

	// get regions by IDs
	routes.dbPOST("/regions",
		(req: Request) => multiValidator([valid(req.body, shDefaultIDsAsText)]),
		(db: DB, values: any[]) => db.regions.getByIDs(values[0].ids));

	// create new region
	routes.dbPOST("/regions/:type",
		(req: Request) => multiValidator([valid(req.params, shDefaultTypeCreate), valid(req.body, shRegionsCreate)]),
		(db: DB, values: any[]) => db.regions.add(values[0].type, values[1]));

	// update region(s)
	routes.dbPUT("/regions/:type",
		(req: Request) => multiValidator([valid(req.params, shDefaultTypeUpdate), valid(req.body, shRegionsUpdate)]),
		(db: DB, values: any[]) => db.regions.update(values[0].type, values[1]));

	// remove region(s)
	routes.dbDELETE("/regions",
		(req: Request) => multiValidator([valid(req.body, shDefaultIDsAsText)]),
		(db: DB, values: any) => db.regions.delete(values[0].ids));

	//////////////////////////////////////////////
	// Owners REST API
	//////////////////////////////////////////////

	// get all owners
	routes.dbGET("/owners", null,
		(db: DB) => db.owners.get());

	// get owners by IDs
	routes.dbPOST("/owners",
		(req: Request) => multiValidator([valid(req.body, shDefaultIDs)]),
		(db: DB, values: any[]) => db.owners.getByIDs(values[0].ids));

	// create new owner
	routes.dbPOST("/owners/:type",
		(req: Request) => multiValidator([valid(req.params, shDefaultTypeCreate), valid(req.body, shOwnersCreate)]),
		(db: DB, values: any[]) => db.owners.add(values[0].type, values[1]));

	// update owner(s)
	routes.dbPUT("/owners/:type",
		(req: Request) => multiValidator([valid(req.params, shDefaultTypeUpdate), valid(req.body, shOwnersUpdate)]),
		(db: DB, values: any[]) => db.owners.update(values[0].type, values[1]));

	// remove owner(s)
	routes.dbDELETE("/owners",
		(req: Request) => multiValidator([valid(req.body, shDefaultIDs)]),
		(db: DB, values: any) => db.owners.delete(values[0].ids));

	//////////////////////////////////////////////
	// Firmwares REST API
	//////////////////////////////////////////////

	// get all firmwares
	routes.dbGET("/firmwares", null,
		(db: DB) => db.firmwares.get());

	// get firmwares by IDs
	routes.dbPOST("/firmwares",
		(req: Request) => multiValidator([valid(req.body, shDefaultIDs)]),
		(db: DB, values: any[]) => db.firmwares.getByIDs(values[0].ids));

	// create new firmware
	routes.dbPOST("/firmwares/:type",
		(req: Request) => multiValidator([valid(req.params, shDefaultTypeCreate), valid(req.body, shFirmwaresCreate)]),
		(db: DB, values: any[]) => db.firmwares.add(values[0].type, values[1]));

	// update firmware(s)
	routes.dbPUT("/firmwares/:type",
		(req: Request) => multiValidator([valid(req.params, shDefaultTypeUpdate), valid(req.body, shFirmwaresUpdate)]),
		(db: DB, values: any[]) => db.firmwares.update(values[0].type, values[1]));

	// remove firmware(s)
	routes.dbDELETE("/firmwares",
		(req: Request) => multiValidator([valid(req.body, shDefaultIDs)]),
		(db: DB, values: any) => db.firmwares.delete(values[0].ids));

	//////////////////////////////////////////////
	// Devices REST API
	//////////////////////////////////////////////

	// get all devices
	routes.dbGET("/devices", null,
		(db: DB) => db.devices.get());

	// get devices by IDs
	routes.dbPOST("/devices",
		(req: Request) => multiValidator([valid(req.body, shDefaultIDs)]),
		(db: DB, values: any[]) => db.devices.getByIDs(values[0].ids));

	// get devices by owner
	routes.dbGET("/devices/:id",
		(req: Request) => multiValidator([valid(req.params, shID)]),
		(db: DB, values: any[]) => db.devices.getByOwner(values[0].id));

	// create new device
	routes.dbPOST("/devices/:type",
		(req: Request) => multiValidator([valid(req.params, shDefaultTypeCreate), valid(req.body, shDevicesCreate)]),
		(db: DB, values: any[]) => db.devices.add(values[0].type, values[1]));

	// update device(s)
	routes.dbPUT("/devices/:type",
		(req: Request) => multiValidator([valid(req.params, shDefaultTypeUpdate), valid(req.body, shDevicesUpdate)]),
		(db: DB, values: any[]) => db.devices.update(values[0].type, values[1]));

	// remove device(s)
	routes.dbDELETE("/devices",
		(req: Request) => multiValidator([valid(req.body, shDefaultIDs)]),
		(db: DB, values: any) => db.devices.delete(values[0].ids));

	//////////////////////////////////////////////
	// Data REST API
	//////////////////////////////////////////////

	// get data (first page)
	routes.dbPOST("/data", // first page
		(req: Request) => multiValidator([valid(req.body, shDataRetreive)]),
		(db: DB, values: any[]) => db.data.get(1, values[0]));

	// get data (with page)
	routes.dbPOST("/data/:page",
		(req: Request) => multiValidator([valid(req.params, shDataRetrievePage), valid(req.body, shDataRetreive)]),
		(db: DB, values: any[]) => db.data.get(values[0].page, values[1]));

	//////////////////////////////////////////////
	// Telemetry REST API
	//////////////////////////////////////////////

	// create new data
	routes.dbPOST("/telemetry/:type",
		(req: Request) => multiValidator([valid(req.params, shshTypeCreateData), valid({ "apikey": req.headers.apikey }, shDataCreateHeader), valid(req.body, shDataCreate)]),
		(db: DB, values: any[]) => db.data.add(values[0].type, values[1].apikey, values[2]));
}