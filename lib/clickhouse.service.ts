import { Inject, Injectable } from '@nestjs/common';
import { bindNodeCallback, Observable } from 'rxjs';
import { CLICKHOUSE_CLIENT } from './clickhouse-client.provider';
import { ClickHouse, QueryCursor } from 'clickhouse';

@Injectable()
export class ClickhouseService {
  constructor(
    @Inject(CLICKHOUSE_CLIENT) private readonly clickhouseClient: ClickHouse
  ) {}

  getClient(): ClickHouse {
    return this.clickhouseClient;
  }

  query<T = any>(query: String, reqParams?: object): Observable<QueryCursor> {
    return (bindNodeCallback(
      this.bindClientContext(this.clickhouseClient.query)
    )(query, reqParams) as any) as Observable<QueryCursor>;
  }

  insert<T = any>(query: String, data?: object): Observable<QueryCursor> {
    return (bindNodeCallback(
      this.bindClientContext(this.clickhouseClient.query)
    )(query, data) as any) as Observable<QueryCursor>;
  }

  bindClientContext<T extends Function>(fn: T): T {
    return fn.bind(this.clickhouseClient);
  }
}
