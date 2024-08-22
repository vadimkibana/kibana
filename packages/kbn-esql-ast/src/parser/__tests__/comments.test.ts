/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { parse } from '..';

describe('Comments', () => {
  it('can be a command argument', () => {
    const text = `
FROM /* a */ kibana_ecommerce_data /*

multi

line

*/ // Best source evah
b, // b
c //c
| EVAL field::string
// another comment
// another comment

`;
    const { ast } = parse(text, { withComments: true });

    console.log(JSON.stringify(ast, null, 2));
  });
});
