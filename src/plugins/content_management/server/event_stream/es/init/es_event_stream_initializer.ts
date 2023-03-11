/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import type { EsClient, EsEventStreamNames } from '../types';
import {newIndexTemplateRequest} from './index_template';

export interface EsEventStreamInitializerDependencies {
  esClient: Promise<EsClient>;
  kibanaVersion: string;
  names: EsEventStreamNames;
}

export class EsEventStreamInitializer {
  constructor(private readonly deps: EsEventStreamInitializerDependencies) {}

  public async initialize(): Promise<void> {
    await this.createIndexTemplateIfNotExists();
  }

  protected async createIndexTemplateIfNotExists(): Promise<void> {
    const exists = await this.indexTemplateExists();
    if (exists) return;
    await this.createIndexTemplate();
  }

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
      const { indexTemplate, indexPatternWithVersion } = this.deps.names;
      const request = newIndexTemplateRequest({
        name: indexTemplate,
        indexPatterns: [indexPatternWithVersion],
        kibanaVersion: this.deps.kibanaVersion,
      });

      console.log('will create index', request);
      // await esClient.indices.putIndexTemplate(request);
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
}
