/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import type { CoreSetup } from '@kbn/core/server';

/**
 * Represents a factory which can be used to create an Event Stream client.
 */
export interface EventStreamClientFactory {
  /**
   * Creates an Event Stream client.
   * 
   * @param core The CoreSetup object provided by the Kibana platform.
   */
  create(core: CoreSetup): EventStreamClient;
}

/**
 * Represents a storage layer for events.
 */
export interface EventStreamClient {
  /**
   * Initializes the Event Stream client. This method is run at the plugin's
   * `setup` phase. It should be used to create any necessary resources.
   */
  initialize(): Promise<void>;

  /**
   * Immediately writes one or more events to the Event Stream using a bulk
   * request.
   * 
   * @param events One or more events to write to the Event Stream.
   */
  writeEvents: (events: EventStreamEvent[]) => Promise<void>;

  /**
   * Retrieves the most recent events from the Event Stream.
   * 
   * @param limit The maximum number of events to return. If not specified, the
   *              default is 100.
   */
  tail(limit?: number): Promise<EventStreamEvent[]>;

  /**
   * Retrieves events from the Event Stream which match the specified filter
   * options.
   */
  filter: (options: EventStreamClientFilterOptions) => Promise<EventStreamClientFilterResult>;
}

/**
 * Represents the options which can be used to filter events from the Event
 * Stream.
 */
export interface EventStreamClientFilterOptions {
  /**
   * One or more subjects to filter by. Subjects are joined by `OR` logic.
   */
  subject?: [type: string, id?: string][];

  /**
   * One or more predicates to filter by. Predicates are joined by `OR` logic.
   */
  predicate?: [type: string, attributes?: Record<string, string>][];

  /**
   * One or more objects to filter by. Objects are joined by `OR` logic.
   */
  object?: [type: string, id?: string][];

  /**
   * The starting time to filter by. Events which occurred after this time will
   * be returned. If not specified, the default is the beginning of time.
   */
  from?: number;

  /**
   * The ending time to filter by. Events which occurred before this time will
   * be returned. If not specified, the default is the current time.
   */
  to?: number;

  /**
   * The maximum number of events to return. If not specified, the default is
   * 100.
   */
  limit?: number;

  /**
   * A cursor which can be used to retrieve the next page of results. On the
   * first call, this should be `undefined` or empty string. On subsequent
   * calls, this should be the value of the `cursor` property returned by the
   * previous call in the {@link EventStreamClientFilterResult} object.
   */
  cursor?: string;
}

/**
 * Represents the result of a `.filter()` operation.
 */
export interface EventStreamClientFilterResult {
  /**
   * A cursor which can be used to retrieve the next page of results. Should be
   * treated as a opaque value. When empty, there are no more results.
   */
  cursor: string;

  /**
   * The list of events which matched the filter. Sorted by time in descending
   * order.
   */
  events: EventStreamEvent[];
}

/**
 * Represents a single event in the Event Stream. Events can be thought of as
 * "Semantic triples" (see https://en.wikipedia.org/wiki/Semantic_triple).
 * Semantic triples have a subject, a predicate, and an object. In the context
 * of the Event Stream, the subject is the content item who/which performed the
 * event, the predicate is the event type (such as `create`, `update`, `delete`,
 * etc.), and the object is the content item on which the action was performed.
 */
export interface EventStreamEvent {
  /**
   * Specifies who performed the event. The subject is a tuple of the type of
   * the subject and the ID of the subject.
   */
  subject?: [type: string, id: string];

  /**
   * Specifies the event type. Such as `create`, `update`, `delete`, etc.
   * The predicate is a tuple of the type of the predicate and any attributes
   * associated with the predicate.
   */
  predicate: [type: string, attributes?: Record<string, unknown>];

  /**
   * Specifies the content item on which the event was performed. The object is
   * a tuple of the type of the object and the ID of the object.
   */
  object?: [type: string, id: string];

  /**
   * Timestamp in milliseconds since the Unix Epoch when the event occurred.
   */
  time: number;

  /**
   * An ID which allows to trace the event back to the original request. As well
   * as to associate multiple events together.
   */
  traceId?: string;
}

import type { Logger } from '@kbn/core/server';

/**
 * Logger interface used in the Event Stream.
 */
export type EventStreamLogger = Pick<Logger, 'debug' | 'error' | 'info' | 'warn'>;
