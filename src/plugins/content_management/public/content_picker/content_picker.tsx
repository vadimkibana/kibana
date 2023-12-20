import * as React from 'react';
import {InlinePicker} from './components/inline_picker';
import type {PickerProps} from './components/types';

export const ContentPicker: React.FC<PickerProps> = (props) => {
  return (
    <InlinePicker key={props.types.join(',')} {...props} />
  );
};
