/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import type { Token } from 'antlr4';

export const isQuotedIdentifier = (text: string): boolean => {
  const firstChar = text[0];
  const lastChar = text[text.length - 1];

  return firstChar === '`' && lastChar === '`';
};

export const parseIdentifier = (text: string): string => {
  const isQuoted = isQuotedIdentifier(text);

  if (!isQuoted) {
    return text;
  }

  return text.slice(1, -1).replace(/``/g, '`');
};

export const regexUnquotedIdentifierPattern = /^([a-z\*_\@]{1})[a-z0-9_\*]*$/i;

export const formatIdentifier = (text: string): string => {
  if (regexUnquotedIdentifierPattern.test(text)) {
    return text;
  }

  return `\`${text.replace(/`/g, '``')}\``;
};

export const formatIdentifierParts = (parts: string[]): string =>
  parts.map(formatIdentifier).join('.');

export const getPosition = (
  token: Pick<Token, 'start' | 'stop'> | null,
  lastToken?: Pick<Token, 'stop'> | undefined
) => {
  if (!token || token.start < 0) {
    return { min: 0, max: 0 };
  }
  const endFirstToken = token.stop > -1 ? Math.max(token.stop + 1, token.start) : undefined;
  const endLastToken = lastToken?.stop;
  return {
    min: token.start,
    max: endLastToken ?? endFirstToken ?? Infinity,
  };
};
