import * as React from 'react';
import {ItemViewAvatar, ItemViewAvatarProps} from '../avatar';
import {EuiFlexGroup, EuiFlexItem, EuiText} from '@elastic/eui';
import {useItem} from '../../content_picker/hooks/use_item';

export interface ItemViewBadgeProps extends ItemViewAvatarProps {}

export const ItemViewBadge: React.FC<ItemViewAvatarProps> = (props) => {
  const item = useItem(props.id);
  const title = item.useTitle();

  return (
    <EuiFlexGroup alignItems='center'>
      <EuiFlexItem grow={false}>
        <ItemViewAvatar {...props} />
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiText size="m">
          {title}
        </EuiText>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};
