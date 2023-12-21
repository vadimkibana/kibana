import * as React from 'react';
import {EuiCard, EuiFlexGroup, EuiFlexItem} from '@elastic/eui';
import {useItem} from '../../content_picker/hooks/use_item';
import {ItemViewBaseProps} from '../types';

export interface ItemViewCardProps extends ItemViewBaseProps {}

export const ItemViewCard: React.FC<ItemViewCardProps> = ({id, onClick}) => {
  const item = useItem(id);
  const title = item.useTitle();

  return (
    <EuiCard
      textAlign="left"
      titleSize='xs'
      title={title}
      description={'Description'}
      footer={
        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            ...
          </EuiFlexItem>
        </EuiFlexGroup>
      }
    />
  );
};
