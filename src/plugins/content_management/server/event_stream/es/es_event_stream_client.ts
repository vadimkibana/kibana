/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import type { estypes } from '@elastic/elasticsearch';
import type { EsClient } from './types';
import type { EventStreamClient, EventStreamEvent, EventStreamLogger } from '../types';
import { EsEventStreamNames } from './es_event_stream_names';
import { EsEventStreamInitializer } from './init/es_event_stream_initializer';

export interface EsEventStreamClientDependencies {
  baseName: string;
  kibanaVersion: string;
  logger: EventStreamLogger;
  esClient: Promise<EsClient>;
}

export class EsEventStreamClient implements EventStreamClient {
  readonly #names: EsEventStreamNames;

  constructor(private readonly deps: EsEventStreamClientDependencies) {
    this.#names = new EsEventStreamNames(deps.baseName);
  }

  public async initialize(): Promise<void> {
    const initializer = new EsEventStreamInitializer({
      names: this.#names,
      kibanaVersion: this.deps.kibanaVersion,
      logger: this.deps.logger,
      esClient: this.deps.esClient,
    });
    await initializer.initialize();
  }

  public async writeEvents(events: EventStreamEvent[]): Promise<void> {
    const esClient = await this.deps.esClient;
    const operations: Array<estypes.BulkOperationContainer | EventStreamEvent> = [];

    for (const event of events) {
      operations.push({create: {}}, event);
    }

    const { errors } = await esClient.bulk({
      index: this.#names.dataStream,
      operations,
    });

    if (errors) {
      throw new Error('Some events failed to be indexed.');
    }
  }
}
