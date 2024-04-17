/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import type { CoreStart } from '@kbn/core-lifecycle-browser';
import type { SharePluginStart } from '@kbn/share-plugin/public';

export interface StartDeps {
  core: CoreStart;
  plugins: {
    share?: SharePluginStart;
  };
}

export const setStartDeps = (deps: StartDeps) => {
  (window as any).__start = deps;
};

export const getStartDeps = (): StartDeps => {
  const start = (window as any).__start;

  if (!start) {
    throw new Error('Start dependencies not set');
  }

  return start as StartDeps;
};
