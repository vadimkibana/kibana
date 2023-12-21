import * as React from 'react';
import {EuiAvatar, EuiAvatarProps} from '@elastic/eui';
import {useItem} from '../../content_picker/hooks/use_item';
import {ItemViewBaseProps} from '../types';

export interface ItemViewAvatarProps extends ItemViewBaseProps {
  size?: EuiAvatarProps['size'];
}

export const ItemViewAvatar: React.FC<ItemViewAvatarProps> = ({size, id, isActive, onClick}) => {
  const item = useItem(id);
  const title = item.useTitle();

  return (
    <EuiAvatar size={size} name={title} type='space' />
  );
};
