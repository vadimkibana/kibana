/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * @category Visitor Real-world Scenarios
 *
 * This test suite contains real-world scenarios that demonstrate how to use the
 * visitor to traverse the AST and make changes to it, or how to extract useful
 */

import { getAstAndSyntaxErrors } from '../../ast_parser';
import { Visitor } from '../visitor';

test('change LIMIT from 24 to 42', () => {
  const { ast } = getAstAndSyntaxErrors(`
    FROM index
      | STATS 1, "str", [true], a = b BY field
      | LIMIT 24
  `);

  // Find the LIMIT node
  const limit = () =>
    new Visitor()
      .on('visitLimitCommand', (ctx) => ctx.numeric())
      .on('visitCommand', () => null)
      .on('visitQuery', (ctx) => [...ctx.visitCommands()])
      .visitQuery(ast)
      .filter(Boolean)[0];

  expect(limit()).toBe(24);

  // Change LIMIT to 42
  new Visitor()
    .on('visitLimitCommand', (ctx) => {
      ctx.setLimit(42);
    })
    .on('visitCommand', () => {})
    .on('visitQuery', (ctx) => [...ctx.visitCommands()])
    .visitQuery(ast);

  expect(limit()).toBe(42);
});
