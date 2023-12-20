import * as React from 'react';
import {ItemViewListItem} from '../../../item_views/list_item';
import {useContentPicker} from '../../context/state';
import {compareId} from '../../utils';
import type {ContentId} from '../../types';

export interface InlinePickerItemProps {
  id: ContentId;
}

export const InlinePickerItem: React.FC<InlinePickerItemProps> = ({id}) => {
  const {state} = useContentPicker();
  const selected = state.useSelected();

  const isSelected = selected.some((selectedId) => compareId(id, selectedId));

  const handleClick = () => {
    if (isSelected) {
      state.unselect(id);
    } else {
      state.select(id);
    }
  };

  return (
    <ItemViewListItem id={id} isActive={isSelected} onClick={handleClick} />
  );
};
