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
import { TimedItemBuffer } from '@kbn/bfetch-plugin/common';

export interface EventStreamInitializerContext {
  logger: EventStreamLogger;
  clientFactory: EventStreamClientFactory;
}

export interface EventStreamSetup {
  core: CoreSetup;
}

export class EventStreamService {
  public client?: EventStreamClient;

  public readonly flush = (events: EventStreamEvent[]): void => {
    if (!this.client) throw new Error('EventStreamClient not initialized.');
    this.client.writeEvents(events)
      .catch((error) => {
        const { logger } = this.ctx;

        logger.error('Failed to write events to Event Stream.');
        logger.error(error);
      });
  };

  readonly #buffer = new TimedItemBuffer<EventStreamEvent>({
    onFlush: this.flush,
    flushOnMaxItems: 100,
    maxItemAge: 250,
  });

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
    const completeEvent: EventStreamEvent = {
      ...event,
      time: event.time || Date.now(),
    };

    this.#buffer.write(completeEvent);
  }

  public addEvents(events: Optional<EventStreamEvent, 'time'>[]): void {
    for (const event of events) {
      this.addEvent(event);
    }
  }
}
