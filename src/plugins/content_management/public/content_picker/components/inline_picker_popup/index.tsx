import * as React from 'react';
import { EuiPopover, EuiButtonEmpty, EuiText } from '@elastic/eui';
import type {PickerProps} from '../types';
import {InlinePicker} from '../inline_picker/inline_picker';

export const InlinePickerPopup: React.FC<PickerProps> = (props) => {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  const onButtonClick = () =>
    setIsPopoverOpen((isPopoverOpen) => !isPopoverOpen);
  const closePopover = () => setIsPopoverOpen(false);

  const button = (
    <EuiButtonEmpty
      iconType="search"
      iconSide="left"
      onClick={onButtonClick}
    >
      Select content
    </EuiButtonEmpty>
  );

  return (
    <EuiPopover
      button={button}
      isOpen={isPopoverOpen}
      closePopover={closePopover}
    >
      <InlinePicker {...props} />
    </EuiPopover>
  );
};