/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/* eslint-disable max-classes-per-file */

import {
  ESQLCommand,
  ESQLDecimalLiteral,
  ESQLInlineCast,
  ESQLIntegerLiteral,
  ESQLNumericLiteralType,
} from '../types';
import { AstNodeParserFields, AstNodeTemplate } from './types';

export class Builder {
  /**
   * Constructs fields which are only available when the node is minted by
   * the parser.
   */
  public static readonly parserFields = ({
    location = { min: 0, max: 0 },
    text = '',
    incomplete = false,
  }: Partial<AstNodeParserFields> = {}): AstNodeParserFields => ({
    location,
    text,
    incomplete,
  });

  public static readonly command = (
    template: AstNodeTemplate<ESQLCommand>,
    parserFields?: Partial<AstNodeParserFields>
  ): ESQLCommand => {
    return {
      ...template,
      ...Builder.parserFields(parserFields),
      type: 'command',
    };
  };

  public static readonly expression = class ExpressionBuilder {
    public static readonly inlineCast = (
      template: Omit<AstNodeTemplate<ESQLInlineCast>, 'name'>,
      parserFields?: Partial<AstNodeParserFields>
    ): ESQLInlineCast => {
      return {
        ...template,
        ...Builder.parserFields(parserFields),
        name: '',
        type: 'inlineCast',
      };
    };

    public static readonly literal = class ExpressionLiteralBuilder {
      /**
       * Constructs an integer literal node.
       */
      public static readonly numeric = (
        template: Omit<
          AstNodeTemplate<ESQLIntegerLiteral | ESQLDecimalLiteral>,
          'literalType' | 'name'
        >,
        type: ESQLNumericLiteralType = 'integer'
      ): ESQLIntegerLiteral | ESQLDecimalLiteral => {
        const node: ESQLIntegerLiteral | ESQLDecimalLiteral = {
          ...template,
          ...Builder.parserFields(template),
          type: 'literal',
          literalType: type,
          name: template.value.toString(),
        };

        return node;
      };
    };
  };
}
