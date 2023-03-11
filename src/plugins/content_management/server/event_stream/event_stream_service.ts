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

  public setup({ core }: EventStreamSetup): void {
    const startServices = core.getStartServices();
    
    this.client = new EsEventStreamClient({
      baseName: '.kibana',
      kibanaVersion: this.ctx.version,
      logger: this.ctx.logger,
      esClient: startServices
        .then(([{ elasticsearch }]) => elasticsearch.client.asInternalUser),
    });
  }

  public start(): void {
    const { logger } = this.ctx;

    if (!this.client) throw new Error('EventStreamClient not initialized.');

    logger.debug('Initializing Event Stream.');
    this.client.initialize()
      .then(() => {
        logger.debug('Event Stream was initialized.');
      })
      .catch((error) => {
        logger.error('Failed to initialize Event Stream. Events will not be indexed.');
        logger.error(error);
      });
  }
}
