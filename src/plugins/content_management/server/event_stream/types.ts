/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

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

  // listEventsBySubject(): Promise<void>;
  // listEventsByObject(): Promise<void>;
  // aggregateEventsBySubject(): Promise<void>;
  // aggregateEventsByObject(): Promise<void>;
}

/**
 * Represents a single event in the Event Stream.
 */
export interface EventStreamEvent {
  /**
   * Time when the event occurred.
   */
  '@timestamp': string;

  /**
   * Type of the subject. Subject is the content item who/which performed the
   * event.
   */
  subjectType: string;

  /**
   * ID of the subject.
   */
  subjectId: string;

  /**
   * Type of the object. Object is the content item on which the event was
   * performed.
   */
  objectType: string;

  /**
   * ID of the object.
   */
  objectId: string;

  /**
   * Specifies the event type. Such as `create`, `update`, `delete`, etc.
   */
  predicate: string;

  /**
   * Custom payload, maybe be different per event type.
   */
  payload?: Record<string, unknown>;
}

import type { Logger } from '@kbn/core/server';

export type EventStreamLogger = Pick<Logger, 'debug' | 'error' | 'info' | 'warn'>;
