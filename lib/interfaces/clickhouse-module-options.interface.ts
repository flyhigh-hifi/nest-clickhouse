import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import { ConfigOptions } from 'elasticsearch';

export interface ElasticsearchModuleOptions extends ConfigOptions {}

export interface ElasticsearchOptionsFactory {
  createElasticsearchOptions():
    | Promise<ElasticsearchModuleOptions>
    | ElasticsearchModuleOptions;
}

export interface ElasticsearchModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<ElasticsearchOptionsFactory>;
  useClass?: Type<ElasticsearchOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<ElasticsearchModuleOptions> | ElasticsearchModuleOptions;
  inject?: any[];
}

// export interface ClickhouseModuleOptions extends ConfigOptions {}

// export interface ClickhouseOptionsFactory {
//   createClickhouseOptions():
//     | Promise<ClickhouseModuleOptions>
//     | ClickhouseModuleOptions
// }

// export interface ClickhouseModuleAsyncOptions extends Pi ck