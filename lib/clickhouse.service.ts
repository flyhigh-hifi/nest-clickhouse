import { Inject, Injectable } from '@nestjs/common';
import { bindNodeCallback, Observable, of } from 'rxjs';
import { CLICKHOUSE_CLIENT } from './clickhouse-client.provider';
import { ClickHouse, QueryCursor, WriteStream } from 'clickhouse';
import { Stream } from 'stream';

@Injectable()
export class ClickhouseService {
  constructor(
    @Inject(CLICKHOUSE_CLIENT) private readonly clickhouseClient: ClickHouse
  ) {}

  getClient(): ClickHouse {
    return this.clickhouseClient;
  }

  query<T = any>(
    query: String,
    reqParams?: object
  ): Observable<string | Buffer> {
    return new Observable<string | Buffer>(subscriber => {
      this.clickhouseClient
        .query(query, reqParams)
        .stream()
        .on('data', row => subscriber.next(row))
        .on('error', err => subscriber.error(err))
        .on('end', () => subscriber.complete());
    });
  }

  insert<T = any>(query: String, data?: object): Observable<WriteStream> {
    return of(this.clickhouseClient
      .insert(query, data)
      .stream() as WriteStream);
  }
}
