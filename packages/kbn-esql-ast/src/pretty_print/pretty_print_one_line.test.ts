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

  // console.log(JSON.stringify(ast, null, 2));

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

describe('expressions', () => {
  describe('source expressions', () => {
    test('simple source expression', () => {
      const { text } = reprint('from source');

      expect(text).toBe('FROM source');
    });

    test('sources with dots', () => {
      const { text } = reprint('FROM a.b.c');

      expect(text).toBe('FROM a.b.c');
    });

    test('sources with slashes', () => {
      const { text } = reprint('FROM a/b/c');

      expect(text).toBe('FROM a/b/c');
    });

    test('cluster source', () => {
      const { text } = reprint('FROM cluster:index');

      expect(text).toBe('FROM cluster:index');
    });

    test('quoted source', () => {
      const { text } = reprint('FROM "quoted"');

      expect(text).toBe('FROM quoted');
    });

    test('triple-quoted source', () => {
      const { text } = reprint('FROM """quoted"""');

      expect(text).toBe('FROM quoted');
    });
  });

  describe('column expressions', () => {
    test('simple columns expressions', () => {
      const { text } = reprint('FROM a METADATA column1, _column2');

      expect(text).toBe('FROM a METADATA column1, _column2');
    });

    test('nested fields', () => {
      const { text } = reprint('FROM a | KEEP a.b');

      expect(text).toBe('FROM a | KEEP a.b');
    });

    // Un-skip when "IdentifierPattern" is parsed correctly.
    test.skip('quoted nested fields', () => {
      const { text } = reprint('FROM index | KEEP `a`.`b`, c.`d`');

      expect(text).toBe('FROM index | KEEP a.b, c.d');
    });

    // Un-skip when identifier names are escaped correctly.
    test.skip('special character in identifier', () => {
      const { text } = reprint('FROM a | KEEP `a 👉 b`, a.`✅`');

      expect(text).toBe('FROM a | KEEP `a 👉 b`, a.`✅`');
    });
  });

  describe('"function" expressions', () => {
    describe('function call expression', () => {
      test('no argument function', () => {
        const { text } = reprint('ROW fn()');

        expect(text).toBe('ROW FN()');
      });

      test('functions with arguments', () => {
        const { text } = reprint('ROW gg(1), wp(1, 2, 3)');

        expect(text).toBe('ROW GG(1), WP(1, 2, 3)');
      });

      test('functions with star argument', () => {
        const { text } = reprint('ROW f(*)');

        expect(text).toBe('ROW F(*)');
      });
    });

    describe('unary expression', () => {
      test('NOT expression', () => {
        const { text } = reprint('ROW NOT a');

        expect(text).toBe('ROW NOT a');
      });
    });

    describe('postfix unary expression', () => {
      test('NOT expression', () => {
        const { text } = reprint('ROW a IS NOT NULL');

        expect(text).toBe('ROW a IS NOT NULL');
      });
    });

    describe('binary expression expression', () => {
      test('NOT expression', () => {
        const { text } = reprint('ROW 1 + 2');

        expect(text).toBe('ROW 1 + 2');
      });
    });
  });
});
