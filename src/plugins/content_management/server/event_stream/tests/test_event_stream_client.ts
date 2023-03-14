/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { until } from './util';
import { EventStreamClient, EventStreamEvent } from '../types';

export const testEventStreamClient = (clientPromise: Promise<EventStreamClient>) => {
  let now = Date.now();
  const getTime = () => now++;
  const items: EventStreamEvent[] = [
    {
      predicate: ['test', { foo: 'bar' }],
      time: getTime(),
    },
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
    {
      time: getTime(),
      subject: ['user', '55'],
      predicate: ['test', {
        foo: 'bar',
        baz: 'qux',
      }],
      object: ['dashboard', '1'],
    },
    {
      time: getTime(),
      subject: ['user', '1'],
      predicate: ['view'],
      object: ['map', 'xyz'],
    },
    {
      time: getTime(),
      subject: ['user', '2'],
      predicate: ['view'],
      object: ['canvas', 'yyyy-yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'],
    }
  ];

  describe('.writeEvents()', () => {
    it('can write a single event', async () => {
      const client = await clientPromise;
    
      await client.writeEvents([
        items[0]
      ]);
    
      await until(async () => {
        const events = await client.tail();
        return events.length === 1;
      }, 100)
    
      const tail = await client.tail();
    
      expect(tail).toMatchObject([
        items[0],
      ]);
    });
    
    it('can write multiple events', async () => {
      const client = await clientPromise;
      const events: EventStreamEvent[] = [
        items[1],
        items[2],
        items[3],
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
  });

  describe('.tail()', () => {
    it('can limit events to last 2', async () => {
      const client = await clientPromise;
      const events: EventStreamEvent[] = [
        items[4],
        items[5],
        items[6],
      ];
    
      await client.writeEvents(events);
    
      await until(async () => {
        const events = await client.tail();
        return events.length === 7;
      }, 100)
    
      const tail = await client.tail(2);
    
      expect(tail.length).toBe(2);
      expect(tail).toMatchObject([
        events[2],
        events[1],
      ]);
    });
  });

  describe('.filter()', () => {
    it('can fetch all events, cursor is empty', async () => {
      const result = await (await clientPromise).filter({});

      // console.log(JSON.stringify(result, null, 2));
      
      expect(result.cursor).toBe('');
      expect(result.events.length).toBe(7);
      expect(result.events).toMatchObject(
        items.slice(0, 7).sort((a, b) => b.time - a.time)
      );
    });

    it('can paginate through results', async () => {
      const client = await clientPromise;
      const result1 = await client.filter({ limit: 3, cursor: '' });
      const result2 = await client.filter({ limit: 3, cursor: result1.cursor });
      const result3 = await client.filter({ limit: 3, cursor: result2.cursor });

      expect(!!result1.cursor).toBe(true);
      expect(!!result2.cursor).toBe(true);
      expect(!!result3.cursor).toBe(false);

      expect(result1.events.length).toBe(3);
      expect(result2.events.length).toBe(3);
      expect(result3.events.length).toBe(1);
    });
    
    it('can limit starting time range of results', async () => {
      const client = await clientPromise;
      const result = await client.filter({
        from: items[2].time,
      });

      expect(result.cursor).toBe('');
      expect(result.events.length).toBe(5);
      expect(result.events).toMatchObject(
        items.slice(2, 7).sort((a, b) => b.time - a.time)
      );
    });

    it('can limit ending time range of results', async () => {
      const client = await clientPromise;
      const result = await client.filter({
        to: items[2].time,
      });

      expect(result.cursor).toBe('');
      expect(result.events.length).toBe(3);
      expect(result.events).toMatchObject(
        items.slice(0, 3).sort((a, b) => b.time - a.time)
      );
    });

    it('can limit starting and ending time ranges of results', async () => {
      const client = await clientPromise;
      const result = await client.filter({
        from: items[3].time,
        to: items[5].time,
      });

      expect(result.cursor).toBe('');
      expect(result.events.length).toBe(3);
      expect(result.events).toMatchObject(
        items.slice(3, 6).sort((a, b) => b.time - a.time)
      );
    });

    it('can filter results by a single subject', async () => {
      const client = await clientPromise;
      const result = await client.filter({
        subject: [['user', '55']],
      });

      expect(result.cursor).toBe('');
      expect(result.events.length).toBe(1);
      expect(result.events[0]).toStrictEqual({
        time: expect.any(Number),
        subject: ['user', '55'],
        predicate: ['test', {
          foo: 'bar',
          baz: 'qux',
        }],
        object: ['dashboard', '1'],
      });
    });
  });
};
