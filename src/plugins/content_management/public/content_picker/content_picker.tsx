import * as React from 'react';
import {InlinePickerBox} from './components/inline_picker_box/index';
import {InlinePicker} from './components/inline_picker/inline_picker';
import type {PickerProps} from './components/types';
import {InlinePickerPopup} from './components/inline_picker_popup';

export interface ContentPickerProps extends PickerProps {
  picker?: 'inline' | 'box' | 'popup' | 'modal';
}

export const ContentPicker: React.FC<ContentPickerProps> = ({picker, ...props}) => {
  switch (picker) {
    case 'box':
      return <InlinePickerBox key={props.types.join(',')} {...props} />;
    case 'inline':
      return <InlinePicker key={props.types.join(',')} {...props} />;
    case 'popup':
      return <InlinePickerPopup key={props.types.join(',')} {...props} />;
    default:
      return <InlinePicker key={props.types.join(',')} {...props} />;
  }
};
