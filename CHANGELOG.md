# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-29

### 🎉 Major Modernization Release

This release brings the package up to 2025 standards with complete modernization of dependencies, APIs, and tooling.

### ✨ Added

- **Modern ClickHouse Client**: Migrated from legacy `clickhouse` package to official `@clickhouse/client`
- **Async/Await Support**: All methods now use modern async/await patterns instead of callbacks
- **Observable Support**: Added Observable variants (`query$`, `insert$`, `command$`, `exec$`, `ping$`) for RxJS integration
- **Rich API**: New methods including:
  - `query()` - Execute SELECT queries with full type support
  - `queryStream()` - Stream query results
  - `insert()` - Insert data with proper typing
  - `command()` - Execute DDL commands (CREATE, ALTER, DROP)
  - `exec()` - Execute any SQL statement
  - `ping()` - Check server connectivity
- **Async Module Registration**: Re-added `registerAsync()` with support for `useFactory`, `useClass`, and `useExisting`
- **Proper TypeScript Types**: Full type definitions using official `@clickhouse/client` types
- **Lifecycle Hooks**: Automatic connection cleanup with `OnModuleDestroy`
- **Testing Infrastructure**: Added Jest configuration and test scripts
- **GitHub Actions CI/CD**: Modern CI pipeline with linting, building, and testing
- **Comprehensive Documentation**: Complete rewrite of README with modern examples

### 🔄 Changed

- **BREAKING**: Package renamed from `@flyhigh-hifi/clickhouse` to `@flyhigh-hifi/nest-clickhouse`
- **BREAKING**: Minimum Node.js version is now 18.x
- **BREAKING**: NestJS peer dependency updated to 9.x/10.x (from 6.x)
- **BREAKING**: RxJS peer dependency updated to 7.x (from 6.x)
- **BREAKING**: Complete API rewrite - old callback-based methods replaced with async/await
- **BREAKING**: Query method signature changed to accept object parameters instead of positional arguments
- Updated TypeScript to 5.7.x (from 3.6.x)
- Updated all dependencies to latest 2025 versions
- Replaced TSLint with ESLint 9.x
- Updated Prettier to 3.x
- Modernized TypeScript configuration with strict mode enabled
- Updated build output to ES2022 target

### 🐛 Fixed

- Removed unused `domain` import that was causing warnings
- Fixed package name inconsistency in README
- Removed duplicate interface definitions
- Fixed proper exports in package.json
- Added proper cleanup of connections on module destroy

### 🗑️ Removed

- **BREAKING**: Removed old callback-based API
- **BREAKING**: Removed `bindNodeCallback` wrapper pattern
- Removed dependency on legacy `clickhouse` package
- Removed `rxjs-compat` dependency
- Removed TSLint configuration
- Removed old index files from package root

### 📦 Dependencies

#### Updated
- `@nestjs/common`: 6.6.7 → 10.4.15
- `typescript`: 3.6.3 → 5.7.2
- `rxjs`: 6.5.3 → 7.8.1
- `prettier`: 1.18.2 → 3.4.2
- `husky`: 3.0.5 → 9.1.7
- `lint-staged`: 9.2.5 → 15.2.11

#### Added
- `@clickhouse/client`: ^1.0.0
- `@nestjs/core`: ^10.4.15
- `@nestjs/testing`: ^10.4.15
- `eslint`: ^9.17.0
- `@typescript-eslint/eslint-plugin`: ^8.18.2
- `@typescript-eslint/parser`: ^8.18.2
- `jest`: ^29.7.0
- `ts-jest`: ^29.2.5

#### Removed
- `clickhouse` (replaced by `@clickhouse/client`)
- `rxjs-compat`
- `@types/elasticsearch`
- `elasticsearch`

### 📝 Migration Guide from 0.0.6 to 1.0.0

#### Installation
```bash
# Old
npm install @flyhigh-hifi/clickhouse clickhouse

# New
npm install @flyhigh-hifi/nest-clickhouse @clickhouse/client
```

#### Module Registration
```typescript
// Old
ClickhouseModule.register({
  url: 'http://localhost',
  port: 8123,
  debug: false
})

// New
ClickhouseModule.register({
  host: 'http://localhost:8123',
  database: 'default',
  username: 'default',
  password: ''
})
```

#### Querying Data
```typescript
// Old
this.clickhouse.query('SELECT * FROM users', {})
  .subscribe(data => console.log(data));

// New (Promise)
const result = await this.clickhouse.query({
  query: 'SELECT * FROM users',
  format: 'JSONEachRow'
});
const data = await result.json();

// New (Observable)
this.clickhouse.query$({
  query: 'SELECT * FROM users',
  format: 'JSONEachRow'
}).subscribe(result => console.log(result));
```

#### Inserting Data
```typescript
// Old
this.clickhouse.insert('INSERT INTO users FORMAT JSONEachRow', data)
  .subscribe();

// New (Promise)
await this.clickhouse.insert({
  table: 'users',
  values: data,
  format: 'JSONEachRow'
});

// New (Observable)
this.clickhouse.insert$({
  table: 'users',
  values: data,
  format: 'JSONEachRow'
}).subscribe();
```

---

## [0.0.6] - 2019-10-18

### Changed
- Rewrote query() method to properly handle streaming with Observable
- Changed return type from `Observable<QueryCursor>` to `Observable<string | Buffer>`
- Rewrote insert() method to use `of()` operator and return `Observable<WriteStream>`

## [0.0.2] - 2019-09-23

### Added
- Added index files for proper npm package exports

### Changed
- Package name changed to `@flyhigh-hifi/clickhouse`
- Moved clickhouse from dependencies to peerDependencies

## [0.0.1] - 2019-09-21

### Added
- Initial release
- Basic ClickHouse module for NestJS
- Support for query and insert operations
- Observable-based API

[1.0.0]: https://github.com/flyhigh-hifi/nest-clickhouse/compare/v0.0.6...v1.0.0
[0.0.6]: https://github.com/flyhigh-hifi/nest-clickhouse/compare/v0.0.2...v0.0.6
[0.0.2]: https://github.com/flyhigh-hifi/nest-clickhouse/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/flyhigh-hifi/nest-clickhouse/releases/tag/v0.0.1
