/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */


import type { EsEventStreamNames } from './types';

export const computeNames = (baseName: string, kibanaVersion: string): EsEventStreamNames => {
  const EVENT_STREAM_SUFFIX = `-event-stream`;
  const EVENT_STREAM_VERSION_SUFFIX = `-${kibanaVersion.toLocaleLowerCase()}`;
  const eventStreamName = `${baseName}${EVENT_STREAM_SUFFIX}`;
  const eventStreamNameWithVersion = `${eventStreamName}${EVENT_STREAM_VERSION_SUFFIX}`;
  const baseNameSansDot = baseName.startsWith('.') ? baseName.substring(1) : baseName;
  const eventStreamPolicyName = `${baseNameSansDot}${EVENT_STREAM_SUFFIX}-policy`;

  return {
    base: baseName,
    alias: eventStreamNameWithVersion,
    ilmPolicy: `${eventStreamPolicyName}`,
    indexPattern: `${eventStreamName}-*`,
    indexPatternWithVersion: `${eventStreamNameWithVersion}-*`,
    initialIndex: `${eventStreamNameWithVersion}-000001`,
    indexTemplate: `${eventStreamNameWithVersion}-template`,
  };
};
