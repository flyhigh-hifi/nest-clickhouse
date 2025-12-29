import { DynamicModule, Module, Provider } from '@nestjs/common';
import { createClickhouseClient } from './clickhouse-client.provider';
import { CLICKHOUSE_MODULE_OPTIONS } from './clickhouse.constants';
import { ClickhouseService } from './clickhouse.service';
import {
  ClickhouseModuleOptions,
  ClickhouseModuleAsyncOptions,
  ClickhouseOptionsFactory,
} from './interfaces';

@Module({
  providers: [ClickhouseService],
  exports: [ClickhouseService],
})
export class ClickhouseModule {
  /**
   * Register ClickHouse module with static configuration
   */
  static register(options: ClickhouseModuleOptions): DynamicModule {
    return {
      module: ClickhouseModule,
      providers: [
        createClickhouseClient(),
        { provide: CLICKHOUSE_MODULE_OPTIONS, useValue: options },
      ],
      exports: [ClickhouseService],
    };
  }

  /**
   * Register ClickHouse module with async configuration
   */
  static registerAsync(options: ClickhouseModuleAsyncOptions): DynamicModule {
    return {
      module: ClickhouseModule,
      imports: options.imports || [],
      providers: [...this.createAsyncProviders(options), createClickhouseClient()],
      exports: [ClickhouseService],
    };
  }

  private static createAsyncProviders(options: ClickhouseModuleAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass!,
        useClass: options.useClass!,
      },
    ];
  }

  private static createAsyncOptionsProvider(options: ClickhouseModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: CLICKHOUSE_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: CLICKHOUSE_MODULE_OPTIONS,
      useFactory: async (optionsFactory: ClickhouseOptionsFactory) =>
        await optionsFactory.createClickhouseOptions(),
      inject: [options.useExisting || options.useClass!],
    };
  }
}
