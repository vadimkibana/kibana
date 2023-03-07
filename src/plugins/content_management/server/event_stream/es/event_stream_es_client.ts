/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */


import type { ElasticsearchClient } from './types';
import type { EventStreamClient } from '../types';

export interface EventStreamStorageDependencies {
  baseName: string;
  kibanaVersion: string;
  esClient: Promise<ElasticsearchClient>;
}

interface Names {
  base: string;
  alias: string;
  ilmPolicy: string;
  indexPattern: string;
  indexPatternWithVersion: string;
  initialIndex: string;
  indexTemplate: string;
}

export function computeNames(baseName: string, kibanaVersion: string): Names {
  const EVENT_STREAM_SUFFIX = `-event-stream`;
  const EVENT_STREAM_VERSION_SUFFIX = `-${kibanaVersion.toLocaleLowerCase()}`;
  const eventStreamName = `${baseName}${EVENT_STREAM_SUFFIX}`;
  const eventStreamNameWithVersion = `${eventStreamName}${EVENT_STREAM_VERSION_SUFFIX}`;
  const baseNameSansDot = baseName.startsWith('.') ? baseName.substring(1) : baseName;
  const eventStreamPolicyName = `${baseNameSansDot}${EVENT_STREAM_SUFFIX}-policy`;

  return {
    base: baseName,
    alias: eventStreamNameWithVersion,
    ilmPolicy: `${eventStreamPolicyName}`,
    indexPattern: `${eventStreamName}-*`,
    indexPatternWithVersion: `${eventStreamNameWithVersion}-*`,
    initialIndex: `${eventStreamNameWithVersion}-000001`,
    indexTemplate: `${eventStreamNameWithVersion}-template`,
  };
}

export class EventStreamEsClient implements EventStreamClient {
  readonly #names: Names;

  constructor(private readonly deps: EventStreamStorageDependencies) {
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
    console.log('checking if index exists');
    const exists = await this.existsIndexTemplate();
    console.log('EXISTS', exists);
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
