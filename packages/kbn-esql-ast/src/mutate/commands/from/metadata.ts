/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { ESQLAstQueryExpression, ESQLColumn, ESQLCommandOption } from '../../../types';
import { Visitor } from '../../../visitor';
import { cmpArr, findByPredicate } from '../../util';
import * as generic from '../../generic';
import { Builder } from '../../../builder';
import type { Predicate } from '../../types';

/**
 * Returns all metadata field AST node and their parent command option nodes.
 *
 * @param ast The root AST node to search for metadata fields.
 * @returns A collection of [column, option] pairs for each metadata field found.
 */
export const list = (
  ast: ESQLAstQueryExpression
): IterableIterator<[ESQLColumn, ESQLCommandOption]> => {
  type ReturnExpression = IterableIterator<ESQLColumn>;
  type ReturnCommand = IterableIterator<[ESQLColumn, ESQLCommandOption]>;

  return new Visitor()
    .on('visitExpression', function* (): ReturnExpression {})
    .on('visitColumnExpression', function* (ctx): ReturnExpression {
      yield ctx.node;
    })
    .on('visitCommandOption', function* (ctx): ReturnCommand {
      if (ctx.node.name !== 'metadata') {
        return;
      }
      for (const args of ctx.visitArguments()) {
        for (const column of args) {
          yield [column, ctx.node];
        }
      }
    })
    .on('visitFromCommand', function* (ctx): ReturnCommand {
      for (const options of ctx.visitOptions()) {
        yield* options;
      }
    })
    .on('visitCommand', function* (): ReturnCommand {})
    .on('visitQuery', function* (ctx): ReturnCommand {
      for (const command of ctx.visitCommands()) {
        yield* command;
      }
    })
    .visitQuery(ast);
};

export const find = (
  ast: ESQLAstQueryExpression,
  parts: string | string[]
): [ESQLColumn, ESQLCommandOption] | undefined => {
  if (typeof parts === 'string') {
    parts = [parts];
  }

  const predicate: Predicate<[ESQLColumn, unknown]> = ([field]) =>
    cmpArr(field.parts, parts as string[]);

  return findByPredicate(list(ast), predicate);
};

export const removeByPredicate = (
  ast: ESQLAstQueryExpression,
  predicate: Predicate<ESQLColumn>
): [column: ESQLColumn, option: ESQLCommandOption] | undefined => {
  const tuple = findByPredicate(list(ast), ([field]) => predicate(field));

  if (!tuple) {
    return;
  }

  const [column, option] = tuple;
  const index = option.args.indexOf(column);

  if (index === -1) {
    return;
  }

  option.args.splice(index, 1);

  if (option.args.length === 0) {
    generic.removeCommandOption(ast, option);
  }

  return tuple;
};

export const remove = (
  ast: ESQLAstQueryExpression,
  fieldName: string | string[]
): [column: ESQLColumn, option: ESQLCommandOption] | undefined => {
  if (typeof fieldName === 'string') {
    fieldName = [fieldName];
  }

  return removeByPredicate(ast, (field) => cmpArr(field.parts, fieldName as string[]));
};

export const add = (
  ast: ESQLAstQueryExpression,
  fieldName: string | string[],
  index: number = -1
): ESQLColumn | undefined => {
  // TODO: first check if the field already exists
  // TODO: handle case when "FROM" command does not exist

  const option = generic.findCommandOptionByName(ast, 'from', 'metadata');

  if (!option) {
    return;
  }

  const parts: string[] = typeof fieldName === 'string' ? [fieldName] : fieldName;
  const column = Builder.expression.column({ parts });

  if (index === -1) {
    option.args.push(column);
  } else {
    option.args.splice(index, 0, column);
  }

  return column;
};
