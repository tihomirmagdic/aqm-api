import { Request, Response } from "express";
import { DB, dbPool } from "../db";
import { multiValidator, valid, Api } from "./handler";

import { shID, shDefaultIDs, shDefaultIDsAsText, shText, shDefaultTypeCreate, shDefaultTypeUpdate, shDefaultTypeUpdate2 } from "./default-schemas";

import { shDeviceTypesCreate, shDeviceTypesUpdate } from "../db/repos/devicetypes";
import { shTranslationsCreate, shTranslationsUpdate } from "../db/repos/translations";
import { shDictionaryIds, shDictionaryCreate, shDictionaryUpdate } from "../db/repos/dictionary";
import { shConfigurationsCreate, shConfigurationsUpdate } from "../db/repos/configurations";
import { shConfigurationItemsIds, shConfigurationItemsCreate, shConfigurationItemsUpdate } from "../db/repos/configurationitems";
import { shFiltersCreate, shFiltersUpdate } from "../db/repos/filters";
import { shFilterItemsIds, shFilterItemsCreate, shFilterItemsMultipleCreate, shFilterItemsUpdate, shFilterItemsMultipleUpdate } from "../db/repos/filteritems";
import { shRegionTypesCreate, shRegionTypesUpdate } from "../db/repos/regiontypes";
import { shRegionsCreate, shRegionsUpdate } from "../db/repos/regions";
import { shOwnersCreate, shOwnersUpdate } from "../db/repos/owners";
import { shFirmwaresCreate, shFirmwaresUpdate } from "../db/repos/firmwares";
import { shDevicesCreate, shDevicesUpdate } from "../db/repos/devices";
import { shDataRetrievePage, shshTypeCreateData, shDataCreateHeader, shDataCreate, shDataRetreive } from "../db/repos/data";

