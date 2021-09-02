import { CacheRepository } from './cache';
import { DeviceTypesRepository } from './devicetypes';
import { TranslationsRepository } from './translations';
import { DictionaryRepository } from './dictionary';
import { ConfigurationsRepository } from './configurations';
import { ConfigurationItemsRepository } from './configurationitems';
import { FiltersRepository } from './filters';
import { FilterItemsRepository } from './filteritems';
import { RegionTypesRepository } from './regiontypes';
import { RegionsRepository } from './regions';
import { OwnersRepository } from './owners';
import { AuthRepository } from './auth';
import { FirmwaresRepository } from './firmwares';
import { DevicesRepository } from './devices';
import { DataRepository } from './data';
import { UsersRepository } from './users';

// Database Interface Extensions:
interface IExtensions {
  cache: CacheRepository,
  devicetypes: DeviceTypesRepository,
  translations: TranslationsRepository,
  dictionary: DictionaryRepository,
  configurations: ConfigurationsRepository,
  configurationitems: ConfigurationItemsRepository,
  filters: FiltersRepository,
  filteritems: FilterItemsRepository,
  regiontypes: RegionTypesRepository,
  regions: RegionsRepository,
  owners: OwnersRepository,
  auth: AuthRepository,
  firmwares: FirmwaresRepository,
  devices: DevicesRepository,
  data: DataRepository,
  users: UsersRepository,
}

export {
	IExtensions,
	CacheRepository,
	DeviceTypesRepository,
	TranslationsRepository,
	DictionaryRepository,
	ConfigurationsRepository,
	ConfigurationItemsRepository,
	FiltersRepository,
	FilterItemsRepository,
	RegionTypesRepository,
	RegionsRepository,
	OwnersRepository,
	AuthRepository,
	FirmwaresRepository,
	DevicesRepository,
	DataRepository,
	UsersRepository
};
