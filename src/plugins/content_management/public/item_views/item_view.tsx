import * as React from 'react';
import {ItemViewBaseProps} from './types';
import {ItemViewAvatar} from './avatar';
import {ItemViewListItem} from './list_item';

export interface ItemViewProps extends ItemViewBaseProps {
  view: 'avatar' | 'list-item';
}

export const ItemView: React.FC<ItemViewProps> = ({view, ...rest}) => {
  switch (view) {
    case 'avatar':
      return <ItemViewAvatar {...rest} />;
    case 'list-item':
      return <ItemViewListItem {...rest} />;
    default:
      return null;
  }
};
