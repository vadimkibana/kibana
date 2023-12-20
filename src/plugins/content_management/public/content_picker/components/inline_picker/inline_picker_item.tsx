import * as React from 'react';
import {EuiListGroupItem} from '@elastic/eui';
import {useItem} from '../../hooks/use_item';
import type {ContentId} from '../../types';
import {useContentPicker} from '../../context/state';

export interface Props {
  id: ContentId;
}

export const InlinePickerItem: React.FC<Props> = ({id}) => {
  const {state} = useContentPicker();
  const item = useItem(id);
  const type = state.services.registry.get(id[0]);
  
  if (item?.status !== 'success') {
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
      label={(item.data as any).item.attributes.title}
      onClick={() => {}}
      // isActive
    />
  );
};
