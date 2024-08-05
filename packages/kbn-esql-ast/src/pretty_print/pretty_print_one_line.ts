/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { ESQLAstQueryNode, Visitor } from '../visitor';

export const prettyPrintOneLine = (query: ESQLAstQueryNode) => {
  const visitor = new Visitor()
    .on('visitSourceExpression', (ctx) => {
      return ctx.node.name;
    })
    .on('visitColumnExpression', (ctx) => {
      return ctx.node.name;
    })
    .on('visitFunctionCallExpression', (ctx) => {
      let args = '';
      for (const arg of ctx.visitArguments()) {
        args += (args ? ', ' : '') + arg;
      }
      return `${ctx.node.name.toUpperCase()}${args ? `(${args})` : ''}`;
    })
    .on('visitLiteralExpression', (ctx) => {
      return ctx.node.value;
    })
    .on('visitListLiteralExpression', (ctx) => {
      return '<LIST>';
    })
    .on('visitTimeIntervalLiteralExpression', (ctx) => {
      return '<TIME_INTERVAL>';
    })
    .on('visitInlineCastExpression', (ctx) => {
      return '<CAST>';
    })
    .on('visitExpression', (ctx) => {
      return '<EXPRESSION>';
    })
    .on('visitCommandOption', (ctx) => {
      let args = '';
      for (const arg of ctx.visitArguments()) {
        args += (args ? ', ' : '') + arg;
      }
      return ctx.node.name.toUpperCase() + (args ? ` ${args}` : '');
    })
    .on('visitCommand', (ctx) => {
      const cmd = ctx.node.name.toUpperCase();
      let args = '';
      let options = '';
      for (const source of ctx.visitArguments()) {
        args += (args ? ', ' : '') + source;
      }
      for (const option of ctx.visitOptions()) {
        options += (options ? ' ' : '') + option;
      }
      const argsFormatted = args ? ` ${args}` : '';
      const optionsFormatted = options ? ` ${options}` : '';
      return `${cmd}${argsFormatted}${optionsFormatted}`;
    })
    .on('visitQuery', (ctx) => {
      let text = '';
      for (const cmd of ctx.visitCommands()) {
        text += (text ? ' | ' : '') + cmd;
      }
      return text;
    });

  return visitor.visitQuery(query);
};
