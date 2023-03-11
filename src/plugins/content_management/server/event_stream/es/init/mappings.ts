/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import type { estypes } from '@elastic/elasticsearch';

export const mappings: estypes.MappingTypeMapping = {
  dynamic: false,
  properties: {
    /**
     * Every document indexed to a data stream must contain a `@timestamp`
     * field, mapped as a `date` or `date_nanos` field type.
     */
    '@timestamp': {
      type: 'date',
    },

    /** Subject is the content item who/which performed the event. */
    subjectType: {
      type: 'keyword',
      ignore_above: 256,
    },
    subjectId: {
      type: 'keyword',
      ignore_above: 256,
    },

    /** Object is the content item on which the event was performed. */
    objectType: {
      type: 'keyword',
      ignore_above: 256,
    },
    objectId: {
      type: 'keyword',
      ignore_above: 256,
    },

    /** The event type. */
    predicate: {
      type: 'keyword',
      ignore_above: 256,
    },
    /** Custom payload, maybe be different per event type. */
    payload: {
      type: 'flattened',
    },
  },
};
