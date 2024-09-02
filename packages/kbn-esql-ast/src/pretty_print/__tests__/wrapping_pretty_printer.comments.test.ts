/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { parse } from '../../parser';
import { WrappingPrettyPrinter, WrappingPrettyPrinterOptions } from '../wrapping_pretty_printer';

const reprint = (src: string, opts?: WrappingPrettyPrinterOptions) => {
  const { root } = parse(src, { withFormatting: true });
  const text = WrappingPrettyPrinter.print(root, opts);

  // console.log(JSON.stringify(ast, null, 2));

  return { text };
};

describe('top comments', () => {
  test('preserves single command top comment', () => {
    const query = `
//comment
FROM index
`;
    const text = reprint(query).text;

    expect('\n' + text).toBe(`
//comment
FROM index`);
  });
});
