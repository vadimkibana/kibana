/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { type CommonTokenStream, Token } from 'antlr4';
import { Builder } from '../builder';
import { ESQLAstQueryNode, Visitor } from '../visitor';
import type { ESQLAstComment, ESQLAstNodeComments, ESQLProperNode } from '../types';
import type {
  ParsedFormattingCommentDecoration,
  ParsedFormattingDecoration,
  ParsedFormattingDecorationLines,
} from './types';

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
export const collectDecorations = (
  tokens: CommonTokenStream
): { comments: ESQLAstComment[]; lines: ParsedFormattingDecorationLines } => {
  const comments: ESQLAstComment[] = [];
  const list = tokens.tokens;
  const lines: ParsedFormattingDecorationLines = [];

  let line: ParsedFormattingDecoration[] = [];
  let pos = 0;
  let hasContentToLeft = false;

  for (const token of list) {
    const { channel, text } = token;
    const min = pos;
    const max = min + text.length;

    pos = max;

    const isContentToken = channel !== HIDDEN_CHANNEL;

    if (isContentToken) {
      hasContentToLeft = true;
      for (const decoration of line) {
        if (decoration.type === 'comment') {
          decoration.hasContentToRight = true;
        }
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
    const comment: ParsedFormattingCommentDecoration = {
      type: 'comment',
      hasContentToLeft,
      hasContentToRight: false,
      node,
    };

    comments.push(comment.node);
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

  return { comments, lines };
};

const findNodeAtOrAfter = (ast: ESQLAstQueryNode, pos: number): ESQLProperNode | null => {
  return new Visitor()
    .on('visitExpression', (ctx): ESQLProperNode | null => {
      for (const node of ctx.arguments()) {
        const { location } = node;
        if (!location) continue;
        const isBefore = location.min > pos;
        if (isBefore) return node;
        const isInside = location.min <= pos && location.max >= pos;
        if (isInside) return ctx.visitExpression(node, undefined);
      }
      return null;
    })
    .on('visitCommand', (ctx): ESQLProperNode | null => {
      for (const node of ctx.arguments()) {
        const { location } = node;
        if (!location) continue;
        const isBefore = location.min > pos;
        if (isBefore) return node;
        const isInside = location.min <= pos && location.max >= pos;
        if (isInside) return ctx.visitExpression(node);
      }
      return null;
    })
    .on('visitQuery', (ctx): ESQLProperNode | null => {
      for (const node of ctx.commands()) {
        const { location } = node;
        if (!location) continue;
        const isBefore = location.min > pos;
        if (isBefore) return node;
        const isInside = location.min <= pos && location.max >= pos;
        if (isInside) return ctx.visitCommand(node);
      }
      return null;
    })
    .visitQuery(ast);
};

const attachTop = (node: ESQLProperNode, comment: ESQLAstComment) => {
  const comments: ESQLAstNodeComments = node.comments || (node.comments = {});
  const list = comments.top || (comments.top = []);
  list.push(comment);
};

const attachCommentDecoration = (
  ast: ESQLAstQueryNode,
  comment: ParsedFormattingCommentDecoration
) => {
  const node = findNodeAtOrAfter(ast, comment.node.location.max);

  if (!node) return;

  const isBefore = node.location.min > comment.node.location.min;
  if (isBefore) attachTop(node, comment.node);
};

/**
 * Walks through the ast and for each comment attaches it to the appropriate
 * node, which is determined by the comment's alignment.
 *
 * @param ast AST to attach comments to.
 * @param comments List of comments to attach to the AST.
 */
export const attachDecorations = (
  ast: ESQLAstQueryNode,
  lines: ParsedFormattingDecorationLines
) => {
  for (const line of lines) {
    for (const decoration of line) {
      switch (decoration.type) {
        case 'comment': {
          attachCommentDecoration(ast, decoration);
          break;
        }
      }
    }
  }
};
