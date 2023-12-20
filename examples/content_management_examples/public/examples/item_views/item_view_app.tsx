/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import * as React from 'react';
import { ContentPicker, ItemViewListItem } from '@kbn/content-management-plugin/public';
import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui';

export const ItemViewApp: React.FC = () => {
  return (
    <div>
      <EuiFlexGroup gutterSize="l">
        <EuiFlexItem>
          <ContentPicker types={['dashboard', 'visualization']} />
        </EuiFlexItem>
        <EuiFlexItem>
          <ItemViewListItem id={['dashboard', 'asdf']} />
        </EuiFlexItem>
      </EuiFlexGroup>
    </div>
  );
};
