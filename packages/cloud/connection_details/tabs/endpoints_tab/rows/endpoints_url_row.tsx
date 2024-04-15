/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import * as React from 'react';
import { EuiFormRow } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import {CopyInput} from '../../../components/copy_input';

export interface EndpointUrlProps {
  url: string;
}

export const EndpointUrlRow: React.FC<EndpointUrlProps> = ({
  url,
}) => {
  return (
    <EuiFormRow
      label={i18n.translate('cloud.connectionDetails.elasticEndpointLabel', {
        defaultMessage: 'Elasticsearch endpoint',
      })}
      fullWidth
      data-test-subj="connectionDetailsEsEndpoint"
    >
      <CopyInput value={url} />
    </EuiFormRow>
  );
};
