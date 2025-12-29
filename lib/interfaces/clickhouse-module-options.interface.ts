import { ModuleMetadata, Type } from '@nestjs/common';
import { ClickHouseClientConfigOptions } from '@clickhouse/client';

export type ClickhouseModuleOptions = ClickHouseClientConfigOptions;

export interface ClickhouseOptionsFactory {
  createClickhouseOptions(): Promise<ClickhouseModuleOptions> | ClickhouseModuleOptions;
}

export interface ClickhouseModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<ClickhouseOptionsFactory>;
  useClass?: Type<ClickhouseOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<ClickhouseModuleOptions> | ClickhouseModuleOptions;
  inject?: any[];
}
