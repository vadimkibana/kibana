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

  protected async existsIndexTemplate(): Promise<boolean> {
    try {
      const esClient = await this.deps.esClient;
      const name = this.#names.indexTemplate;
      const exists = await esClient.indices.existsIndexTemplate({ name });

      return !!exists;
    } catch (err) {
      throw new Error(`error checking existence of index template: ${err.message}`);
    }
  }

  protected async createIndexTemplateIfNotExists(): Promise<void> {
    const exists = await this.existsIndexTemplate();
    if (exists) return;
  }

  public async initialize(): Promise<void> {
    await this.createIndexTemplateIfNotExists();
  }

  public async addEvent(event: Event): Promise<void> {}

  public async listEventsBySubject(): Promise<void> {}

  public async listEventsByObject(): Promise<void> {}

  public async aggregateEventsBySubject(): Promise<void> {}

  public async aggregateEventsByObject(): Promise<void> {}
}
