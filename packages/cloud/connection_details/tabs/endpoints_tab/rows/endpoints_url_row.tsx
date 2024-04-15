/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import * as React from 'react';
import {
  EuiFormRow,
  EuiFieldText,
  EuiCopy,
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem,
} from '@elastic/eui';
import { i18n } from '@kbn/i18n';

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
    >
      <EuiFlexGroup gutterSize="s">
        <EuiFlexItem>
          <EuiFieldText
            value={url}
            fullWidth
            disabled
            data-test-subj="connectionDetailsEsEndpoint"
          />
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiCopy textToCopy={url}>
            {(copy) => (
              <EuiButtonIcon onClick={copy} iconType="copyClipboard" display="base" size="m" />
            )}
          </EuiCopy>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiFormRow>
  );
};
