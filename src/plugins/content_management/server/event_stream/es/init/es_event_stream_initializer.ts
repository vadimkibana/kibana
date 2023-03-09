/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import type { EsClient, EsEventStreamNames } from '../types';
import { mappings } from './mappings';

export interface EsEventStreamInitializerDependencies {
  esClient: Promise<EsClient>;
  names: EsEventStreamNames;
}

export class EsEventStreamInitializer {
  constructor(private readonly deps: EsEventStreamInitializerDependencies) {}

  protected async existsIndexTemplate(): Promise<boolean> {
    try {
      const esClient = await this.deps.esClient;
      const name = this.deps.names.indexTemplate;
      const exists = await esClient.indices.existsIndexTemplate({ name });

      return !!exists;
    } catch (err) {
      throw new Error(`error checking existence of index template: ${err.message}`);
    }
  }

  protected async createIndexTemplateIfNotExists(): Promise<void> {
    const exists = await this.existsIndexTemplate();
    if (exists) return;
    const indexTemplateObject = this.createIndexTemplateObject();
  }

  public createIndexTemplateObject(): unknown {
    const names = this.deps.names;

    return {
      index_patterns: [names.indexPatternWithVersion],
      template: {
        settings: {
          number_of_shards: 1,
          auto_expand_replicas: '0-1',
          'index.hidden': true,
        },
        mappings,
      },
    };
  }
}
