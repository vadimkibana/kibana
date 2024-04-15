/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import * as React from 'react';
import { useConnectionDetailsService } from '../../context';
import { useBehaviorSubject } from '../../hooks/use_behavior_subject';
import { KeySetupForm } from './views/key_setup_form';
import { SuccessForm } from './views/success_form';

export const ApiKeysTab: React.FC = () => {
  const service = useConnectionDetailsService();
  const { apiKeys } = service.opts;
  const keyName = useBehaviorSubject(service.apiKeyName$);
  const keyStatus = useBehaviorSubject(service.apiKeyStatus$);
  const apiKey = useBehaviorSubject(service.apiKey$);
  const error = useBehaviorSubject(service.apiKeyError$);

  if (!apiKeys) return null;

  if (apiKey) {
    return (
      <SuccessForm apiKey={apiKey} />
    );
  }

  return (
    <KeySetupForm
      name={keyName}
      loading={keyStatus === 'creating'}
      onNameChange={(event) => {
        service.setApiKeyName(event.target.value);
      }}
      onSubmit={(event) => {
        event.preventDefault();
        service.createKey();
      }}
    />
  );
};
