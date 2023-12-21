/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import * as React from 'react';
import { PickerExample } from './picker_example';
import { EuiComboBox, EuiComboBoxProps, EuiSpacer } from '@elastic/eui';

const defaultType = { label: 'Dashboard', value: 'dashboard' };

export const PickerApp: React.FC = () => {
  const [types, setTypes] = React.useState<EuiComboBoxProps<any>['selectedOptions']>([defaultType]);

  return (
    <div>
      <EuiComboBox
        placeholder="Select content types"
        options={[
          { label: 'Dashboard', value: 'dashboard' },
          { label: 'Visualization', value: 'visualization' },
        ]}
        selectedOptions={types}
        onChange={(newTypes) => (newTypes.length ? setTypes(newTypes) : setTypes([defaultType]))}
        isClearable={true}
      />
      <EuiSpacer size={'s'} />
      <PickerExample title={'Inline box'} types={types!.map((t) => t.value!)} />
      <PickerExample title={'Popup'} types={types!.map((t) => t.value!)} />
    </div>
  );
};
