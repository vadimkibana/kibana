import * as React from 'react';
import {ContentPickerStateProvider} from '../../context/state';
import type {PickerProps} from '../types';

export const InlinePicker: React.FC<PickerProps> = (props) => {
  return (
    <ContentPickerStateProvider props={props}>
      <div>Inline Picker</div>
    </ContentPickerStateProvider>
  );
};
