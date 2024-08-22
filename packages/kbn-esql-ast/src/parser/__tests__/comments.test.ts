/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { parse } from '..';

describe('Comments', () => {
  it('can attach "top" comment to a command', () => {
    const text = `
      FROM abc

      // Good limit
      | LIMIT 10`;
    const { ast } = parse(text, { withComments: true });

    expect(ast).toMatchObject([
      {},
      {
        type: 'command',
        name: 'limit',
        comments: {
          top: [
            {
              type: 'comment',
              subtype: 'single-line',
              text: ' Good limit',
            },
          ],
        },
      },
    ]);
  });

  it('can attach "top" comment to an expression', () => {
    const text = `
      FROM

      // "abc" is the best source
      abc`;
    const { ast } = parse(text, { withComments: true });

    console.log(JSON.stringify(ast, null, 2));

    expect(ast).toMatchObject([
      {
        type: 'command',
        name: 'from',
        args: [
          {
            type: 'source',
            comments: {
              top: [
                {
                  type: 'comment',
                  subtype: 'single-line',
                  text: ' "abc" is the best source',
                },
              ],
            },
          },
        ],
      },
    ]);
  });
});
