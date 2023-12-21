import * as React from 'react';
import {EuiCard, EuiFlexGroup, EuiFlexItem, EuiIcon, EuiSpacer} from '@elastic/eui';
import {useItem} from '../../content_picker/hooks/use_item';
import {ItemViewBaseProps} from '../types';

export interface ItemViewCardProps extends ItemViewBaseProps {}

export const ItemViewCard: React.FC<ItemViewCardProps> = ({id, onClick}) => {
  const item = useItem(id);
  const title = item.useTitle();
  const {description, createdAt} = item.useFields();

  return (
    <EuiCard
      textAlign="left"
      titleSize='xs'
      paddingSize="l"
      hasBorder
      title={(
        <>
          <div>
            <EuiIcon type={item.type.icon} />
          </div>
          <EuiSpacer size={'s'} />
          <div>
            {title}
          </div>
        </>
      )}
      description={description}
      footer={!createdAt ? undefined : (
        <>
          <EuiSpacer />
          <EuiFlexGroup justifyContent="flexEnd">
            <EuiFlexItem grow={false}>
              <span style={{opacity: .5}}>
                {new Date(createdAt).toDateString()}
              </span>
            </EuiFlexItem>
          </EuiFlexGroup>
        </>
      )}
    />
  );
};
