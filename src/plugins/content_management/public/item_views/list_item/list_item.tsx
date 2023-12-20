import * as React from 'react';
import {EuiListGroupItem} from '@elastic/eui';
import {useItem} from '../../content_picker/hooks/use_item';
import {ItemViewProps} from '../types';

export const ItemViewListItem: React.FC<ItemViewProps> = ({id}) => {
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

  return (
    <EuiListGroupItem
      iconType={content.type.icon || 'bullseye'}
      label={title}
      onClick={() => {}}
    />
  );
};
