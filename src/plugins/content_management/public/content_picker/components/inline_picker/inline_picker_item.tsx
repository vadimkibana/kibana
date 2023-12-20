import * as React from 'react';
import {ItemViewListItem} from '../../../item_views/list_item';
import type {ContentId} from '../../types';
import {useContentPicker} from '../../context/state';
import {compareId} from '../../utils';

export interface InlinePickerItemProps {
  id: ContentId;
}

export const InlinePickerItem: React.FC<InlinePickerItemProps> = ({id}) => {
  const {state} = useContentPicker();
  const selected = state.useSelected();

  const handleClick = () => {
    state.select(id);
  };

  return (
    <ItemViewListItem id={id} isActive={compareId(id, selected)} onClick={handleClick} />
  );
};