// import { passport } from "../db/repos/passport-setup";
const passport = require('passport');
import { setup } from "../db/repos/passport-setup";

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
	// Translations REST API
	//////////////////////////////////////////////

	// get all translations
	routes.dbGET("/translations", null,
		(db: DB) => db.translations.get());

	// get translations by IDs
	routes.dbPOST("/translations",
		(req: Request) => multiValidator([valid(req.body, shDefaultIDsAsText)]),
		(db: DB, values: any[]) => db.translations.getByIDs(values[0].ids));

	// create new translation
	routes.dbPOST("/translations/:type",
		(req: Request) => multiValidator([valid(req.params, shDefaultTypeCreate), valid(req.body, shTranslationsCreate)]),
		(db: DB, values: any[]) => db.translations.add(values[0].type, values[1]));

	// update translation(s)
	routes.dbPUT("/translations/:type",
		(req: Request) => multiValidator([valid(req.params, shDefaultTypeUpdate), valid(req.body, shTranslationsUpdate)]),
		(db: DB, values: any[]) => db.translations.update(values[0].type, values[1]));

	// remove translation(s)
	routes.dbDELETE("/translations",
		(req: Request) => multiValidator([valid(req.body, shDefaultIDsAsText)]),
		(db: DB, values: any) => db.translations.delete(values[0].ids));

	//////////////////////////////////////////////
	// Dictionary REST API
	//////////////////////////////////////////////

	// get dictionary by translation
	routes.dbGET("/dictionary/:id",
		(req: Request) => multiValidator([valid(req.params, shText)]),
		(db: DB, values: any[]) => db.dictionary.getByTranslation(values[0].id));

	// get some dictionaries
	routes.dbPOST("/dictionary",
		(req: Request) => multiValidator([valid(req.body, shDictionaryIds)]),
		(db: DB, values: any[]) => db.dictionary.getByIDs(values[0].ids));

	// create new translation
	routes.dbPOST("/dictionary/:type",
		(req: Request) => multiValidator([valid(req.params, shDefaultTypeCreate), valid(req.body, shDictionaryCreate)]),
		(db: DB, values: any[]) => db.dictionary.add(values[0].type, values[1]));

	// update translation(s)
	routes.dbPUT("/dictionary/:type",
		(req: Request) => multiValidator([valid(req.params, shDefaultTypeUpdate), valid(req.body, shDictionaryUpdate)]),
		(db: DB, values: any[]) => db.dictionary.update(values[0].type, values[1]));

	// remove translation(s)
	routes.dbDELETE("/dictionary",
		(req: Request) => multiValidator([valid(req.body, shDictionaryIds)]),
		(db: DB, values: any) => db.dictionary.delete(values[0].ids));

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
	// Configuration items REST API
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
	// Filters REST API
	//////////////////////////////////////////////

	// get all filters
	routes.dbGET("/filters", null,
		(db: DB) => db.filters.get());

	// get filters by IDs
	routes.dbPOST("/filters",
		(req: Request) => multiValidator([valid(req.body, shDefaultIDs)]),
		(db: DB, values: any[]) => db.filters.getByIDs(values[0].ids));

	// create new filter
	routes.dbPOST("/filters/:type",
		(req: Request) => multiValidator([valid(req.params, shDefaultTypeCreate), valid(req.body, shFiltersCreate)]),
		(db: DB, values: any[]) => db.filters.add(values[0].type, values[1]));

	// update filter(s)
	routes.dbPUT("/filters/:type",
		(req: Request) => multiValidator([valid(req.params, shDefaultTypeUpdate), valid(req.body, shFiltersUpdate)]),
		(db: DB, values: any[]) => db.filters.update(values[0].type, values[1]));

	// remove filter(s)
	routes.dbDELETE("/filters",
		(req: Request) => multiValidator([valid(req.body, shDefaultIDs)]),
		(db: DB, values: any) => db.filters.delete(values[0].ids));

	//////////////////////////////////////////////
	// Filter items REST API
	//////////////////////////////////////////////

	// get all filter items
	routes.dbGET("/filter-items", null,
		(db: DB) => db.filteritems.get());

	// get filter items by filter
	routes.dbGET("/filter-items/:id",
		(req: Request) => multiValidator([valid(req.params, shText)]),
		(db: DB, values: any[]) => db.filteritems. getByFilter(values[0].id));

	// get filter items by IDs
	routes.dbPOST("/filter-items",
		(req: Request) => multiValidator([valid(req.body, shFilterItemsIds)]),
		(db: DB, values: any[]) => db.filteritems.getByIDs(values[0].ids));

	// create new filter item
	routes.dbPOST("/filter-items/:type",
		(req: Request) => multiValidator([valid(req.params, shDefaultTypeCreate), valid(req.body, shFilterItemsCreate)]),
		(db: DB, values: any[]) => db.filteritems.add(values[0].type, values[1]));

	// create new filter item
	routes.dbPOST("/filter-items/multiple/:type",
		(req: Request) => multiValidator([valid(req.params, shDefaultTypeCreate), valid(req.body, shFilterItemsMultipleCreate)]),
		(db: DB, values: any[]) => db.filteritems.multipleCreate(values[0].type, values[1]));

	// update filter item(s)
	routes.dbPUT("/filter-items/:type",
		(req: Request) => multiValidator([valid(req.params, shDefaultTypeUpdate2), valid(req.body, shFilterItemsUpdate)]),
		(db: DB, values: any[]) => db.filteritems.update(values[0].type, values[1]));

	routes.dbPUT("/filter-items/multiple/:type",
		(req: Request) => multiValidator([valid(req.params, shDefaultTypeUpdate2), valid(req.body, shFilterItemsMultipleUpdate)]),
		(db: DB, values: any[]) => db.filteritems.multipleUpdate(values[0].type, values[1]));

	// remove filter item(s)
	routes.dbDELETE("/filter-items",
		(req: Request) => multiValidator([valid(req.body, shFilterItemsIds)]),
		(db: DB, values: any) => db.filteritems.delete(values[0].ids));

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
	// Auth REST API
	//////////////////////////////////////////////

	setup(app, passport);

	const ensureAuthenticated = (req: any, res: Response, next: any) => {
		if (req.isAuthenticated()) { return next(); }
		res.redirect('/login')
	}

	app.get("/api/v1/auth/test", (req: any, res: Response) => {
		if (req.user) {
			// res.send("user " + req.user.email + " logged in");
			res.status(200).json({ currentuser: { name: req.user.name, email: req.user.email, admin: req.user.admin }, success: true });
		} else {
			// res.send("user not logged in");
			res.status(401).end('Unauthorized'); // .send("user not logged in");
		}
	});

	app.get("/api/v1/auth/currentuser", (req: any, res: Response) => {
		if (req.user) {
			// res.send("user " + req.user.email + " logged in");
			res.status(200).json({ currentuser: { name: req.user.name, email: req.user.email, admin: req.user.admin }, success: true });
		} else {
			// res.send("user not logged in");
			res.status(401).end('Unauthorized'); // .send("user not logged in");
		}
	});

	// login - type is google, facebook
	// routes.dbPOST(["/auth/:type", "/login/:type"]
	app.get("/aapi/v1/auth/google", (req: Request, res: Response, next: any) => {
		// res.setHeader("Access-Control-Allow-Origin", "*");
		next();
	}, passport.authenticate('google', { scope: ['email', 'profile'] }));

	app.get("/api/v1/auth/google", passport.authenticate('google', { scope: ['email', 'profile'] }), (req: Request, res: Response) => {
		console.log("google auth");
		res.send("google auth");
	});

	app.get("/api/v1/auth/facebook", passport.authenticate('facebook', { scope: ['email'] }), (req: Request, res: Response) => {
		console.log("facebook auth");
		res.send("facebook auth");
	});

	const signToken = (user: any) => {
		return user;
	};

	app.post("/api/v1/auth/local", passport.authenticate('local'), (req: any, res: Response) => {
		console.log("local auth with user:", req.user);
		/*
		const token = signToken(req.user);
    res.cookie('access_token', token, {
      httpOnly: true
		});
		*/
		res.status(200).json({ user: { name: req.user.name, email: req.user.email, admin: req.user.admin }, success: true });
	});

	app.get("/api/v1/auth/google/redirect", passport.authenticate('google'), (req: any, res: Response) => {
		// res.send("google auth redirected");
		res.redirect("http://localhost:4200/auth");
		// res.status(200).json(req.user);
	});

	app.get("/api/v1/auth/facebook/redirect", passport.authenticate('facebook'), (req: any, res: Response) => {
		// res.send("facebook auth redirected");
		res.redirect("http://localhost:4200/auth");
		// res.status(200).json(req.user);
	});

	app.delete("/api/v1/auth", (req: any, res: Response) => {
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
	routes.dbDELETE("/auth",
		null,
		(db: DB, values: any) => db.auth.delete());

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