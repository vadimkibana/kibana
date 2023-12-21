import * as React from 'react';
import type {PickerProps} from '../types';
import {InlinePicker} from '../inline_picker/inline_picker';
import {EuiCard} from '@elastic/eui';

export const InlinePickerBox: React.FC<PickerProps> = (props) => {
  return (
    <div style={{maxWidth: 400}}>
      <EuiCard title={''} hasBorder>
        <InlinePicker {...props} />
      </EuiCard>
    </div>
  );
};
