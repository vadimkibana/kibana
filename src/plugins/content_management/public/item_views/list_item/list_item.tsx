import * as React from 'react';
import {EuiListGroupItem} from '@elastic/eui';
import {useItem} from '../../content_picker/hooks/use_item';
import type {ContentId} from '../../content_picker/types';

export interface Props {
  id: ContentId;
}

export const ListItem: React.FC<Props> = ({id}) => {
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
