import * as React from 'react';
import { EuiModal, EuiModalHeader, EuiModalHeaderTitle, EuiButton, EuiModalFooter, EuiModalBody, EuiButtonEmpty } from '@elastic/eui';
import type {PickerProps} from '../types';
import {GridPicker} from '../grid_picker/grid_picker';

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
    <EuiModal onClose={() => setOpen(false)} maxWidth={2000}>
      <EuiModalHeader>
        <EuiModalHeaderTitle>Select content</EuiModalHeaderTitle>
      </EuiModalHeader>
      <EuiModalBody>
        <div style={{width: '80vw', height: '70vh'}}>
          <GridPicker {...props} />
        </div>
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