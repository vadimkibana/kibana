/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { BehaviorSubject } from 'rxjs';
import {ApiKey} from './tabs/api_keys_tab/views/success_form/types';
import type { ConnectionDetailsOpts } from './types';

export class ConnectionDetailsService {
  public readonly apiKeyName$ = new BehaviorSubject<string>('');
  public readonly apiKeyStatus$ = new BehaviorSubject<'configuring' | 'creating'>('configuring');
  public readonly apiKeyError$ = new BehaviorSubject<Error | null>(null);
  public readonly apiKey$ = new BehaviorSubject<ApiKey | null>(null);

  constructor (public readonly opts: ConnectionDetailsOpts) {}

  public readonly setApiKeyName = (name: string) => {
    this.apiKeyName$.next(name);
  };

  private readonly createKeyAsync = async () => {
    const createKey = this.opts.apiKeys?.createKey;

    if (!createKey)  {
      throw new Error('createKey() is not implemented');
    }

    this.apiKeyStatus$.next('creating');
    try {
      const { apiKey } = await createKey({
        name: this.apiKeyName$.getValue(),
      });
      this.apiKey$.next(apiKey);
    } catch (error) {
      this.apiKeyError$.next(error);
    } finally {
      this.apiKeyStatus$.next('configuring');
    }
  };

  public readonly createKey = () => {
    this.createKeyAsync().catch((error) => {
      this.apiKeyError$.next(error);
    });
  };
}
