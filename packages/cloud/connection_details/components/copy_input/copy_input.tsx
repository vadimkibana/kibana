/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import * as React from 'react';
import {
  EuiCopy,
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiText,
} from '@elastic/eui';

export interface EndpointUrlProps {
  value: string;
}

export const CopyInput: React.FC<EndpointUrlProps> = ({
  value,
}) => {
  return (
    <EuiPanel
      borderRadius="none"
      hasShadow={false}
      color={'subdued'}
      grow={false}
    >
      <EuiFlexGroup gutterSize="s">
        <EuiFlexItem>
          <EuiText
            size={'s'}
            color={'subdued'}
            style={{wordBreak: 'break-all'}}
            data-test-subj="copyInputValue"
          >
            {value}
          </EuiText>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiCopy textToCopy={value}>
            {(copy) => (
              <EuiButtonIcon onClick={copy} iconType="copyClipboard" size="m" color={'text'} />
            )}
          </EuiCopy>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPanel>
  );
};
