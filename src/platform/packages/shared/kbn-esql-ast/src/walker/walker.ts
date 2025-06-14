/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import type {
  ESQLAstCommand,
  ESQLAstComment,
  ESQLAstExpression,
  ESQLAstItem,
  ESQLAstNode,
  ESQLAstNodeFormatting,
  ESQLAstQueryExpression,
  ESQLColumn,
  ESQLCommand,
  ESQLCommandOption,
  ESQLFunction,
  ESQLIdentifier,
  ESQLInlineCast,
  ESQLList,
  ESQLLiteral,
  ESQLMap,
  ESQLMapEntry,
  ESQLParamLiteral,
  ESQLProperNode,
  ESQLSingleAstItem,
  ESQLSource,
  ESQLTimeInterval,
  ESQLUnknownItem,
} from '../types';
import { NodeMatchTemplate, templateToPredicate } from './helpers';

type Node = ESQLAstNode | ESQLAstNode[];

export interface WalkerOptions {
  visitCommand?: (
    node: ESQLCommand,
    parent: ESQLAstQueryExpression | undefined,
    walker: Walker
  ) => void;
  visitCommandOption?: (
    node: ESQLCommandOption,
    parent: ESQLCommand | undefined,
    walker: Walker
  ) => void;
  visitQuery?: (
    node: ESQLAstQueryExpression,
    parent: ESQLProperNode | undefined,
    walker: Walker
  ) => void;
  visitFunction?: (node: ESQLFunction, parent: ESQLProperNode | undefined, walker: Walker) => void;
  visitSource?: (node: ESQLSource, parent: ESQLProperNode | undefined, walker: Walker) => void;
  visitColumn?: (node: ESQLColumn, parent: ESQLProperNode | undefined, walker: Walker) => void;
  visitLiteral?: (node: ESQLLiteral, parent: ESQLProperNode | undefined, walker: Walker) => void;
  visitListLiteral?: (node: ESQLList, parent: ESQLProperNode | undefined, walker: Walker) => void;
  visitTimeIntervalLiteral?: (
    node: ESQLTimeInterval,
    parent: ESQLProperNode | undefined,
    walker: Walker
  ) => void;
  visitInlineCast?: (
    node: ESQLInlineCast,
    parent: ESQLProperNode | undefined,
    walker: Walker
  ) => void;
  visitUnknown?: (
    node: ESQLUnknownItem,
    parent: ESQLProperNode | undefined,
    walker: Walker
  ) => void;
  visitIdentifier?: (
    node: ESQLIdentifier,
    parent: ESQLProperNode | undefined,
    walker: Walker
  ) => void;
  visitMap?: (node: ESQLMap, parent: ESQLProperNode | undefined, walker: Walker) => void;
  visitMapEntry?: (node: ESQLMapEntry, parent: ESQLProperNode | undefined, walker: Walker) => void;

  /**
   * Called on every expression node.
   *
   * @todo Rename to `visitExpression`.
   */
  visitSingleAstItem?: (
    node: ESQLAstExpression,
    parent: ESQLProperNode | undefined,
    walker: Walker
  ) => void;

  /**
   * Called for any node type that does not have a specific visitor.
   *
   * @param node Any valid AST node.
   */
  visitAny?: (node: ESQLProperNode, parent: ESQLProperNode | undefined, walker: Walker) => void;

  /**
   * Order in which to traverse child nodes. If set to 'forward', child nodes
   * are traversed in the order they appear in the AST. If set to 'backward',
   * child nodes are traversed in reverse order.
   *
   * @default 'forward'
   */
  order?: 'forward' | 'backward';
}

export type WalkerAstNode = ESQLAstNode | ESQLAstNode[];

/**
 * Iterates over all nodes in the AST and calls the appropriate visitor
 * functions.
 */
export class Walker {
  /**
   * Walks the AST and calls the appropriate visitor functions.
   */
  public static readonly walk = (node: WalkerAstNode, options: WalkerOptions): Walker => {
    const walker = new Walker(options);
    walker.walk(node);
    return walker;
  };

