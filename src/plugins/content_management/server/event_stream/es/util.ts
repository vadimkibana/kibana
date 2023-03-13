/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import type { EventStreamEvent } from '../types';
import type { EsEventStreamEventDto } from './types';

export const eventToDto = (event: EventStreamEvent): EsEventStreamEventDto => {
  const {
    time,
    subject,
    predicate,
    object,
    traceId,
  } = event;

  const dto: EsEventStreamEventDto = {
    "@timestamp": new Date(time).toISOString(),
    predicate: predicate[0],
  };

  if (subject) {
    dto.subjectType = subject[0];
    dto.subjectId = subject[1];
  }

  if (predicate[1]) {
    dto.payload = predicate[1];
  }

  if (object) {
    dto.objectType = object[0];
    dto.objectId = object[1];
  }

  if (traceId) {
    dto.traceId = traceId;
  }

  return dto;
};

export const dtoToEvent = (dto: EsEventStreamEventDto): EventStreamEvent => {
  const {
    "@timestamp": timestamp,
    subjectType,
    subjectId,
    predicate,
    payload,
    objectId,
    objectType,
    traceId,
  } = dto;

  const event: EventStreamEvent = {
    time: new Date(timestamp).getTime(),
    predicate: [predicate],
  };

  if (subjectType && subjectId) {
    event.subject = [subjectType, subjectId];
  }

  if (payload) {
    event.predicate.push(payload);
  }

  if (objectType && objectId) {
    event.object = [objectType, objectId];
  }

  if (traceId) {
    event.traceId = traceId;
  }

  return event;
};
