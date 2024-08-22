/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { type CommonTokenStream, Token } from 'antlr4';
import type { ESQLAstComment } from '../types';
import { Builder } from '../builder';

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

export const collectComments = (tokens: CommonTokenStream): { comments: ESQLAstComment[] } => {
  const comments: ESQLAstComment[] = [];
  const list = tokens.tokens;
  let pos = 0;

  for (const token of list) {
    const { channel, text } = token;
    const min = pos;
    const max = min + text.length;

    pos = max;

    if (channel !== HIDDEN_CHANNEL) continue;

    const subtype = commentSubtype(text);
    if (!subtype) continue;

    const cleanText =
      subtype === 'single-line' ? trimRightNewline(text.slice(2)) : text.slice(2, -2);
    const comment = Builder.comment(subtype, cleanText, { min, max });
    comments.push(comment);
  }

  return { comments };
};
