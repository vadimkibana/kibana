/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { EsqlQuery } from '../../query';
import { ESQLAstQueryExpression } from '../../types';
import { Walker } from '../../walker';

const removeParserFields = (tree: ESQLAstQueryExpression): void => {
  Walker.walk(tree, {
    visitAny: (node) => {
      delete (node as any).text;
      delete (node as any).location;
      delete (node as any).incomplete;
    },
  });
};

const assertSameAst = (src1: string, src2: string) => {
  const { ast: ast1 } = EsqlQuery.fromSrc(src1);
  const { ast: ast2 } = EsqlQuery.fromSrc(src2);

  removeParserFields(ast1);
  removeParserFields(ast2);

  expect(ast1).toEqual(ast2);
};

const assertDifferentAst = (src1: string, src2: string) => {
  expect(() => assertSameAst(src1, src2)).toThrow();
};

describe('binary operator precedence', () => {
  it('AND has higher precedence than OR', () => {
    assertSameAst('FROM a | WHERE a AND b OR c', 'FROM a | WHERE (a AND b) OR c');
    assertSameAst('FROM a | WHERE a OR b OR c', 'FROM a | WHERE (a OR b) OR c');
    assertSameAst('FROM a | WHERE a AND b AND c', 'FROM a | WHERE (a AND b) AND c');
    assertDifferentAst('FROM a | WHERE a OR b AND c', 'FROM a | WHERE (a OR b) AND c');
  });

  it('LIKE (regex) has higher precedence than AND', () => {
    assertSameAst('FROM a | WHERE a LIKE "b" OR c', 'FROM a | WHERE (a LIKE "b") OR c');
    assertDifferentAst('FROM a | WHERE a AND b LIKE "c"', 'FROM a | WHERE (a AND b) LIKE "c"');
  });

  it('LIKE has higher precedence than RLIKE', () => {
    assertSameAst('FROM a | WHERE a RLIKE b LIKE "c"', 'FROM a | WHERE a RLIKE (b LIKE "c")');
    assertSameAst('FROM a | WHERE a LIKE b RLIKE "c"', 'FROM a | WHERE a LIKE (b RLIKE "c")');
    // assertDifferentAst('FROM a | WHERE a AND b LIKE "c"', 'FROM a | WHERE (a AND b) LIKE "c"');
  });
});