  /**
   * Walks the AST and extracts all command statements.
   *
   * @param node AST node to extract parameters from.
   */
  public static readonly commands = (node: Node, options?: WalkerOptions): ESQLCommand[] => {
    const commands: ESQLCommand[] = [];
    Walker.walk(node, {
      ...options,
      visitCommand: (cmd) => commands.push(cmd),
    });
    return commands;
  };

  /**
   * Walks the AST and extracts all parameter literals.
   *
   * @param node AST node to extract parameters from.
   */
  public static readonly params = (
    node: WalkerAstNode,
    options?: WalkerOptions
  ): ESQLParamLiteral[] => {
    const params: ESQLParamLiteral[] = [];
    Walker.walk(node, {
      ...options,
      visitLiteral: (param) => {
        if (param.literalType === 'param') {
          params.push(param);
        }
      },
    });
    return params;
  };

  /**
   * Finds and returns the first node that matches the search criteria.
   *
   * @param node AST node to start the search from.
   * @param predicate A function that returns true if the node matches the search criteria.
   * @returns The first node that matches the search criteria.
   */
  public static readonly find = (
    node: WalkerAstNode,
    predicate: (node: ESQLProperNode) => boolean,
    options?: WalkerOptions
  ): ESQLProperNode | undefined => {
    let found: ESQLProperNode | undefined;
    Walker.walk(node, {
      ...options,
      visitAny: (child) => {
        if (!found && predicate(child)) {
          found = child;
        }
      },
    });
    return found;
  };

  /**
   * Finds and returns all nodes that match the search criteria.
   *
   * @param node AST node to start the search from.
   * @param predicate A function that returns true if the node matches the search criteria.
   * @returns All nodes that match the search criteria.
   */
  public static readonly findAll = (
    node: WalkerAstNode,
    predicate: (node: ESQLProperNode) => boolean,
    options?: WalkerOptions
  ): ESQLProperNode[] => {
    const list: ESQLProperNode[] = [];
    Walker.walk(node, {
      ...options,
      visitAny: (child) => {
        if (predicate(child)) {
          list.push(child);
        }
      },
    });
    return list;
  };

  /**
   * Matches a single node against a template object. Returns the first node
   * that matches the template. The *template* object is a sparse representation
   * of the node structure, where each property corresponds to a node type or
   * property to match against.
   *
   * - An array matches if the node key is in the array.
   * - A RegExp matches if the node key matches the RegExp.
   * - Any other value matches if the node key is triple-equal to the value.
   *
   * For example, match the first `literal`:
   *
   * ```typescript
   * const literal = Walker.match(ast, { type: 'literal' });
   * ```
   *
   * Find the first `literal` with a specific value:
   *
   * ```typescript
   * const number42 = Walker.match(ast, { type: 'literal', value: 42 });
   * ```
   *
   * Find the first literal of type `integer` or `decimal`:
   *
   * ```typescript
   * const number = Walker.match(ast, {
   *   type: 'literal',
   *   literalType: [ 'integer', 'decimal' ],
   * });
   * ```
   *
   * Finally, you can also match any field by regular expression. Find
   * the first `source` AST node, which has "log" in its name:
   *
   * ```typescript
   * const logSource = Walker.match(ast, { type: 'source', name: /.+log.+/ });
   * ```
   *
   * @param node AST node to match against the template.
   * @param template Template object to match against the node.
   * @returns The first node that matches the template
   */
  public static readonly match = (
    node: WalkerAstNode,
    template: NodeMatchTemplate,
    options?: WalkerOptions
  ): ESQLProperNode | undefined => {
    const predicate = templateToPredicate(template);
    return Walker.find(node, predicate, options);
  };

