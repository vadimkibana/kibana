/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import * as React from 'react';
import { ItemView, ItemViewProps } from '@kbn/content-management-plugin/public';
import { EuiSelect, EuiSpacer } from '@elastic/eui';
import { ContentId } from '@kbn/content-management-plugin/public/content_picker/types';

export interface Props {
  ids: ContentId[];
}

export const SelectedPreview: React.FC<Props> = ({ids}) => {
  const [view, setView] = React.useState<ItemViewProps['view']>('card');

  if (!ids.length) {
    return null;
  }

  return (
    <div style={{maxWidth: 400}}>
      <EuiSelect
        options={[
          {value: 'avatar', text: 'Avatar'},
          {value: 'badge', text: 'Badge'},
          {value: 'list-item', text: 'List item'},
          {value: 'card', text: 'Card'},
        ]}
        value={view}
        onChange={(e) => {
          setView(e.target.value as ItemViewProps['view']);
        }}
      />
      <EuiSpacer />
      {ids.map((id) => (
        <div key={id[0] + ':' + id[1]}>
          <ItemView view={view} id={id} />
          <EuiSpacer size="s" />
        </div>
      ))}
    </div>
  );
};
