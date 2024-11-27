/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { synth } from '../../..';
import { SynthNode } from '../helpers';

test('synthesized nodes have SynthNodePrototype prototype', () => {
  const expression = synth.expr`?my_param`;
  const command = synth.cmd`LIMIT 123`;

  expect(expression).toBeInstanceOf(SynthNode);
  expect(command).toBeInstanceOf(SynthNode);
});

test('can cast expression to string', () => {
  const expression = synth.expr`?my_param`;

  expect(expression).toMatchObject({
    type: 'literal',
    literalType: 'param',
    paramType: 'named',
    value: 'my_param',
  });
  expect(String(expression)).toBe('?my_param');
});