  /**
   * Matches all nodes against a template object. Returns all nodes that match
   * the template.
   *
   * @param node AST node to match against the template.
   * @param template Template object to match against the node.
   * @returns All nodes that match the template
   */
  public static readonly matchAll = (
    node: WalkerAstNode,
    template: NodeMatchTemplate,
    options?: WalkerOptions
  ): ESQLProperNode[] => {
    const predicate = templateToPredicate(template);
    return Walker.findAll(node, predicate, options);
  };

  /**
   * Finds the first function that matches the predicate.
   *
   * @param node AST node from which to search for a function
   * @param predicate Callback function to determine if the function is found
   * @returns The first function that matches the predicate
   */
  public static readonly findFunction = (
    node: WalkerAstNode,
    predicate: (node: ESQLFunction) => boolean
  ): ESQLFunction | undefined => {
    let found: ESQLFunction | undefined;
    Walker.walk(node, {
      visitFunction: (func) => {
        if (!found && predicate(func)) {
          found = func;
        }
      },
    });
    return found;
  };

  /**
   * Searches for at least one occurrence of a function or expression in the AST.
   *
   * @param node AST subtree to search in.
   * @param name Function or expression name to search for.
   * @returns True if the function or expression is found in the AST.
   */
  public static readonly hasFunction = (
    node: ESQLAstNode | ESQLAstNode[],
    name: string
  ): boolean => {
    return !!Walker.findFunction(node, (fn) => fn.name === name);
  };

  public static readonly visitComments = (
    root: ESQLAstNode | ESQLAstNode[],
    callback: (
      comment: ESQLAstComment,
      node: ESQLProperNode,
      attachment: keyof ESQLAstNodeFormatting
    ) => void
  ): void => {
    Walker.walk(root, {
      visitAny: (node) => {
        const formatting = node.formatting;
        if (!formatting) return;

        if (formatting.top) {
          for (const decoration of formatting.top) {
            if (decoration.type === 'comment') {
              callback(decoration, node, 'top');
            }
          }
        }

        if (formatting.left) {
          for (const decoration of formatting.left) {
            if (decoration.type === 'comment') {
              callback(decoration, node, 'left');
            }
          }
        }

        if (formatting.right) {
          for (const decoration of formatting.right) {
            if (decoration.type === 'comment') {
              callback(decoration, node, 'right');
            }
          }
        }

        if (formatting.rightSingleLine) {
          callback(formatting.rightSingleLine, node, 'rightSingleLine');
        }

        if (formatting.bottom) {
          for (const decoration of formatting.bottom) {
            if (decoration.type === 'comment') {
              callback(decoration, node, 'bottom');
            }
          }
        }
      },
    });
  };

  constructor(protected readonly options: WalkerOptions) {}

  public walk(
    node: undefined | ESQLAstNode | ESQLAstNode[],
    parent: ESQLProperNode | undefined = undefined
  ): void {
    if (!node) return;
    if (Array.isArray(node)) {
      this.walkList(node, parent);
    } else if (node.type === 'command') {
      this.walkCommand(node as ESQLAstCommand, parent as ESQLAstQueryExpression | undefined);
    } else {
      this.walkExpression(node as ESQLAstExpression, parent);
    }
  }

  protected walkList(list: ESQLAstNode[], parent: ESQLProperNode | undefined): void {
    const { options } = this;
    const length = list.length;

    if (options.order === 'backward') {
      for (let i = length - 1; i >= 0; i--) {
        this.walk(list[i], parent);
      }
    } else {
      for (let i = 0; i < length; i++) {
        this.walk(list[i], parent);
      }
    }
  }

  public walkCommand(node: ESQLAstCommand, parent: ESQLAstQueryExpression | undefined): void {
    const { options } = this;
    (options.visitCommand ?? options.visitAny)?.(node, parent, this);
    this.walkList(node.args, node);
  }

  public walkOption(node: ESQLCommandOption, parent: ESQLCommand | undefined): void {
    const { options } = this;
    (options.visitCommandOption ?? options.visitAny)?.(node, parent, this);
    this.walkList(node.args, node);
  }

