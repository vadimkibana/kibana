/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { ElasticsearchClient } from '@kbn/core/server';
import {
  createTestServers,
  type TestElasticsearchUtils,
  type TestKibanaUtils,
} from '@kbn/core-test-helpers-kbn-server';
import { EsEventStreamClient } from '../../es/es_event_stream_client';
import { EventStreamLoggerMock } from '../event_stream_logger_mock';
import { until, tick } from '../util';
import { EventStreamEvent } from '../../types';

describe('EsEventStreamClient', () => {
  let manageES: TestElasticsearchUtils;
  let manageKbn: TestKibanaUtils;
  let esClient: ElasticsearchClient;
  let client: EsEventStreamClient;

  const baseName = '.kibana-test';
  const indexTemplateName = `${baseName}-event-stream-template`;

  let now = Date.now();
  const getTime = () => now++;

  beforeAll(async () => {
    const { startES, startKibana } = createTestServers({ adjustTimeout: jest.setTimeout });

    manageES = await startES();
    manageKbn = await startKibana();
    esClient = manageKbn.coreStart.elasticsearch.client.asInternalUser;
    client = new EsEventStreamClient({
      baseName,
      esClient: Promise.resolve(esClient),
      kibanaVersion: '1.2.3',
      logger: new EventStreamLoggerMock(),
    });
  });

  afterAll(async () => {
    await manageKbn.root.shutdown();
    await manageKbn.stop();
    await manageES.stop();
  });

  it('can initialize the Event Stream', async () => {
    const exists1 = await esClient.indices.existsIndexTemplate({
      name: indexTemplateName,
    });

    expect(exists1).toBe(false);

    await client.initialize();

    const exists2 = await esClient.indices.existsIndexTemplate({
      name: indexTemplateName,
    });

    expect(exists2).toBe(true);
  });

  it('can write a single event', async () => {
    await tick(1);

    const time = getTime();

    await client.writeEvents([
      {
        predicate: ['test', { foo: 'bar' }],
        time,
      },
    ]);

    await until(async () => {
      const events = await client.tail();
      return events.length === 1;
    }, 100)

    const tail = await client.tail();

    expect(tail).toMatchObject([
      {
        predicate: ['test', { foo: 'bar' }],
        time,
      },
    ]);
  });

  it('can write multiple events', async () => {
    await tick(1);

    const events: EventStreamEvent[] = [
      {
        time: getTime(),
        subject: ['user', '1'],
        predicate: ['test', { foo: 'bar' }],
        object: ['dashboard', '1'],
      },
      {
        time: getTime(),
        subject: ['user', '2'],
        predicate: ['view'],
        object: ['map', 'xyz'],
      },
      {
        time: getTime(),
        subject: ['user', '2'],
        predicate: ['view'],
        object: ['canvas', 'xxxx-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'],
      },
    ];

    await client.writeEvents(events);

    await until(async () => {
      const events = await client.tail();
      return events.length === 4;
    }, 100)

    const tail = await client.tail();

    expect(tail.slice(0, 3)).toMatchObject([
      events[2],
      events[1],
      events[0],
    ]);
  });
});
