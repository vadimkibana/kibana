/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import type { EventStreamClient, EventStreamEvent } from '../types';
import { clone } from './util';

export class MemoryEventStreamClient implements EventStreamClient {
  #events: EventStreamEvent[] = [];

  public async initialize(): Promise<void> {}

  public async writeEvents(events: EventStreamEvent[]): Promise<void> {
    for (const event of events) {
      this.#events.push(clone(event));
    }
    this.#events.sort((a, b) => b.time - a.time);
  }

  public async tail(limit: number = 100): Promise<EventStreamEvent[]> {
    const tail = this.#events.slice(0, limit);

    return tail.map(clone);
  }
}
