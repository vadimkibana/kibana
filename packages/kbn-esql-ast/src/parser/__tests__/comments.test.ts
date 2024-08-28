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
    const { ast } = parse(text, { withFormatting: true });

    expect(ast).toMatchObject([
      {},
      {
        type: 'command',
        name: 'limit',
        formatting: {
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
    const { ast } = parse(text, { withFormatting: true });

    expect(ast).toMatchObject([
      {
        type: 'command',
        name: 'from',
        args: [
          {
            type: 'source',
            formatting: {
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

  it('can attach "top" comment to a nested expression', () => {
    const text = `
      FROM a
        | STATS 1 +
          // 2 is the best number
          2`;
    const { ast } = parse(text, { withFormatting: true });

    expect(ast).toMatchObject([
      {},
      {
        type: 'command',
        name: 'stats',
        args: [
          {
            type: 'function',
            name: '+',
            args: [
              {
                type: 'literal',
                value: 1,
              },
              {
                type: 'literal',
                value: 2,
                formatting: {
                  top: [
                    {
                      type: 'comment',
                      subtype: 'single-line',
                      text: ' 2 is the best number',
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
    ]);
  });

  it('attaches comment at the end of the program to the last command node from the "bottom"', () => {
    const text = `
FROM a
| LIMIT 1
// the end
`;
    const { ast } = parse(text, { withFormatting: true });

    expect(ast).toMatchObject([
      {},
      {
        type: 'command',
        name: 'limit',
        formatting: {
          bottom: [
            {
              type: 'comment',
              subtype: 'single-line',
              text: ' the end',
            },
          ],
        },
      },
    ]);
  });
});
