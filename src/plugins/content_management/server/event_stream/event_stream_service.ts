/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import type { CoreSetup } from '@kbn/core/server';
import type { Optional } from 'utility-types';
import type {
  EventStreamClient,
  EventStreamClientFactory,
  EventStreamEvent,
  EventStreamLogger
} from './types';

export interface EventStreamInitializerContext {
  logger: EventStreamLogger;
  clientFactory: EventStreamClientFactory;
}

export interface EventStreamSetup {
  core: CoreSetup;
}

export class EventStreamService {
  public client?: EventStreamClient;

  constructor(private readonly ctx: EventStreamInitializerContext) {}

  public setup({ core }: EventStreamSetup): void {
    this.client = this.ctx.clientFactory.create(core);
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

  #getClient(): EventStreamClient {
    if (!this.client) throw new Error('EventStreamClient not initialized.');
    return this.client;
  }

  public async tail(limit: number = 100): Promise<EventStreamEvent[]> {
    const client = this.#getClient();

    return await client.tail(limit);
  }

  public addEvent(event: Optional<EventStreamEvent, 'time'>): void {
    const client = this.#getClient();
    const completeEvent: EventStreamEvent = {
      ...event,
      time: event.time || Date.now(),
    };
    
    client.writeEvents([completeEvent])
      .catch((error) => {});
  }
}
