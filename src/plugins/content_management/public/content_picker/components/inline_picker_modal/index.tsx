import * as React from 'react';
import { EuiModal, EuiModalHeader, EuiModalHeaderTitle, EuiButton, EuiModalFooter, EuiModalBody, EuiButtonEmpty } from '@elastic/eui';
import type {PickerProps} from '../types';
import {InlinePicker} from '../inline_picker/inline_picker';

export const InlinePickerModal: React.FC<PickerProps> = (props) => {
  const [open, setOpen] = React.useState(false);

  const button = (
    <EuiButtonEmpty
      iconType="search"
      iconSide="left"
      onClick={() => setOpen(true)}
    >
      Select content
    </EuiButtonEmpty>
  );

  const modal = open ? (
    <EuiModal onClose={() => setOpen(false)}>
      <EuiModalHeader>
        <EuiModalHeaderTitle>Select content</EuiModalHeaderTitle>
      </EuiModalHeader>
      <EuiModalBody>
        <InlinePicker {...props} />
      </EuiModalBody>
      <EuiModalFooter>
        <EuiButton type="submit" onClick={() => setOpen(false)} fill>
          Select
        </EuiButton>
      </EuiModalFooter>
    </EuiModal>
  ) : null;

  return (
    <>
      <div style={{display: 'inline-block'}}>
        {button}
      </div>
      {modal}
    </>
  );
};