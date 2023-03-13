/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { until, tick } from './util';
import { EventStreamClient, EventStreamEvent } from '../types';

export const testEventStreamClient = (clientPromise: Promise<EventStreamClient>) => {
  let now = Date.now();
  const getTime = () => now++;

  it('can write a single event', async () => {
    await tick(1);
  
    const client = await clientPromise;
    const time = getTime();
  
    await client.writeEvents([
      {
        predicate: ['test', { foo: 'bar' }],
        time,
      },
    ]);
  
    await until(async () => {
      const events = await client.tail();
      return events.length === 1;
    }, 100)
  
    const tail = await client.tail();
  
    expect(tail).toMatchObject([
      {
        predicate: ['test', { foo: 'bar' }],
        time,
      },
    ]);
  });
  
  it('can write multiple events', async () => {
    await tick(1);
  
    const client = await clientPromise;
    const events: EventStreamEvent[] = [
      {
        time: getTime(),
        subject: ['user', '1'],
        predicate: ['test', { foo: 'bar' }],
        object: ['dashboard', '1'],
      },
      {
        time: getTime(),
        subject: ['user', '2'],
        predicate: ['view'],
        object: ['map', 'xyz'],
      },
      {
        time: getTime(),
        subject: ['user', '2'],
        predicate: ['view'],
        object: ['canvas', 'xxxx-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'],
      },
    ];
  
    await client.writeEvents(events);
  
    await until(async () => {
      const events = await client.tail();
      return events.length === 4;
    }, 100)
  
    const tail = await client.tail();
  
    expect(tail.slice(0, 3)).toMatchObject([
      events[2],
      events[1],
      events[0],
    ]);
  });
};
