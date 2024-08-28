/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { type CommonTokenStream, Token } from 'antlr4';
import type { ESQLAstComment, ESQLAstNodeComments, ESQLProperNode } from '../types';
import { Builder } from '../builder';
import { ESQLAstQueryNode, Visitor } from '../visitor';

export interface ParsedComment {
  /**
   * Attachment is a guess of where the comment should be attached within the AST
   * with respect to the node it is commenting.
   */
  attachment: 'top' | 'bottom' | 'left' | 'right';
  hasContentToLeft: boolean;
  hasContentToRight: boolean;
  node: ESQLAstComment;
}

const HIDDEN_CHANNEL: number = +(Token as any).HIDDEN_CHANNEL;

const commentSubtype = (text: string): ESQLAstComment['subtype'] | undefined => {
  if (text[0] === '/') {
    if (text[1] === '/') {
      return 'single-line';
    }
    if (text[1] === '*') {
      const end = text.length - 1;
      if (text[end] === '/' && text[end - 1] === '*') {
        return 'multi-line';
      }
    }
  }
};

const trimRightNewline = (text: string): string => {
  const last = text.length - 1;
  if (text[last] === '\n') {
    return text.slice(0, last);
  }
  return text;
};

/**
 * Collects all comments from the token stream.
 * @param tokens Lexer token stream
 * @returns List of comments found in the token stream
 */
export const collectComments = (tokens: CommonTokenStream): { comments: ParsedComment[] } => {
  const comments: ParsedComment[] = [];
  const list = tokens.tokens;

  let pos = 0;
  const lines: ParsedComment[][] = [];
  let line: ParsedComment[] = [];
  let hasContentToLeft = false;

  for (const token of list) {
    const { channel, text } = token;
    const min = pos;
    const max = min + text.length;

    pos = max;

    const isContentToken = channel !== HIDDEN_CHANNEL;

    if (isContentToken) {
      hasContentToLeft = true;
      for (const comment of line) {
        comment.hasContentToRight = true;
      }
      continue;
    }

    const subtype = commentSubtype(text);
    const isComment = !!subtype;

    if (!isComment) {
      const hasLineBreak = text.lastIndexOf('\n') !== -1;

      if (hasLineBreak) {
        lines.push(line);
        line = [];
        hasContentToLeft = false;
      }
      continue;
    }

    const cleanText =
      subtype === 'single-line' ? trimRightNewline(text.slice(2)) : text.slice(2, -2);
    const node = Builder.comment(subtype, cleanText, { min, max });
    const attachment = 'top';
    const comment: ParsedComment = {
      attachment,
      hasContentToLeft,
      hasContentToRight: false,
      node,
    };

    comments.push(comment);
    line.push(comment);

    if (subtype === 'single-line') {
      const hasLineBreak = text[text.length - 1] === '\n';

      if (hasLineBreak) {
        lines.push(line);
        line = [];
        hasContentToLeft = false;
      }
    }
  }

  console.log(lines);
  console.log(comments);

  return { comments };
};

const attachTop = (node: ESQLProperNode, comment: ESQLAstComment) => {
  const comments: ESQLAstNodeComments = node.comments || (node.comments = {});
  const list = comments.top || (comments.top = []);
  list.push(comment);
};

const attachComment = (ast: ESQLAstQueryNode, comment: ParsedComment) => {
  new Visitor()
    .on('visitExpression', (ctx) => {
      for (const expression of ctx.arguments()) {
        const { location } = expression;
        if (!location) continue;
        if (location.min >= comment.node.location.max) {
          attachTop(expression, comment.node);
          break;
        } else if (location.max >= comment.node.location.min) {
          ctx.visitExpression(expression, undefined);
          break;
        }
      }
    })
    .on('visitCommand', (ctx) => {
      for (const expression of ctx.arguments()) {
        const { location } = expression;
        if (!location) continue;
        if (location.min >= comment.node.location.max) {
          attachTop(expression, comment.node);
          break;
        } else if (location.max >= comment.node.location.min) {
          ctx.visitExpression(expression);
          break;
        }
      }
    })
    .on('visitQuery', (ctx) => {
      for (const command of ctx.commands()) {
        const { location } = command;
        if (!location) continue;
        if (location.min >= comment.node.location.max) {
          attachTop(command, comment.node);
          break;
        } else if (location.max >= comment.node.location.min) {
          ctx.visitCommand(command);
          break;
        }
      }
    })
    .visitQuery(ast);
};

/**
 * Walks through the ast and for each comment attaches it to the appropriate
 * node, which is determined by the comment's alignment.
 *
 * @param ast AST to attach comments to.
 * @param comments List of comments to attach to the AST.
 */
export const attachComments = (ast: ESQLAstQueryNode, comments: ParsedComment[]) => {
  for (const comment of comments) {
    attachComment(ast, comment);
  }
};
