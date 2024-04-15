/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { EuiFieldText, EuiForm, EuiFormRow } from '@elastic/eui';
import * as React from 'react';
import { i18n } from '@kbn/i18n';
import { useConnectionDetailsService } from '@kbn/cloud/connection_details/context';
import { useBehaviorSubject } from '../../../hooks/use_bahavior_subject';

export interface KeySetupFormProps {
  loading?: boolean;
}

export const KeySetupForm: React.FC<KeySetupFormProps> = ({loading}) => {
  const service = useConnectionDetailsService();
  const keyName = useBehaviorSubject(service.apiKeyName$);

  return (
    <EuiForm component="form">
      <EuiFormRow
        label={i18n.translate('cloud.connectionDetails.tab.apiKeys.nameField.label', {
          defaultMessage: 'API key name',
        })}
        helpText={i18n.translate('cloud.connectionDetails.tab.apiKeys.nameField.helpText', {
          defaultMessage: 'A good name makes it clear what your API key does.',
        })}
        isDisabled={loading}
      >
        <EuiFieldText
          name="api-key-name"
          disabled={loading}
          isLoading={loading}
          value={keyName}
          onChange={event => {
            service.setApiKeyName(event.target.value);
          }}
        />
      </EuiFormRow>
    </EuiForm>
  );
};
