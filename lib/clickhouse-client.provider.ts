import { createClient, ClickHouseClient } from '@clickhouse/client';
import { CLICKHOUSE_MODULE_OPTIONS } from './clickhouse.constants';
import { ClickhouseModuleOptions } from './interfaces';

export const CLICKHOUSE_CLIENT = 'CLICKHOUSE_CLIENT';

export const createClickhouseClient = () => ({
  provide: CLICKHOUSE_CLIENT,
  useFactory: (options: ClickhouseModuleOptions): ClickHouseClient => {
    return createClient(options);
  },
  inject: [CLICKHOUSE_MODULE_OPTIONS],
});
