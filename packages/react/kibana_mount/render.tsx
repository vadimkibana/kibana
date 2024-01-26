/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import * as React from 'react';
import * as ReactDOM from 'react-dom';

export const render = (node: React.ReactNode, element: HTMLElement): (() => void) => {
  const wrappedNode = (
    <>
      {node}
    </>
  );

  /**
   * @todo Use `ReactDOM.createRoot()` once React is upgraded to v18+.
   */
  ReactDOM.render(wrappedNode, element);

  const unmount = () => ReactDOM.unmountComponentAtNode(element);

  return unmount;
};
