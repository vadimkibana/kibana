/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */


import type { EsClient, EsEventStreamNames } from './types';
import type { EventStreamClient } from '../types';
import { computeNames } from './compute_names';
import { EsEventStreamInitializer } from './init/es_event_stream_initializer';

export interface EsEventStreamClientDependencies {
  baseName: string;
  kibanaVersion: string;
  esClient: Promise<EsClient>;
}

export class EsEventStreamClient implements EventStreamClient {
  readonly #names: EsEventStreamNames;

  constructor(private readonly deps: EsEventStreamClientDependencies) {
    this.#names = computeNames(deps.baseName, deps.kibanaVersion);
  }

  public async initialize(): Promise<void> {
    const initializer = new EsEventStreamInitializer({
      names: this.#names,
      esClient: this.deps.esClient,
      kibanaVersion: this.deps.kibanaVersion,
    });
    await initializer.initialize();
  }

  public async addEvent(event: Event): Promise<void> {}

  public async listEventsBySubject(): Promise<void> {}

  public async listEventsByObject(): Promise<void> {}

  public async aggregateEventsBySubject(): Promise<void> {}

  public async aggregateEventsByObject(): Promise<void> {}
}
