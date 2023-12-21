import * as React from 'react';
import {ContentPickerStateProvider} from '../../context/state';
import {InlinePickerConnected} from './inline_picker_connected';
import type {PickerProps} from '../types';

export const InlinePicker: React.FC<PickerProps> = (props) => {
  return (
    <ContentPickerStateProvider props={{...props, pickOnSelect: true}}>
      <InlinePickerConnected />
    </ContentPickerStateProvider>
  );
};
