/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import * as React from 'react';
import { type ContentPickerState, ItemView, ItemViewProps } from '@kbn/content-management-plugin/public';
import {EuiSelect, EuiSpacer} from '@elastic/eui';

export interface Props {
  state: ContentPickerState;
}

export const SelectedPreview: React.FC<Props> = ({state}) => {
  const selected = state.useSelected();
  const [view, setView] = React.useState<ItemViewProps['view']>('list-item');

  if (!selected.length) {
    return null;
  }

  return (
    <div style={{maxWidth: 400}}>
      <EuiSelect
        options={[
          {value: 'avatar', text: 'Avatar'},
          {value: 'list-item', text: 'List item'},
          {value: 'card', text: 'Card'},
        ]}
        value={view}
        onChange={(e) => {
          setView(e.target.value as ItemViewProps['view']);
        }}
      />
      <EuiSpacer />
      {selected.map((id) => (
        <ItemView key={id[0] + ':' + id[1]} view={view} id={id} />
      ))}
    </div>
  );
};
