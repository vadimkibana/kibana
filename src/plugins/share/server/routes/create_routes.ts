/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { IRouter, Logger } from 'kibana/server';

import { shortUrlLookupProvider } from './lib/short_url_lookup';
import { createShortenUrlRoute } from './shorten_url';

export function createRoutes(router: IRouter, logger: Logger) {
  const shortUrlLookup = shortUrlLookupProvider({ logger });

  createShortenUrlRoute({ router, shortUrlLookup });
}
