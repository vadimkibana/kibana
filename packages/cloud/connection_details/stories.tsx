/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import * as React from 'react';
import { ConnectionDetailsOptsProvider } from './context';
import type { ConnectionDetailsOpts } from './types';

export const StoriesProvider: React.FC = ({children}) => {
  const opts: ConnectionDetailsOpts = {
    links: {
      learnMore: 'https://www.elastic.co/LEARN_MORE',
      manageApiKeys: 'https://www.elastic.co/MANAGE_API_KEYS',
    },
    endpoints: {
      url: 'http://localhost:9200',
      id: 'my-cluster-id:dXMtZWFzdC0xLmF3cy5zdGFnaW5nLmZvdW5kaXQubm8kZjY3ZDZiZjFhM2NmNDA4ODhlODg2M2Y2Y2IyY2RjNGMkOWViYzEzYjRkOTU0NDI2NDljMzcwZTNlZjMyZWYzOGI=',
    },
    apiKeys: {
      createKey: async (name: string) => ({key: '123'}),
    },
  };

  return (
    <ConnectionDetailsOptsProvider {...opts}>
      {children}
    </ConnectionDetailsOptsProvider>
  );
};
