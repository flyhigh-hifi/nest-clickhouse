import { Test, TestingModule } from '@nestjs/testing';
import { ClickhouseService } from './clickhouse.service';
import { CLICKHOUSE_CLIENT } from './clickhouse-client.provider';
import { ClickHouseClient } from '@clickhouse/client';

describe('ClickhouseService', () => {
  let service: ClickhouseService;
  let mockClient: jest.Mocked<ClickHouseClient>;

  beforeEach(async () => {
    mockClient = {
      query: jest.fn(),
      insert: jest.fn(),
      command: jest.fn(),
      exec: jest.fn(),
      ping: jest.fn(),
      close: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClickhouseService,
        {
          provide: CLICKHOUSE_CLIENT,
          useValue: mockClient,
        },
      ],
    }).compile();

    service = module.get<ClickhouseService>(ClickhouseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getClient', () => {
    it('should return the underlying client', () => {
      expect(service.getClient()).toBe(mockClient);
    });
  });

  describe('query', () => {
    it('should execute a query', async () => {
      const mockResult = { json: jest.fn().mockResolvedValue([{ id: 1 }]) };
      mockClient.query.mockResolvedValue(mockResult as any);

      const result = await service.query({
        query: 'SELECT * FROM users',
        format: 'JSONEachRow',
      });

      expect(mockClient.query).toHaveBeenCalledWith({
        query: 'SELECT * FROM users',
        format: 'JSONEachRow',
      });
      expect(result).toBe(mockResult);
    });

    it('should handle query parameters', async () => {
      const mockResult = { json: jest.fn() };
      mockClient.query.mockResolvedValue(mockResult as any);

      await service.query({
        query: 'SELECT * FROM users WHERE id = {id:UInt32}',
        query_params: { id: 1 },
        format: 'JSONEachRow',
      });

      expect(mockClient.query).toHaveBeenCalledWith({
        query: 'SELECT * FROM users WHERE id = {id:UInt32}',
        query_params: { id: 1 },
        format: 'JSONEachRow',
      });
    });
  });

  describe('queryJson', () => {
    it('should execute a query and return JSON results', async () => {
      const mockData = [{ id: 1, name: 'Test' }];
      const mockResult = { json: jest.fn().mockResolvedValue(mockData) };
      mockClient.query.mockResolvedValue(mockResult as any);

      const result = await service.queryJson({
        query: 'SELECT * FROM users',
      });

      expect(result).toEqual(mockData);
      expect(mockResult.json).toHaveBeenCalled();
    });
  });

  describe('insert', () => {
    it('should insert data', async () => {
      const mockResult = { query_id: '123' };
      mockClient.insert.mockResolvedValue(mockResult as any);

      const values = [{ id: 1, name: 'Test' }];
      const result = await service.insert({
        table: 'users',
        values,
        format: 'JSONEachRow',
      });

      expect(mockClient.insert).toHaveBeenCalledWith({
        table: 'users',
        values,
        format: 'JSONEachRow',
      });
      expect(result).toBe(mockResult);
    });
  });

  describe('command', () => {
    it('should execute a command', async () => {
      const mockResult = { query_id: '123' };
      mockClient.command.mockResolvedValue(mockResult as any);

      const result = await service.command({
        query: 'CREATE TABLE test (id UInt32) ENGINE = Memory',
      });

      expect(mockClient.command).toHaveBeenCalledWith({
        query: 'CREATE TABLE test (id UInt32) ENGINE = Memory',
      });
      expect(result).toBe(mockResult);
    });
  });

  describe('exec', () => {
    it('should execute a statement', async () => {
      const mockResult = { query_id: '123' };
      mockClient.exec.mockResolvedValue(mockResult as any);

      const result = await service.exec({
        query: 'INSERT INTO users VALUES (1, "test")',
      });

      expect(mockClient.exec).toHaveBeenCalledWith({
        query: 'INSERT INTO users VALUES (1, "test")',
      });
      expect(result).toBe(mockResult);
    });
  });

  describe('ping', () => {
    it('should ping the server', async () => {
      mockClient.ping.mockResolvedValue({ success: true } as any);

      const result = await service.ping();

      expect(mockClient.ping).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false when ping fails', async () => {
      mockClient.ping.mockResolvedValue({ success: false } as any);

      const result = await service.ping();

      expect(result).toBe(false);
    });
  });

  describe('Observable methods', () => {
    it('query$ should return an Observable', (done) => {
      const mockResult = { json: jest.fn() };
      mockClient.query.mockResolvedValue(mockResult as any);

      service
        .query$({
          query: 'SELECT * FROM users',
          format: 'JSONEachRow',
        })
        .subscribe({
          next: (result) => {
            expect(result).toBe(mockResult);
            done();
          },
          error: done,
        });
    });

    it('insert$ should return an Observable', (done) => {
      const mockResult = { query_id: '123' };
      mockClient.insert.mockResolvedValue(mockResult as any);

      service
        .insert$({
          table: 'users',
          values: [{ id: 1 }],
          format: 'JSONEachRow',
        })
        .subscribe({
          next: (result) => {
            expect(result).toBe(mockResult);
            done();
          },
          error: done,
        });
    });

    it('ping$ should return an Observable', (done) => {
      mockClient.ping.mockResolvedValue({ success: true } as any);

      service.ping$().subscribe({
        next: (result) => {
          expect(result).toBe(true);
          done();
        },
        error: done,
      });
    });
  });

  describe('onModuleDestroy', () => {
    it('should close the client connection', async () => {
      mockClient.close.mockResolvedValue(undefined);

      await service.onModuleDestroy();

      expect(mockClient.close).toHaveBeenCalled();
    });
  });
});
