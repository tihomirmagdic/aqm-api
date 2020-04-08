import { CacheRepository } from './cache';
import { DeviceTypesRepository } from './devicetypes';
import { ConfigurationsRepository } from './configurations';
import { ConfigurationItemsRepository } from './configurationitems';
import { RegionTypesRepository } from './regiontypes';
import { RegionsRepository } from './regions';
import { OwnersRepository } from './owners';
import { FirmwaresRepository } from './firmwares';
import { DevicesRepository } from './devices';
import { DataRepository } from './data';
import { UsersRepository } from './users';

// Database Interface Extensions:
interface IExtensions {
  cache: CacheRepository,
  devicetypes: DeviceTypesRepository,
  configurations: ConfigurationsRepository,
  configurationitems: ConfigurationItemsRepository,
  regiontypes: RegionTypesRepository,
  regions: RegionsRepository,
  owners: OwnersRepository,
  firmwares: FirmwaresRepository,
  devices: DevicesRepository,
  data: DataRepository,
  users: UsersRepository,
}

export {
	IExtensions,
	CacheRepository,
	DeviceTypesRepository,
	ConfigurationsRepository,
	ConfigurationItemsRepository,
	RegionTypesRepository,
	RegionsRepository,
	OwnersRepository,
	FirmwaresRepository,
	DevicesRepository,
	DataRepository,
	UsersRepository
};
