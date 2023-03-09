/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import type {
  CoreSetup,
  Logger,
} from '@kbn/core/server';
import type { EventStreamClient } from './types';
import { EsEventStreamClient } from './es';

export interface EventStreamInitializerContext {
  logger: Logger;
  version: string;
}

export interface EventStreamSetup {
  core: CoreSetup;
}

export class EventStreamService {
  public client?: EventStreamClient;

  constructor(private readonly ctx: EventStreamInitializerContext) {}

  public setup({ core }: EventStreamSetup) {
    const startServices = core.getStartServices();
    
    this.client = new EsEventStreamClient({
      baseName: '.kibana',
      kibanaVersion: this.ctx.version,
      esClient: startServices
        .then(([{ elasticsearch }]) => elasticsearch.client.asInternalUser),
    });
  }

  public start() {
    const { logger } = this.ctx;

    logger.get()
    this.client?.initialize();
  }
}
