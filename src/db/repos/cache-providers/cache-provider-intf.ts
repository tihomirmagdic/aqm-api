export function hashCode(str: string): number {
  let hash = 0, i = 0;
  const len = str.length;
  while ( i < len ) {
      /* tslint:disable:no-bitwise */
      hash  = ((hash << 5) - hash + str.charCodeAt(i++)) << 0;
      /* tslint:enable:no-bitwise */
  }
  return hash;
}

export interface CacheProvider {
  id(params: any): string;

  exists(id: string): boolean;

  setData(id: string, data: any): void;

  getData(id: string, params: any): any | Promise<any>;

  fetchAndSetData(id: string, data: any, params: any): any;

  gc(): void;
};