import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Observable, defer, from } from 'rxjs';
import { CLICKHOUSE_CLIENT } from './clickhouse-client.provider';
import { ClickHouseClient, InsertResult, CommandResult } from '@clickhouse/client';

@Injectable()
export class ClickhouseService implements OnModuleDestroy {
  constructor(@Inject(CLICKHOUSE_CLIENT) private readonly client: ClickHouseClient) {}

  /**
   * Get the underlying ClickHouse client instance
   */
  getClient(): ClickHouseClient {
    return this.client;
  }

  /**
   * Execute a SELECT query and return the result
   * @param params Query parameters including query string, parameters, and format
   */
  async query(params: {
    query: string;
    query_params?: Record<string, unknown>;
    format?: 'JSONEachRow' | 'JSON' | 'CSV' | 'TabSeparated';
  }) {
    return await this.client.query(params);
  }

  /**
   * Execute a SELECT query and return the result as an Observable
   */
  query$(params: {
    query: string;
    query_params?: Record<string, unknown>;
    format?: 'JSONEachRow' | 'JSON' | 'CSV' | 'TabSeparated';
  }) {
    return defer(() => from(this.query(params)));
  }

  /**
   * Execute a SELECT query and return results as JSON array
   */
  async queryJson<T = any>(params: {
    query: string;
    query_params?: Record<string, unknown>;
  }): Promise<T[]> {
    const resultSet = await this.client.query({
      ...params,
      format: 'JSONEachRow',
    });
    return await resultSet.json();
  }

  /**
   * Execute a SELECT query and return results as JSON array (Observable)
   */
  queryJson$<T = any>(params: {
    query: string;
    query_params?: Record<string, unknown>;
  }): Observable<T[]> {
    return defer(() => from(this.queryJson<T>(params)));
  }

  /**
   * Insert data into a table
   * @param params Insert parameters
   */
  async insert<T = any>(params: {
    table: string;
    values: T[] | ReadonlyArray<T>;
    format?: 'JSONEachRow' | 'CSV' | 'TabSeparated';
  }): Promise<InsertResult> {
    return await this.client.insert(params);
  }

  /**
   * Insert data into a table and return as Observable
   */
  insert$<T = any>(params: {
    table: string;
    values: T[] | ReadonlyArray<T>;
    format?: 'JSONEachRow' | 'CSV' | 'TabSeparated';
  }): Observable<InsertResult> {
    return defer(() => from(this.insert(params)));
  }

  /**
   * Execute a command (CREATE, ALTER, DROP, etc.)
   */
  async command(params: {
    query: string;
    query_params?: Record<string, unknown>;
  }): Promise<CommandResult> {
    return await this.client.command(params);
  }

  /**
   * Execute a command and return as Observable
   */
  command$(params: {
    query: string;
    query_params?: Record<string, unknown>;
  }): Observable<CommandResult> {
    return defer(() => from(this.command(params)));
  }

  /**
   * Execute any statement (DDL, DML)
   */
  async exec(params: { query: string; query_params?: Record<string, unknown> }) {
    return await this.client.exec(params);
  }

  /**
   * Execute any statement as Observable
   */
  exec$(params: { query: string; query_params?: Record<string, unknown> }) {
    return defer(() => from(this.exec(params)));
  }

  /**
   * Ping the ClickHouse server
   */
  async ping(): Promise<boolean> {
    const result = await this.client.ping();
    return result.success;
  }

  /**
   * Ping the ClickHouse server as Observable
   */
  ping$(): Observable<boolean> {
    return defer(() => from(this.ping()));
  }

  /**
   * Close the connection when the module is destroyed
   */
  async onModuleDestroy(): Promise<void> {
    await this.client.close();
  }
}
