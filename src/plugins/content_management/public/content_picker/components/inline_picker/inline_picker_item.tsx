import * as React from 'react';
import {EuiListGroupItem} from '@elastic/eui';
import {useItem} from '../../hooks/use_item';
import type {ContentId} from '../../types';

export interface Props {
  id: ContentId;
}

export const InlinePickerItem: React.FC<Props> = ({id}) => {
  const item = useItem(id);
  
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
      iconType="bullseye"
      label={(item.data as any).item.attributes.title}
      onClick={() => {}}
      // isActive
    />
  );
};
