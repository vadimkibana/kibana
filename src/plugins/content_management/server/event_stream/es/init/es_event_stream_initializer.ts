/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import pRetry from 'p-retry';
import type { Logger } from '@kbn/core/server';
import type { EsClient } from '../types';
import type { EsEventStreamNames } from '../es_event_stream_names';
import { newIndexTemplateRequest } from './index_template';
import { errors } from '@elastic/elasticsearch';

export interface EsEventStreamInitializerDependencies {
  names: EsEventStreamNames;
  kibanaVersion: string;
  logger: Logger;
  esClient: Promise<EsClient>;
}

export class EsEventStreamInitializer {
  constructor(private readonly deps: EsEventStreamInitializerDependencies) {}

  /**
   * Calls a function; retries calling it multiple times via p-retry, if it fails.
   * Should retry on 2s, 4s, 8s, 16s.
   * 
   * See: https://github.com/tim-kos/node-retry#retryoperationoptions
   * 
   * @param fn Function to retry, if it fails.
   */
  readonly #retry = async (fn: () => Promise<void>, fnName: string): Promise<void> => {
    this.deps.logger.debug(`Event Stream initialization operation: ${fnName}`);

    await pRetry(fn, {
      minTimeout: 1000,
      maxTimeout: 1000 * 60 * 3,
      retries: 4,
      factor: 2,
      randomize: true,
      onFailedAttempt: (err) => {
        const message = `Event Stream initialization operation failed and will be retried: ${fnName};` +
          `${err.retriesLeft} more times; error: ${err.message}`;

        this.deps.logger.warn(message);
      },
    });
  }

  public async initialize(): Promise<void> {
    await this.#retry(this.createIndexTemplateIfNotExists, 'createIndexTemplateIfNotExists');
    await this.#retry(this.createDataStream, 'createDataStream');
  }

  protected readonly createIndexTemplateIfNotExists = async (): Promise<void> => {
    const exists = await this.indexTemplateExists();
    if (exists) return;
    await this.createIndexTemplate();
  };

  protected async indexTemplateExists(): Promise<boolean> {
    try {
      const esClient = await this.deps.esClient;
      const name = this.deps.names.indexTemplate;
      const exists = await esClient.indices.existsIndexTemplate({ name });

      return !!exists;
    } catch (err) {
      throw new Error(`error checking existence of index template: ${err.message}`);
    }
  }

  protected async createIndexTemplate(): Promise<void> {
    try {
      const esClient = await this.deps.esClient;
      const { indexTemplate, indexPattern } = this.deps.names;
      const request = newIndexTemplateRequest({
        name: indexTemplate,
        indexPatterns: [indexPattern],
        kibanaVersion: this.deps.kibanaVersion,
      });

      await esClient.indices.putIndexTemplate(request);
    } catch (err) {
      // The error message doesn't have a type attribute we can look to guarantee it's due
      // to the template already existing (only long message) so we'll check ourselves to see
      // if the template now exists. This scenario would happen if you startup multiple Kibana
      // instances at the same time.
      const exists = await this.indexTemplateExists();

      if (exists) return;

      const error = new Error(`error creating index template: ${err.message}`);
      Object.assign(error, { wrapped: err });
      throw error;
    }
  }

  protected readonly createDataStream = async (): Promise<void> => {
    const esClient = await this.deps.esClient;
    const name = this.deps.names.dataStream;

    try {
      await esClient.indices.createDataStream({
        name,
      });
    } catch (error) {
      const alreadyExists = (error as errors.ResponseError)?.body?.error?.type === 'resource_already_exists_exception';

      if (alreadyExists) return;

      throw error;
    }
  };
}
