/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { EsqlQuery } from '../../query';
import { walk } from '../walker';

describe('traversal order', () => {
  test('by default walks in "forward" order', () => {
    const { ast } = EsqlQuery.fromSrc('FROM a, b, c');
    const sources: string[] = [];

    walk(ast, {
      visitSource: (src) => sources.push(src.name),
    });

    expect(sources).toStrictEqual(['a', 'b', 'c']);
  });

  test('can explicitly specify "forward" order', () => {
    const { ast } = EsqlQuery.fromSrc('FROM a, b, c');
    const sources: string[] = [];

    walk(ast, {
      visitSource: (src) => sources.push(src.name),
      order: 'forward',
    });

    expect(sources).toStrictEqual(['a', 'b', 'c']);
  });

  test('can walk sources in "backward" order', () => {
    const { ast } = EsqlQuery.fromSrc('FROM a, b, c');
    const sources: string[] = [];

    walk(ast, {
      visitSource: (src) => sources.push(src.name),
      order: 'backward',
    });

    expect(sources).toStrictEqual(['c', 'b', 'a']);
  });
});
