/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import type { Logger } from '@kbn/core/server';
import type { EsClient } from './types';
import type { EventStreamClient, EventStreamEvent } from '../types';
import { EsEventStreamNames } from './es_event_stream_names';
import { EsEventStreamInitializer } from './init/es_event_stream_initializer';

export interface EsEventStreamClientDependencies {
  baseName: string;
  kibanaVersion: string;
  logger: Logger;
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

  public async writeEvents(events: EventStreamEvent): Promise<void> {}
}
