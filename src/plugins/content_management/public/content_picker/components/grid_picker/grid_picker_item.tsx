import * as React from 'react';
import {useContentPicker} from '../../context/state';
import {compareId} from '../../utils';
import type {ContentId} from '../../types';
import {ItemViewThumbnail} from '../../../item_views/thumbnail';

export interface GridPickerItemProps {
  id: ContentId;
}

export const GridPickerItem: React.FC<GridPickerItemProps> = ({id}) => {
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
    <div style={{width: 200, height: 200}}>
      <ItemViewThumbnail id={id} isActive={isSelected} onClick={handleClick} />
    </div>
  );
};
