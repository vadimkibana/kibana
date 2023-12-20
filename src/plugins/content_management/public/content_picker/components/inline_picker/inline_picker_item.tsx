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

  const isActive = selected.some((selectedId) => compareId(id, selectedId));

  const handleClick = () => {
    state.select(id);
  };

  return (
    <ItemViewListItem id={id} isActive={isActive} onClick={handleClick} />
  );
};
