/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { parse } from '../../../parser';
import { BasicPrettyPrinter } from '../../../pretty_print';
import * as commands from '..';

describe('commands.from.metadata', () => {
  describe('.list()', () => {
    it('returns empty array on no metadata in query', () => {
      const src = 'FROM index | WHERE a = b | LIMIT 123';
      const { root } = parse(src);
      const column = [...commands.from.metadata.list(root)];

      expect(column.length).toBe(0);
    });

    it('returns a single METADATA field', () => {
      const src = 'FROM index METADATA a';
      const { root } = parse(src);
      const [column] = [...commands.from.metadata.list(root)][0];

      expect(column).toMatchObject({
        type: 'column',
        parts: ['a'],
      });
    });

    it('returns all METADATA fields', () => {
      const src = 'FROM index METADATA a, b, _id, _lang | STATS avg(a) as avg_a | LIMIT 88';
      const { root } = parse(src);
      const columns = [...commands.from.metadata.list(root)].map(([column]) => column);

      expect(columns).toMatchObject([
        {
          type: 'column',
          parts: ['a'],
        },
        {
          type: 'column',
          parts: ['b'],
        },
        {
          type: 'column',
          parts: ['_id'],
        },
        {
          type: 'column',
          parts: ['_lang'],
        },
      ]);
    });
  });

  describe('.find()', () => {
    it('returns undefined if field is not found', () => {
      const src = 'FROM index | WHERE a = b | LIMIT 123';
      const { root } = parse(src);
      const column = commands.from.metadata.find(root, ['a']);

      expect(column).toBe(undefined);
    });

    it('can find a single field', () => {
      const src = 'FROM index METADATA a';
      const { root } = parse(src);
      const [column] = commands.from.metadata.find(root, ['a'])!;

      expect(column).toMatchObject({
        type: 'column',
        name: 'a',
      });
    });

    it('can find a single METADATA field', () => {
      const src = 'FROM index METADATA a, b, c, _lang, _id';
      const { root } = parse(src);
      const [column1] = commands.from.metadata.find(root, 'c')!;
      const [column2] = commands.from.metadata.find(root, '_id')!;

      expect(column1).toMatchObject({
        type: 'column',
        name: 'c',
      });
      expect(column2).toMatchObject({
        type: 'column',
        name: '_id',
      });
    });
  });

  describe('.remove()', () => {
    it('can remove a metadata field from a list', () => {
      const src1 = 'FROM index METADATA a, b, c';
      const { root } = parse(src1);
      const src2 = BasicPrettyPrinter.print(root);

      expect(src2).toBe('FROM index METADATA a, b, c');

      commands.from.metadata.remove(root, 'b');

      const src3 = BasicPrettyPrinter.print(root);

      expect(src3).toBe('FROM index METADATA a, c');
    });

    it('does nothing if field-to-delete does not exist', () => {
      const src1 = 'FROM index METADATA a, b, c';
      const { root } = parse(src1);
      const src2 = BasicPrettyPrinter.print(root);

      expect(src2).toBe('FROM index METADATA a, b, c');

      commands.from.metadata.remove(root, 'd');

      const src3 = BasicPrettyPrinter.print(root);

      expect(src3).toBe('FROM index METADATA a, b, c');
    });

    it('can remove all metadata fields one-by-one', () => {
      const src1 = 'FROM index METADATA a, b, c';
      const { root } = parse(src1);
      const src2 = BasicPrettyPrinter.print(root);

      expect(src2).toBe('FROM index METADATA a, b, c');

      commands.from.metadata.remove(root, 'b');
      commands.from.metadata.remove(root, 'c');
      commands.from.metadata.remove(root, 'a');

      const src3 = BasicPrettyPrinter.print(root);

      expect(src3).toBe('FROM index');
    });
  });

  describe('.add()', () => {
    it('can append a METADATA field', () => {
      const src1 = 'FROM index METADATA a';
      const { root } = parse(src1);

      commands.from.metadata.add(root, 'b');

      const src2 = BasicPrettyPrinter.print(root);

      expect(src2).toBe('FROM index METADATA a, b');
    });
  });
});
