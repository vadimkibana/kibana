import * as React from 'react';
import {EuiListGroupItem} from '@elastic/eui';
import {useItem} from '../../hooks/use_item';
import {useContentPicker} from '../../context/state';
import type {ContentId} from '../../types';

export interface Props {
  id: ContentId;
}

export const InlinePickerItem: React.FC<Props> = ({id}) => {
  const {state} = useContentPicker();
  const item = useItem(id);
  const query = item.useQuery();
  const type = state.services.registry.get(id[0]);

  if (!query) return null;
  
  if (query.status !== 'success') {
    return (
      <EuiListGroupItem
        iconType="loading"
        label={''}
        onClick={() => {}}
      />
    );
  }

  return (
    <EuiListGroupItem
      iconType={type?.icon || 'bullseye'}
      label={item.id[1]}
      onClick={() => {}}
      // isActive
    />
  );
};
