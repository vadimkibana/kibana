/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import * as React from 'react';
import {
  EuiFieldText,
  EuiCopy,
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem,
} from '@elastic/eui';

export interface EndpointUrlProps {
  value: string;
}

export const CopyInput: React.FC<EndpointUrlProps> = ({
  value,
}) => {
  return (
    <EuiFlexGroup gutterSize="s">
      <EuiFlexItem>
        <EuiFieldText
          value={value}
          fullWidth
          disabled
          data-test-subj="copyInputField"
        />
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiCopy textToCopy={value}>
          {(copy) => (
            <EuiButtonIcon onClick={copy} iconType="copyClipboard" display="base" size="m" />
          )}
        </EuiCopy>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};
