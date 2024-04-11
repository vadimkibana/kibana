/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import * as React from 'react';
import {
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiFlyoutHeader,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from '@elastic/eui';
import {ConnectionDetails} from './connection_details';

export const ConnectionDetailsFlyout: React.FC = () => {
  return (
    <>
      <EuiFlyoutHeader hasBorder>
        <EuiTitle size="m" data-test-subj="connectionDetailsModalTitle">
          <h2>Connection details</h2>
        </EuiTitle>
        <EuiSpacer size="s" />
        <EuiText color="subdued">
          <p>
            Put navigation items in the header, and cross tab actions in a
            footer.
          </p>
        </EuiText>
      </EuiFlyoutHeader>
      <EuiFlyoutBody data-test-subj="connectionDetailsModalBody">
        <ConnectionDetails />
      </EuiFlyoutBody>
      <EuiFlyoutFooter />
    </>
  );
};
