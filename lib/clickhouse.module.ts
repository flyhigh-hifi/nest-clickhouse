import { DynamicModule, Module, Provider } from '@nestjs/common';
import { createClickhouseClient } from './clickhouse-client.provider';
import { CLICKHOUSE_MODULE_OPTIONS } from './clickhouse.constants';
import { ClickhouseService } from './clickhouse.service';
import { ClickhouseModuleOptions } from './interfaces';
import { create } from 'domain';

@Module({
  providers: [ClickhouseService],
  exports: [ClickhouseService]
})
export class ClickhouseModule {
  static register(options: ClickhouseModuleOptions): DynamicModule {
    return {
      module: ClickhouseModule,
      providers: [
        createClickhouseClient(),
        { provide: CLICKHOUSE_MODULE_OPTIONS, useValue: options }
      ]
    };
  }
}
