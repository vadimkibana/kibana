/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import {EuiFieldText, EuiForm, EuiFormRow} from '@elastic/eui';
import * as React from 'react';
import { useConnectionDetails } from '../../context';

export const ApiKeysTab: React.FC = () => {
  const { endpoints } = useConnectionDetails();

  if (!endpoints) return null;

  return (
    <EuiForm component="form">
      <EuiFormRow label="Text field" helpText="I am some friendly help text.">
        <EuiFieldText name="first" />
      </EuiFormRow>
    </EuiForm>
  );
};
