/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { parse } from '../../parser';
import { BasicPrettyPrinter } from '../basic_pretty_printer';

const reprint = (src: string) => {
  const { ast } = parse(src, { withFormatting: true });
  const text = BasicPrettyPrinter.print(ast);

  // console.log(JSON.stringify(ast, null, 2));

  return { text };
};

test('can print source left comment', () => {
  const { text } = reprint('FROM /* cmt */ expr');

  expect(text).toBe('FROM /* cmt */ expr');
});

test('can print source right comment', () => {
  const { text } = reprint('FROM expr /* cmt */');

  expect(text).toBe('FROM expr /* cmt */');
});

test('can print source right comment with comma separating from next source', () => {
  const { text } = reprint('FROM expr /* cmt */, expr2');

  expect(text).toBe('FROM expr /* cmt */, expr2');
});

test('can print source left and right comments', () => {
  const { text } = reprint(
    'FROM /*a*/ /* b */ index1 /* c */, /* d */ index2 /* e */ /* f */, /* g */ index3'
  );

  expect(text).toBe(
    'FROM /*a*/ /* b */ index1 /* c */, /* d */ index2 /* e */ /* f */, /* g */ index3'
  );
});
