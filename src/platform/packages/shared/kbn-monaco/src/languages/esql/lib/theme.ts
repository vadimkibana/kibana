/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import type { UseEuiTheme } from '@elastic/eui';
import { monaco } from '../../../monaco_imports';

export const buildEsqlTheme = ({
  euiTheme,
  colorMode,
}: UseEuiTheme): monaco.editor.IStandaloneThemeData => {
  console.log('euiTheme', euiTheme);
  console.log('colorMode', colorMode);

  const { colors } = euiTheme;

  const rules: monaco.editor.IStandaloneThemeData['rules'] = [
    // --------------------------------------------------- strings & string-like

    { token: 'string', foreground: colors.textSuccess },
    { token: 'source', foreground: colors.textSuccess },

    // ------------------------------------------------------------------ params

    // All params
    { token: 'variable', foreground: colors.textSuccess },

    // Override for unnamed param "?"
    { token: 'variable.name.unnamed', foreground: colors.textSuccess, fontStyle: 'bold' },

    // Override for named param "?name"
    { token: 'variable.name.named', foreground: colors.textSuccess },

    // Override for positional param "?123"
    { token: 'variable.name.positional', foreground: colors.textSuccess },

    // --------------------------------------------------------------- functions

    { token: 'identifier.function', foreground: colors.primary },

    // --------------------------------------------------------------- operators

    // Named operators such as "AND", "OR", "NOT" etc.
    { token: 'keyword.operator', foreground: colors.primary },

    // ---------------------------------------------------------------- comments

    // All comments, single line "// asdf" and multi line "/* asdf */"
    { token: 'comment', foreground: colors.textSubdued },
  ];

  // ------------------------------------------------------------------ commands

  // All commands. (Below is an override for *source* commands).
  rules.push({
    token: 'keyword.command',
    foreground: colors.accent,
    fontStyle: 'bold',
  });

  // Source commands
  const sourceCommands = ['from', 'row', 'explain', 'show', 'ts'];

  for (const command of sourceCommands) {
    rules.push({
      token: `keyword.command.${command}.esql`,
      foreground: colors.primary,
      fontStyle: 'bold',
    });
  }

  const borderColor = colors.lightestShade || colors.borderBasePlain;
  const bgColor = colors.emptyShade || colors.backgroundBasePlain;

  return {
    base: colorMode === 'DARK' ? 'vs-dark' : 'vs',
    inherit: true,
    rules,
    colors: {
      'editor.foreground': colors.textParagraph,
      'editor.background': colors.backgroundBasePlain,
      'editor.lineHighlightBackground': borderColor,
      'editor.lineHighlightBorder': borderColor,
      'editor.selectionHighlightBackground': borderColor,
      'editor.selectionHighlightBorder': borderColor,
      'editorSuggestWidget.background': bgColor,
      'editorSuggestWidget.border': bgColor,
      'editorSuggestWidget.focusHighlightForeground': bgColor,
      'editorSuggestWidget.foreground': colors.textParagraph,
      'editorSuggestWidget.highlightForeground': colors.primary,
      'editorSuggestWidget.selectedBackground': colors.primary,
      'editorSuggestWidget.selectedForeground': bgColor,
    },
  };
};