  public walkExpression(
    node: ESQLAstItem | ESQLAstExpression,
    parent: ESQLProperNode | undefined = undefined
  ): void {
    if (Array.isArray(node)) {
      const list = node as ESQLAstItem[];
      this.walkList(list, parent);
    } else {
      const item = node as ESQLSingleAstItem;
      this.walkSingleAstItem(item, parent);
    }
  }

  public walkListLiteral(node: ESQLList, parent: ESQLProperNode | undefined): void {
    const { options } = this;
    (options.visitListLiteral ?? options.visitAny)?.(node, parent, this);
    this.walkList(node.values, node);
  }

  public walkColumn(node: ESQLColumn, parent: ESQLProperNode | undefined): void {
    const { options } = this;
    const { args } = node;

    (options.visitColumn ?? options.visitAny)?.(node, parent, this);

    if (args) {
      this.walkList(args, node);
    }
  }

  public walkInlineCast(node: ESQLInlineCast, parent: ESQLProperNode | undefined): void {
    const { options } = this;
    (options.visitInlineCast ?? options.visitAny)?.(node, parent, this);
    this.walkExpression(node.value, node);
  }

  public walkFunction(node: ESQLFunction, parent: ESQLProperNode | undefined): void {
    const { options } = this;
    (options.visitFunction ?? options.visitAny)?.(node, parent, this);

    if (node.operator) this.walkSingleAstItem(node.operator, node);

    this.walkList(node.args, node);
  }

  public walkMap(node: ESQLMap, parent: ESQLProperNode | undefined): void {
    const { options } = this;
    (options.visitMap ?? options.visitAny)?.(node, parent, this);
    this.walkList(node.entries, node);
  }

  public walkMapEntry(node: ESQLMapEntry, parent: ESQLProperNode | undefined): void {
    const { options } = this;

    (options.visitMapEntry ?? options.visitAny)?.(node, parent, this);

    if (options.order === 'backward') {
      this.walkSingleAstItem(node.value, node);
      this.walkSingleAstItem(node.key, node);
    } else {
      this.walkSingleAstItem(node.key, node);
      this.walkSingleAstItem(node.value, node);
    }
  }

  public walkQuery(node: ESQLAstQueryExpression, parent: ESQLProperNode | undefined): void {
    const { options } = this;
    (options.visitQuery ?? options.visitAny)?.(node, parent, this);
    this.walkList(node.commands, node);
  }

  public walkSingleAstItem(node: ESQLAstExpression, parent: ESQLProperNode | undefined): void {
    if (!node) return;
    const { options } = this;
    options.visitSingleAstItem?.(node, parent, this);
    switch (node.type) {
      case 'query': {
        this.walkQuery(node as ESQLAstQueryExpression, parent);
        break;
      }
      case 'function': {
        this.walkFunction(node as ESQLFunction, parent);
        break;
      }
      case 'map': {
        this.walkMap(node as ESQLMap, parent);
        break;
      }
      case 'map-entry': {
        this.walkMapEntry(node as ESQLMapEntry, parent);
        break;
      }
      case 'option': {
        this.walkOption(node, parent as ESQLCommand | undefined);
        break;
      }
      case 'source': {
        (options.visitSource ?? options.visitAny)?.(node, parent, this);
        break;
      }
      case 'column': {
        this.walkColumn(node, parent);
        break;
      }
      case 'literal': {
        (options.visitLiteral ?? options.visitAny)?.(node, parent, this);
        break;
      }
      case 'list': {
        this.walkListLiteral(node, parent);
        break;
      }
      case 'timeInterval': {
        (options.visitTimeIntervalLiteral ?? options.visitAny)?.(node, parent, this);
        break;
      }
      case 'inlineCast': {
        this.walkInlineCast(node, parent);
        break;
      }
      case 'identifier': {
        (options.visitIdentifier ?? options.visitAny)?.(node, parent, this);
        break;
      }
      case 'unknown': {
        (options.visitUnknown ?? options.visitAny)?.(node, parent, this);
        break;
      }
    }
  }
}

export const walk = Walker.walk;
