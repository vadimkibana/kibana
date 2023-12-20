import * as React from 'react';
import {EuiListGroupItem} from '@elastic/eui';
import {useItem} from '../../hooks/use_item';
import type {ContentId} from '../../types';

export interface Props {
  id: ContentId;
}

export const InlinePickerItem: React.FC<Props> = ({id}) => {
  const item = useItem(id);
  const content = item.useContent();
  const title = item.useTitle();
  
  if (!content) {
    return (
      <EuiListGroupItem
        iconType="loading"
        label={''}
        onClick={() => {}}
      />
    );
  }

  console.log(content.fields());

  return (
    <EuiListGroupItem
      iconType={content.type.icon || 'bullseye'}
      label={title}
      onClick={() => {}}
      // isActive
    />
  );
};
