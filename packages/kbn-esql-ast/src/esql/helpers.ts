/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { Builder } from '../builder';
import { Walker, WalkerAstNode } from '../walker/walker';
import type { ESQLProperNode } from '../types';
import type {
  SynthGenerator,
  SynthMethod,
  SynthSerializer,
  SynthTaggedTemplateWithOpts,
} from './types';
import type { ParseOptions } from '../parser';

export const clearParserFields = (ast: WalkerAstNode) => {
  Walker.walk(ast, {
    visitAny: (node) => {
      Object.assign(node, Builder.parserFields({}));
    },
  });
};

export const createSynthMethod = <N extends ESQLProperNode>(
  generator: SynthGenerator<N>,
  serializer: SynthSerializer<N>
): SynthMethod<N> => {
  const templateStringTag: SynthTaggedTemplateWithOpts<N> = ((opts?: ParseOptions) => {
    return (template: TemplateStringsArray, ...params: Array<N | string>) => {
      let src = '';
      const length = template.length;
      for (let i = 0; i < length; i++) {
        src += template[i];
        if (i < params.length) {
          const param = params[i];
          if (typeof param === 'string') src += param;
          else src += serializer(param);
        }
      }
      return generator(src, opts);
    };
  }) as SynthTaggedTemplateWithOpts<N>;

  const method: SynthMethod<N> = ((...args) => {
    const [first] = args;

    /**
     * Usage as function:
     *
     * ```js
     * expr('42');
     * ```
     */
    if (typeof first === 'string') return generator(first, args[1] as ParseOptions);

    /**
     * Usage as tagged template:
     *
     * ```js
     * expr`42`;
     * ```
     */
    if (Array.isArray(first)) {
      return templateStringTag()(
        first as unknown as TemplateStringsArray,
        ...(args as any).slice(1)
      );
    }

    /**
     * Usage as tagged template, with ability to specify parsing options:
     *
     * ```js
     * expr({ withFormatting: false })`42`;
     * ```
     */
    return templateStringTag(args[0] as ParseOptions);
  }) as SynthMethod<N>;

  return method;
};
