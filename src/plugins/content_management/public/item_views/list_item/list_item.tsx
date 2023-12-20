import * as React from 'react';
import {EuiListGroupItem} from '@elastic/eui';
import {useItem} from '../../content_picker/hooks/use_item';
import {ItemViewBaseProps} from '../types';

export const ItemViewListItem: React.FC<ItemViewBaseProps> = ({id, isActive, onClick}) => {
  const item = useItem(id);
  const content = item.useContent();
  const title = item.useTitle();
  
  if (!content) {
    return (
      <EuiListGroupItem
        iconType="loading"
        label={''}
        isActive={isActive}
        onClick={onClick}
      />
    );
  }

  return (
    <EuiListGroupItem
      iconType={content.type.icon || 'bullseye'}
      label={title}
      isActive={isActive}
      onClick={onClick}
    />
  );
};
