/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React from 'react';
import { render } from '@kbn/react-kibana-mount';
import { AppMountParameters } from '@kbn/core/public';
import { ManagementApp, ManagementAppDependencies } from './components/management_app';

export const renderApp = async (
  { history, appBasePath, element, theme$ }: AppMountParameters,
  dependencies: ManagementAppDependencies
) => {
  const unmount = render(<ManagementApp {...{ history, appBasePath, theme$, dependencies }} />, element);

  return unmount;
};
