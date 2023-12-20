/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import * as React from 'react';
import { ContentPicker } from '@kbn/content-management-plugin/public';
import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import type { ContentPickerState } from '@kbn/content-management-plugin/public';
import {SelectedPreview} from './selected_preview';

export const ItemViewApp: React.FC = () => {
  const [state, setState] = React.useState<ContentPickerState | null>(null);

  return (
    <div>
      <EuiFlexGroup gutterSize="l">
        <EuiFlexItem>
          <ContentPicker types={['dashboard', 'visualization']} onState={setState} />
        </EuiFlexItem>
        <EuiFlexItem>
          {!!state && <SelectedPreview state={state} />}
        </EuiFlexItem>
      </EuiFlexGroup>
    </div>
  );
};
