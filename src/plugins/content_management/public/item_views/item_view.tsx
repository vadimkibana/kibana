import * as React from 'react';
import {ItemViewBaseProps} from './types';
import {ItemViewAvatar} from './avatar';
import {ItemViewListItem} from './list_item';
import {ItemViewCard} from './card';

export interface ItemViewProps extends ItemViewBaseProps {
  view: 'avatar' | 'list-item' | 'card';
}

export const ItemView: React.FC<ItemViewProps> = ({view, ...rest}) => {
  switch (view) {
    case 'avatar':
      return <ItemViewAvatar {...rest} />;
    case 'list-item':
      return <ItemViewListItem {...rest} />;
    case 'card':
      return <ItemViewCard {...rest} />;
    default:
      return null;
  }
};
