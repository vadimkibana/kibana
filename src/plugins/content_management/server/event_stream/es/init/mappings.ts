/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

export const mappings = {
  dynamic: false,
  properties: {
    /**
     * Every document indexed to a data stream must contain a `@timestamp`
     * field, mapped as a `date` or `date_nanos` field type.
     */
    '@timestamp': {
      type: 'date',
    },

    subjectType: {
      type: 'keyword',
      ignore_above: 1024,
    },
    subjectId: {
      type: 'keyword',
      ignore_above: 1024,
    },
    predicate: {
      type: 'keyword',
      ignore_above: 1024,
    },
    payload: {
      type: 'object',
      dynamic: true,
    },
    objectType: {
      type: 'keyword',
      ignore_above: 1024,
    },
    objectId: {
      type: 'keyword',
      ignore_above: 1024,
    },
  },
};
