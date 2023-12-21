import * as React from 'react';
import {EuiCard, EuiIcon, EuiSpacer} from '@elastic/eui';
import {useItem} from '../../content_picker/hooks/use_item';
import {ItemViewBaseProps} from '../types';

export interface ItemViewThumbnailProps extends ItemViewBaseProps {}

export const ItemViewThumbnail: React.FC<ItemViewThumbnailProps> = ({id, isActive, onClick}) => {
  const item = useItem(id);
  const title = item.useTitle();

  return (
    <EuiCard
      textAlign="left"
      titleSize='xs'
      paddingSize="l"
      hasBorder
      onClick={onClick}
      style={{width: 200, height: 200, cursor: 'pointer', outline: isActive ? '2px solid #006BB4' : undefined}}
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
    />
  );
};
