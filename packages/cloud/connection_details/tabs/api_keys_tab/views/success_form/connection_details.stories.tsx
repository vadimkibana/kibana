/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React from 'react';
import { StoriesProvider } from '../../../../stories';
import { SuccessForm } from './success_form';

export default {
  title: 'Connection Details/Tabs/API Keys/Success Form',
};

export const Default = () => {
  return (
    <StoriesProvider>
      <SuccessForm
        apiKey={{
          id: 'KEY_ID',
          name: 'KEY_NAME',
          encoded: 'ENCODED_KEY',
          key: 'THE_KEY',
        }}
      />
    </StoriesProvider>
  );
};
