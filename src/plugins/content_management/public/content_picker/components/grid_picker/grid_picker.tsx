import * as React from 'react';
import {ContentPickerStateProvider} from '../../context/state';
import {GridPickerConnected} from './grid_picker_connected';
import type {PickerProps} from '../types';

export const GridPicker: React.FC<PickerProps> = (props) => {
  return (
    <ContentPickerStateProvider props={{...props, pickOnSelect: true}}>
      <GridPickerConnected />
    </ContentPickerStateProvider>
  );
};
