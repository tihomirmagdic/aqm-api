import { QueryFile, IQueryFileOptions } from 'pg-promise';

import * as path from 'path';

/**
 * First, copy all .sql files with npm run copy:assets
 * 
 * In development watch an dcopz any changes in .sql files with npm run watch:assets
 * 
 */

export const devicetypes = {
	getAll: sql('device-types/get-all.sql'),
	getByIDs: sql('device-types/get-by-ids.sql'),
	add: sql('device-types/add.sql'),
	update: sql('device-types/update.sql'),
	remove: sql('device-types/remove.sql'),
};

export const configurations = {
	getAll: sql('configurations/get-all.sql'),
	getByIDs: sql('configurations/get-by-ids.sql'),
	add: sql('configurations/add.sql'),
	update: sql('configurations/update.sql'),
	remove: sql('configurations/remove.sql'),
};

export const configurationitems = {
	getAll: sql('configuration-items/get-all.sql'),
	getByConfiguration: sql('configuration-items/get-by-configuration.sql'),
	getByIDs: sql('configuration-items/get-by-ids.sql'),
	add: sql('configuration-items/add.sql'),
	update: sql('configuration-items/update.sql'),
	remove: sql('configuration-items/remove.sql'),
};

export const regiontypes = {
	getAll: sql('region-types/get-all.sql'),
	getByIDs: sql('region-types/get-by-ids.sql'),
	add: sql('region-types/add.sql'),
	update: sql('region-types/update.sql'),
	remove: sql('region-types/remove.sql'),
};

export const regions = {
	getAll: sql('regions/get-all.sql'),
	getByIDs: sql('regions/get-by-ids.sql'),
	add: sql('regions/add.sql'),
	update: sql('regions/update.sql'),
	remove: sql('regions/remove.sql'),
};

export const owners = {
	getAll: sql('owners/get-all.sql'),
	getByIDs: sql('owners/get-by-ids.sql'),
	add: sql('owners/add.sql'),
	update: sql('owners/update.sql'),
	remove: sql('owners/remove.sql'),
};

export const auth = {
	checkEmailPassword: sql('auth/check-email-password.sql'),
	checkEmail: sql('auth/check-email.sql'),
};

export const firmwares = {
	getAll: sql('firmwares/get-all.sql'),
	getByIDs: sql('firmwares/get-by-ids.sql'),
	add: sql('firmwares/add.sql'),
	update: sql('firmwares/update.sql'),
	remove: sql('firmwares/remove.sql'),
};

export const devices = {
	getAll: sql('devices/get-all.sql'),
	getByIDs: sql('devices/get-by-ids.sql'),
	getByOwner: sql('devices/get-by-owner.sql'),
	add: sql('devices/add.sql'),
	update: sql('devices/update.sql'),
	remove: sql('devices/remove.sql'),
};

export const data = {
	get: sql('data/get.sql'),
	add: sql('data/add.sql'),
};

export const cache = {
	getApiKeys: sql('cache/get-api-keys.sql'),
};

export const users = {
	create: sql('users/create.sql'),
	empty: sql('users/empty.sql'),
	init: sql('users/init.sql'),
	drop: sql('users/drop.sql'),
	add: sql('users/add.sql')
};

///////////////////////////////////////////////
// Helper for linking to external query files;
function sql(file: string): QueryFile {

  const fullPath: string = path.join(__dirname, file); // generating full path;

  const options: IQueryFileOptions = {

    // minifying the SQL is always advised;
    // see also option 'compress' in the API;
    minify: true

    // See also property 'params' for two-step template formatting
  };

  const qf: QueryFile = new QueryFile(fullPath, options);

  if (qf.error) {
    // Something is wrong with our query file :(
    // Testing all files through queries can be cumbersome,
    // so we also report it here, while loading the module:
    console.error(qf.error);
  }

  return qf;

  // See QueryFile API:
  // http://vitaly-t.github.io/pg-promise/QueryFile.html
}

///////////////////////////////////////////////////////////////////
// Possible alternative - enumerating all SQL files automatically:
// http://vitaly-t.github.io/pg-promise/utils.html#.enumSql
