import { Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ClickhouseModule } from './clickhouse.module';
import { ClickhouseService } from './clickhouse.service';
import { CLICKHOUSE_MODULE_OPTIONS } from './clickhouse.constants';
import { ClickhouseOptionsFactory } from './interfaces';

describe('ClickhouseModule', () => {
  describe('register', () => {
    it('should provide ClickhouseService', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          ClickhouseModule.register({
            url: 'http://localhost:8123',
            database: 'default',
          }),
        ],
      }).compile();

      const service = module.get<ClickhouseService>(ClickhouseService);
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(ClickhouseService);

      await module.close();
    });

    it('should register with correct options', async () => {
      const options = {
        url: 'http://localhost:8123',
        database: 'test',
        username: 'admin',
        password: 'secret',
      };

      const module: TestingModule = await Test.createTestingModule({
        imports: [ClickhouseModule.register(options)],
      }).compile();

      const registeredOptions = module.get(CLICKHOUSE_MODULE_OPTIONS);
      expect(registeredOptions).toEqual(options);

      await module.close();
    });
  });

  describe('registerAsync', () => {
    it('should provide ClickhouseService with useFactory', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          ClickhouseModule.registerAsync({
            useFactory: () => ({
              url: 'http://localhost:8123',
              database: 'default',
            }),
          }),
        ],
      }).compile();

      const service = module.get<ClickhouseService>(ClickhouseService);
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(ClickhouseService);

      await module.close();
    });

    it('should provide ClickhouseService with useClass', async () => {
      class TestConfigService implements ClickhouseOptionsFactory {
        createClickhouseOptions() {
          return {
            url: 'http://localhost:8123',
            database: 'default',
          };
        }
      }

      const module: TestingModule = await Test.createTestingModule({
        imports: [
          ClickhouseModule.registerAsync({
            useClass: TestConfigService,
          }),
        ],
      }).compile();

      const service = module.get<ClickhouseService>(ClickhouseService);
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(ClickhouseService);

      await module.close();
    });

    it('should provide ClickhouseService with useExisting', async () => {
      class TestConfigService implements ClickhouseOptionsFactory {
        createClickhouseOptions() {
          return {
            url: 'http://localhost:8123',
            database: 'default',
          };
        }
      }

      @Module({
        providers: [TestConfigService],
        exports: [TestConfigService],
      })
      class ConfigModule {}

      const module: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule,
          ClickhouseModule.registerAsync({
            imports: [ConfigModule],
            useExisting: TestConfigService,
          }),
        ],
      }).compile();

      const service = module.get<ClickhouseService>(ClickhouseService);
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(ClickhouseService);

      await module.close();
    });

    it('should inject dependencies in useFactory', async () => {
      class ConfigService {
        get(key: string) {
          const config: Record<string, any> = {
            CLICKHOUSE_URL: 'http://localhost:8123',
            CLICKHOUSE_DATABASE: 'test',
          };
          return config[key];
        }
      }

      @Module({
        providers: [ConfigService],
        exports: [ConfigService],
      })
      class ConfigModule {}

      const module: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule,
          ClickhouseModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
              url: configService.get('CLICKHOUSE_URL'),
              database: configService.get('CLICKHOUSE_DATABASE'),
            }),
            inject: [ConfigService],
          }),
        ],
      }).compile();

      const service = module.get<ClickhouseService>(ClickhouseService);
      expect(service).toBeDefined();

      const options = module.get(CLICKHOUSE_MODULE_OPTIONS);
      expect(options).toEqual({
        url: 'http://localhost:8123',
        database: 'test',
      });

      await module.close();
    });
  });
});
