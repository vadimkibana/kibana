/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import * as React from 'react';
import ReactDOM from 'react-dom';
import { getStartDeps as start } from '@kbn/react-kibana-context-common';
import * as conn from './kibana_connection_details_provider';
import { ConnectionDetailsFlyoutContent } from '../connection_details_flyout_content';

export interface OpenConnectionDetailsParams {
  props: conn.KibanaConnectionDetailsProviderProps;
}

export const openConnectionDetails = async ({ props }: OpenConnectionDetailsParams) => {
  const mount = (element: HTMLElement) => {
    const reactElement = (
      <conn.KibanaConnectionDetailsProvider {...props}>
        <ConnectionDetailsFlyoutContent />
      </conn.KibanaConnectionDetailsProvider>
    );
    ReactDOM.render(reactElement, element);

    return () => ReactDOM.unmountComponentAtNode(element);
  };
  const flyoutRef = start().core.overlays.openFlyout(mount, { size: 's' });

  return flyoutRef;
};
