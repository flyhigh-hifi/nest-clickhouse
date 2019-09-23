import { ClickHouse } from 'clickhouse';
import { CLICKHOUSE_MODULE_OPTIONS } from './clickhouse.constants';
import { ClickhouseModuleOptions } from './interfaces';

export const CLICKHOUSE_CLIENT = 'CLICKHOUSE_CLIENT';

export const createClickhouseClient = () => ({
  provide: CLICKHOUSE_CLIENT,
  useFactory: (options: ClickhouseModuleOptions) => {
    return new ClickHouse(options);
  },
  inject: [CLICKHOUSE_MODULE_OPTIONS]
});
