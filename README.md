<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

<h1 align="center">NestJS ClickHouse</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/@flyhigh-hifi/nest-clickhouse"><img src="https://img.shields.io/npm/v/@flyhigh-hifi/nest-clickhouse.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/package/@flyhigh-hifi/nest-clickhouse"><img src="https://img.shields.io/npm/l/@flyhigh-hifi/nest-clickhouse.svg" alt="Package License" /></a>
  <a href="https://www.npmjs.com/package/@flyhigh-hifi/nest-clickhouse"><img src="https://img.shields.io/npm/dm/@flyhigh-hifi/nest-clickhouse.svg" alt="NPM Downloads" /></a>
</p>

## Description

Modern ClickHouse module for [NestJS](https://nestjs.com/) based on the official [@clickhouse/client](https://www.npmjs.com/package/@clickhouse/client) package.

## Features

- ✅ **Modern API** - Uses the official `@clickhouse/client` with async/await support
- ✅ **TypeScript** - Full TypeScript support with proper typings
- ✅ **NestJS 10** - Compatible with latest NestJS versions (9.x and 10.x)
- ✅ **Async Configuration** - Support for `useFactory`, `useClass`, and `useExisting`
- ✅ **Observable Support** - All methods available in both Promise and Observable variants
- ✅ **Automatic Cleanup** - Proper connection cleanup on module destroy

## Installation

```bash
npm install @flyhigh-hifi/nest-clickhouse @clickhouse/client
```

## Quick Start

### 1. Import the Module

**Synchronous configuration:**

```typescript
import { Module } from '@nestjs/common';
import { ClickhouseModule } from '@flyhigh-hifi/nest-clickhouse';

@Module({
  imports: [
    ClickhouseModule.register({
      host: 'http://localhost:8123',
      database: 'default',
      username: 'default',
      password: '',
    }),
  ],
})
export class AppModule {}
```

**Asynchronous configuration:**

```typescript
import { Module } from '@nestjs/common';
import { ClickhouseModule } from '@flyhigh-hifi/nest-clickhouse';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClickhouseModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        host: configService.get('CLICKHOUSE_HOST'),
        database: configService.get('CLICKHOUSE_DATABASE'),
        username: configService.get('CLICKHOUSE_USERNAME'),
        password: configService.get('CLICKHOUSE_PASSWORD'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

### 2. Use the Service

```typescript
import { Injectable } from '@nestjs/common';
import { ClickhouseService } from '@flyhigh-hifi/nest-clickhouse';

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly clickhouse: ClickhouseService) {}

  async getUsers(): Promise<User[]> {
    const result = await this.clickhouse.query<User>({
      query: 'SELECT * FROM users WHERE id > {id:UInt32}',
      query_params: { id: 100 },
      format: 'JSONEachRow',
    });

    return await result.json();
  }

  async createUser(user: Omit<User, 'id'>): Promise<void> {
    await this.clickhouse.insert({
      table: 'users',
      values: [user],
      format: 'JSONEachRow',
    });
  }

  async createTable(): Promise<void> {
    await this.clickhouse.command({
      query: `
        CREATE TABLE IF NOT EXISTS users (
          id UInt32,
          name String,
          email String,
          created_at DateTime
        ) ENGINE = MergeTree()
        ORDER BY id
      `,
    });
  }
}
```

## API Reference

### Query Methods

#### `query<T>(params): Promise<QueryResult<T>>`
Execute a SELECT query and return the result.

```typescript
const result = await clickhouse.query({
  query: 'SELECT * FROM users LIMIT 10',
  format: 'JSONEachRow',
});
const data = await result.json();
```

#### `query$<T>(params): Observable<QueryResult<T>>`
Observable variant of `query()`.

#### `queryStream<T>(params): Promise<T[]>`
Execute a query and return results as an array.

```typescript
const users = await clickhouse.queryStream<User>({
  query: 'SELECT * FROM users',
  format: 'JSONEachRow',
});
```

### Insert Methods

#### `insert<T>(params): Promise<InsertResult>`
Insert data into a table.

```typescript
await clickhouse.insert({
  table: 'users',
  values: [
    { id: 1, name: 'John', email: 'john@example.com' },
    { id: 2, name: 'Jane', email: 'jane@example.com' },
  ],
  format: 'JSONEachRow',
});
```

#### `insert$<T>(params): Observable<InsertResult>`
Observable variant of `insert()`.

### Command Methods

#### `command(params): Promise<CommandResult>`
Execute a command (CREATE, ALTER, DROP, etc.).

```typescript
await clickhouse.command({
  query: 'CREATE TABLE test (id UInt32) ENGINE = Memory',
});
```

#### `command$(params): Observable<CommandResult>`
Observable variant of `command()`.

### Execution Methods

#### `exec(params): Promise<ExecResult>`
Execute any statement (DDL, DML).

```typescript
await clickhouse.exec({
  query: 'INSERT INTO users VALUES (1, "John", "john@example.com", now())',
});
```

#### `exec$(params): Observable<ExecResult>`
Observable variant of `exec()`.

### Utility Methods

#### `ping(): Promise<boolean>`
Check connection to ClickHouse server.

```typescript
const isConnected = await clickhouse.ping();
```

#### `ping$(): Observable<boolean>`
Observable variant of `ping()`.

#### `getClient(): ClickHouseClient`
Get the underlying ClickHouse client instance for advanced usage.

```typescript
const client = clickhouse.getClient();
```

## Configuration Options

The module accepts all configuration options from [@clickhouse/client](https://clickhouse.com/docs/en/integrations/language-clients/javascript). Common options:

```typescript
{
  host?: string;                    // default: 'http://localhost:8123'
  database?: string;                // default: 'default'
  username?: string;                // default: 'default'
  password?: string;                // default: ''
  application?: string;             // application name
  clickhouse_settings?: {           // ClickHouse settings
    async_insert?: 0 | 1;
    wait_for_async_insert?: 0 | 1;
    // ... other settings
  };
  request_timeout?: number;         // request timeout in ms
  max_open_connections?: number;    // connection pool size
  compression?: {                   // compression settings
    request?: boolean;
    response?: boolean;
  };
}
```

## Testing

```bash
# Unit tests
npm run test

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## Support

This is an MIT-licensed open source project. Issues and pull requests are welcome!

## License

[MIT](LICENSE)
