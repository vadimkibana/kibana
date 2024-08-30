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

const assertPrint = (src: string, expected: string = src) => {
  const { text } = reprint(src);

  expect(text).toBe(expected);
};

describe('source expression', () => {
  test('can print source left comment', () => {
    assertPrint('FROM /* cmt */ expr');
  });

  test('can print source right comment', () => {
    assertPrint('FROM expr /* cmt */');
  });

  test('can print source right comment with comma separating from next source', () => {
    assertPrint('FROM expr /* cmt */, expr2');
  });

  test('can print source left and right comments', () => {
    assertPrint(
      'FROM /*a*/ /* b */ index1 /* c */, /* d */ index2 /* e */ /* f */, /* g */ index3'
    );
  });
});

describe('source column expression', () => {
  test('can print source left comment', () => {
    assertPrint('FROM a | STATS /* cmt */ col');
  });

  test('can print column right comment', () => {
    assertPrint('FROM a | STATS col /* cmt */');
  });

  test('can print column left and right comments', () => {
    assertPrint(
      'FROM a | STATS /*a*/ /* b */ col /* c */ /* d */, /* e */ col2 /* f */, col3 /* comment3 */, col4'
    );
  });
});

describe('literal expression', () => {
  test('can print source left comment', () => {
    assertPrint('FROM a | STATS /* cmt */ 1');
  });

  test('can print column right comment', () => {
    assertPrint('FROM a | STATS "str" /* cmt */');
  });

  test('can print column left and right comments', () => {
    assertPrint(
      'FROM a | STATS /*a*/ /* b */ TRUE /* c */ /* d */, /* e */ 1.1 /* f */, FALSE /* comment3 */, NULL'
    );
  });
});
