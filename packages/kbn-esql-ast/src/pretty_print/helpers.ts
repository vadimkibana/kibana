/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { ESQLAstQueryExpression } from '../types';
import { Walker } from '../walker';

/**
 * Returns true if the given AST has line breaking decoration. A line breaking
 * decoration is any decoration that requires a newline "\n" to be printed.
 *
 * @param ast The AST to check for line breaking comments.
 */
export const hasLineBreakingDecorations = (ast: ESQLAstQueryExpression): boolean =>
  !!Walker.find(ast, (node) => {
    const formatting = node.formatting;

    if (!formatting) {
      return false;
    }

    if (
      (!!formatting.top && formatting.top.length > 0) ||
      (!!formatting.bottom && formatting.bottom.length > 0) ||
      !!formatting.rightSingleLine
    ) {
      return true;
    }

    for (const decoration of [...(formatting.left ?? []), ...(formatting.right ?? [])]) {
      if (
        decoration.type === 'comment' &&
        decoration.subtype === 'multi-line' &&
        !decoration.text.includes('\n')
      ) {
        continue;
      }
      return true;
    }

    return false;
  });
