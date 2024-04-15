/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import * as React from 'react';
import { ConnectionDetailsService } from '../service';
import { context as serviceContext } from './service';

export interface ConnectionDetailsOptsContextValue {
  links?: ConnectionDetailsOptsContextValueLinks;
  endpoints?: ConnectionDetailsOptsContextValueEndpoints;
  apiKeys?: ConnectionDetailsOptsContextValueApiKeys;
}


export interface ConnectionDetailsOptsContextValueLinks {
  learnMore?: string;
}

export interface ConnectionDetailsOptsContextValueEndpoints {
  url?: string;
  id?: string;
}

export interface ConnectionDetailsOptsContextValueApiKeys {
  createKey: (name: string) => Promise<{key: string}>;
}

export const context = React.createContext<ConnectionDetailsOptsContextValue>({});

export const ConnectionDetailsOpts: React.FC<ConnectionDetailsOptsContextValue> = ({children, ...opts}) => {
  const service = React.useMemo(() => new ConnectionDetailsService(opts), []);

  return (
    <context.Provider value={opts}>
      <serviceContext.Provider value={service}>
        {children}
      </serviceContext.Provider>
    </context.Provider>
  );
};

export const useConnectionDetailsOpts = (): ConnectionDetailsOptsContextValue => {
  const value = React.useContext(context);

  if (!value || Object.keys(value).length === 0) {
    throw new Error('ConnectionDetailsOptsContextValue is not set up.');
  }

  return value;
};
