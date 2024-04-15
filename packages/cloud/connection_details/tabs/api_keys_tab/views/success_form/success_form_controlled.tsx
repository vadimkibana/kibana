/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { EuiCallOut } from '@elastic/eui';
import * as React from 'react';
import { i18n } from '@kbn/i18n';
import { ApiKey } from './types';
import { FormatSelect, type Format } from './format_select';

export interface SuccessFormControlledProps {
  apiKey: ApiKey;
  format: Format;
  onFormatChange: (format: Format) => void;
}

export const SuccessFormControlled: React.FC<SuccessFormControlledProps> = ({ apiKey, format, onFormatChange }) => {
  return (
    <EuiCallOut
      color="success"
      iconType="check"
      title={i18n.translate('cloud.connectionDetails.apiKeys.successForm.title', {
        defaultMessage: 'Created API key "{name}"!',
        values: { name: apiKey.name },
      })}
    >
      <p>
        {i18n.translate('cloud.connectionDetails.apiKeys.successForm.message', {
          defaultMessage:
            'Copy your API key below now. It will not be available ' +
            'after you close this dialogue. The API key will expire in 90 days.',
        })}
      </p>
      <FormatSelect value={format} onChange={onFormatChange} />
    </EuiCallOut>
  );
};
