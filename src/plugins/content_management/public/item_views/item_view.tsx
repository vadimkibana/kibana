import * as React from 'react';
import {ItemViewBaseProps} from './types';
import {ItemViewAvatar} from './avatar';
import {ItemViewListItem} from './list_item';
import {ItemViewCard} from './card';
import {ItemViewBadge} from './badge/badge';
import {ItemViewThumbnail} from './thumbnail';

export interface ItemViewProps extends ItemViewBaseProps {
  view: 'avatar' | 'badge' | 'list-item' | 'thumbnail' | 'card';
}

export const ItemView: React.FC<ItemViewProps> = ({view, ...rest}) => {
  switch (view) {
    case 'avatar':
      return <ItemViewAvatar {...rest} />;
    case 'badge':
      return <ItemViewBadge {...rest} />;
    case 'list-item':
      return <ItemViewListItem {...rest} />;
    case 'thumbnail':
      return <ItemViewThumbnail {...rest} />;
    case 'card':
      return <ItemViewCard {...rest} />;
    default:
      return null;
  }
};
