/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { BehaviorSubject } from 'rxjs';
import type { ConnectionDetailsOptsContextValue } from "./context";

export class ConnectionDetailsService {
  public readonly apiKeyName$ = new BehaviorSubject<string>('');

  constructor (public readonly opts: ConnectionDetailsOptsContextValue) {}

  public readonly setApiKeyName = (name: string) => {
    this.apiKeyName$.next(name);
  };

  public readonly createKey = () => {};
}
