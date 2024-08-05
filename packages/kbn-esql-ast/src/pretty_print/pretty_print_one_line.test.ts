/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { getAstAndSyntaxErrors } from '../ast_parser';
import { prettyPrintOneLine } from './pretty_print_one_line';

const reprint = (src: string) => {
  const { ast } = getAstAndSyntaxErrors(src);
  const text = prettyPrintOneLine(ast);

  return { text };
};

describe('commands', () => {
  describe('FROM', () => {
    test('FROM command with a single source', () => {
      const { text } = reprint('FROM index1');

      expect(text).toBe('FROM index1');
    });

    test('FROM command with multiple indices', () => {
      const { text } = reprint('from index1, index2, index3');

      expect(text).toBe('FROM index1, index2, index3');
    });

    test('FROM command with METADATA', () => {
      const { text } = reprint('FROM index1, index2 METADATA field1, field2');

      expect(text).toBe('FROM index1, index2 METADATA field1, field2');
    });
  });
});
