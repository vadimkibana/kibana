/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import * as React from 'react';
import { ItemViewListItem, type ContentPickerState } from '@kbn/content-management-plugin/public';

export interface Props {
  state: ContentPickerState;
}

export const SelectedPreview: React.FC<Props> = ({state}) => {
  const selected = state.useSelected();

  if (!selected.length) {
    return null;
  }

  return (
    <>
      {selected.map((id) => (
        <ItemViewListItem key={id[0] + ':' + id[1]} id={id} />
      ))}
    </>
  );
};
