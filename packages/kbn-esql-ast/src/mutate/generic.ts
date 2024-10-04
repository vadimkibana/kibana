/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { ESQLAstQueryExpression, ESQLCommand, ESQLCommandOption } from '../types';
import { Visitor } from '../visitor';
import { Predicate } from './types';

export const findCommand = (
  ast: ESQLAstQueryExpression,
  predicate: Predicate<ESQLCommand>
): ESQLCommand | undefined => {
  return new Visitor()
    .on('visitQuery', (ctx): ESQLCommand | undefined => {
      for (const cmd of ctx.commands()) {
        if (predicate(cmd)) {
          return cmd;
        }
      }

      return undefined;
    })
    .visitQuery(ast);
};

export const findCommandOption = (
  command: ESQLCommand,
  predicate: Predicate<ESQLCommandOption>
): ESQLCommandOption | undefined => {
  return new Visitor()
    .on('visitCommand', (ctx): ESQLCommandOption | undefined => {
      for (const opt of ctx.options()) {
        if (predicate(opt)) {
          return opt;
        }
      }

      return undefined;
    })
    .visitCommand(command);
};

export const findCommandOptionByName = (
  ast: ESQLAstQueryExpression,
  commandName: string,
  optionName: string
): ESQLCommandOption | undefined => {
  const command = findCommand(ast, (cmd) => cmd.name === commandName);

  if (!command) {
    return undefined;
  }

  return findCommandOption(command, (opt) => opt.name === optionName);
};

export const removeCommandOption = (
  ast: ESQLAstQueryExpression,
  option: ESQLCommandOption
): boolean => {
  return new Visitor()
    .on('visitCommandOption', (ctx): boolean => {
      return ctx.node === option;
    })
    .on('visitCommand', (ctx): boolean => {
      let target: undefined | ESQLCommandOption;

      for (const opt of ctx.options()) {
        if (opt === option) {
          target = opt;
          break;
        }
      }

      if (!target) {
        return false;
      }

      const index = ctx.node.args.indexOf(target);

      if (index === -1) {
        return false;
      }

      ctx.node.args.splice(index, 1);

      return true;
    })
    .on('visitQuery', (ctx): boolean => {
      for (const success of ctx.visitCommands()) {
        if (success) {
          return true;
        }
      }

      return false;
    })
    .visitQuery(ast);
};
