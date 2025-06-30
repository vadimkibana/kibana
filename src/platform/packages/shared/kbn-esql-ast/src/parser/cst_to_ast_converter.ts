/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import * as antlr from 'antlr4';
import * as cst from '../antlr/esql_parser';
import * as ast from '../types';
import { type AstNodeParserFields, Builder } from '../builder';
import { isCommand } from '../ast/helpers';
import { createLimitCommand } from './factories/limit';
import { createOption, visitSource } from './factories';
import { collectAllColumnIdentifiers, collectAllFields } from './walkers';
import { getPosition } from './helpers';
import type { Parser } from './parser';

/**
 * Transforms an ANTLR ES|QL Common Syntax Tree (CST) into a
 * Kibana Abstract Syntax Tree (AST).
 *
 * Most of the methods in this class are 1-to-1 mapping from CST-to-AST,
 * they are designed to convert specific CST nodes into their
 * corresponding AST nodes.
 */
export class CstToAstConverter {
  constructor(protected readonly parser: Parser) {}

  // -------------------------------------------------------------------- utils

  /**
   * Gets the source code slice for a given CST node.
   *
   * @param ctx A CST node to extract the source code for.
   * @returns Source code for the given CST node.
   */
  private getSrc(ctx: antlr.ParserRuleContext): string {
    const from = ctx.start.start;
    const to = ctx.stop ? ctx.stop.stop + 1 : ctx.start.stop + 1;

    return this.parser.src.slice(from, to);
  }

  /**
   * @todo Reanem to `getParserFields`.
   */
  private createParserFields(ctx: antlr.ParserRuleContext): AstNodeParserFields {
    return {
      text: ctx.getText(),
      location: getPosition(ctx.start, ctx.stop),
      incomplete: Boolean(ctx.exception),
    };
  }

  private createParserFieldsFromTerminalNode(node: antlr.TerminalNode): AstNodeParserFields {
    return this.createParserFieldsFromToken(node.symbol, node.getText());
  }

  private createParserFieldsFromToken(
    token: antlr.Token,
    text: string = token.text
  ): AstNodeParserFields {
    const fields: AstNodeParserFields = {
      text,
      location: getPosition(token, token),
      incomplete: false,
    };

    return fields;
  }

  private toIdentifierFromTerminalNode(node: antlr.TerminalNode): ast.ESQLIdentifier {
    return this.toIdentifierFromToken(node.symbol);
  }

  private toIdentifierFromToken(token: antlr.Token): ast.ESQLIdentifier {
    const name = token.text;

    return Builder.identifier({ name }, this.createParserFieldsFromToken(token));
  }

  // -------------------------------------------------------------------- query

  fromSingleStatement(ctx: cst.SingleStatementContext): ast.ESQLAstQueryExpression | undefined {
    return this.fromQuery(ctx.query());
  }

  private fromQuery(ctx: cst.QueryContext): ast.ESQLAstQueryExpression | undefined {
    const children = ctx.children;

    if (!children) {
      return;
    }

    const length = children.length;

    if (!length) {
      return;
    }

    const commands: ast.ESQLAstQueryExpression['commands'] = [];

    for (let i = 0; i < length; i++) {
      const childCtx = children[i];
      const child = this.fromAny(childCtx);

      if (isCommand(child)) {
        commands.push(child);
      }
    }

    return Builder.expression.query(commands);
  }

  private fromAny(ctx: antlr.ParseTree): ast.ESQLProperNode | undefined {
    if (ctx instanceof cst.SingleCommandQueryContext) {
      return this.fromSingleCommandQuery(ctx);
    } else if (ctx instanceof cst.SourceCommandContext) {
      return this.fromSourceCommand(ctx);
    } else if (ctx instanceof cst.ProcessingCommandContext) {
      return this.fromProcessingCommand(ctx);
    }

    return undefined;
  }

  private fromSubqueryExpression(ctx: cst.SubqueryExpressionContext): ast.ESQLAstQueryExpression {
    return this.fromQuery(ctx.query())!;
  }

  // ----------------------------------------------------------------- commands

  private fromSingleCommandQuery(ctx: cst.SingleCommandQueryContext): ast.ESQLCommand {
    return this.fromSourceCommand(ctx.sourceCommand());
  }

  private fromSourceCommand(ctx: cst.SourceCommandContext): ast.ESQLCommand {
    const fromCommandCtx = ctx.fromCommand();

    if (fromCommandCtx) {
      return this.fromFromCommand(fromCommandCtx);
    }

    const rowCommandCtx = ctx.rowCommand();

    if (rowCommandCtx) {
      return this.fromRowCommand(rowCommandCtx);
    }

    const tsCommandCtx = ctx.timeSeriesCommand();

    if (tsCommandCtx) {
      return this.fromTimeseriesCommand(tsCommandCtx);
    }

    const explainCommandCtx = ctx.explainCommand();

    if (explainCommandCtx) {
      return this.fromExplainCommand(explainCommandCtx);
    }

    const showCommandCtx = ctx.showCommand();

    if (showCommandCtx) {
      return this.fromShowCommand(showCommandCtx);
    }

    throw new Error(`Unknown source command: ${this.getSrc(ctx)}`);
  }

  private fromProcessingCommand(ctx: cst.ProcessingCommandContext): ast.ESQLCommand {
    const limitCommandCtx = ctx.limitCommand();

    if (limitCommandCtx) {
      return createLimitCommand(limitCommandCtx);
    }

    throw new Error(`Unknown processing command: ${this.getSrc(ctx)}`);
  }

  private createCommand<
    Name extends string,
    Cmd extends ast.ESQLCommand<Name> = ast.ESQLCommand<Name>
  >(name: Name, ctx: antlr.ParserRuleContext, partial?: Partial<Cmd>): Cmd {
    const parserFields = this.createParserFields(ctx);
    const command = Builder.command({ name, args: [] }, parserFields) as Cmd;

    if (partial) {
      Object.assign(command, partial);
    }

    return command;
  }

  // ------------------------------------------------------------------ EXPLAIN

  private fromExplainCommand(ctx: cst.ExplainCommandContext): ast.ESQLCommand<'explain'> {
    const command = this.createCommand('explain', ctx);
    const arg = this.fromSubqueryExpression(ctx.subqueryExpression());

    command.args.push(arg);

    return command;
  }

  // --------------------------------------------------------------------- FROM

  private fromFromCommand(ctx: cst.FromCommandContext): ast.ESQLCommand<'from'> {
    const command = this.createCommand('from', ctx);
    const indexPatternCtx = ctx.indexPatternAndMetadataFields();
    const metadataCtx = indexPatternCtx.metadata();
    const sources = indexPatternCtx
      .getTypedRuleContexts(cst.IndexPatternContext)
      .map((sourceCtx) => visitSource(sourceCtx));

    command.args.push(...sources);

    if (metadataCtx && metadataCtx.METADATA()) {
      const name = metadataCtx.METADATA().getText().toLowerCase();
      const option = createOption(name, metadataCtx);
      const optionArgs = collectAllColumnIdentifiers(metadataCtx);

      option.args.push(...optionArgs);
      command.args.push(option);
    }

    return command;
  }

  // ---------------------------------------------------------------------- ROW

  private fromRowCommand(ctx: cst.RowCommandContext): ast.ESQLCommand<'row'> {
    const command = this.createCommand('row', ctx);
    const fields = collectAllFields(ctx.fields());

    command.args.push(...fields);

    return command;
  }

  // ----------------------------------------------------------------------- TS

  private fromTimeseriesCommand(ctx: cst.TimeSeriesCommandContext): ast.ESQLAstTimeseriesCommand {
    const command = this.createCommand('ts', ctx) as ast.ESQLAstTimeseriesCommand;
    const indexPatternCtx = ctx.indexPatternAndMetadataFields();
    const metadataCtx = indexPatternCtx.metadata();
    const sources = indexPatternCtx
      .getTypedRuleContexts(cst.IndexPatternContext)
      .map((sourceCtx) => visitSource(sourceCtx));

    command.args.push(...sources);

    if (metadataCtx && metadataCtx.METADATA()) {
      const name = metadataCtx.METADATA().getText().toLowerCase();
      const option = createOption(name, metadataCtx);
      const optionArgs = collectAllColumnIdentifiers(metadataCtx);

      option.args.push(...optionArgs);
      command.args.push(option);
    }

    return command;
  }

  // --------------------------------------------------------------------- SHOW

  private fromShowCommand(ctx: cst.ShowCommandContext): ast.ESQLCommand<'show'> {
    const command = this.createCommand('show', ctx);

    if (ctx instanceof cst.ShowInfoContext) {
      const infoCtx = ctx as cst.ShowInfoContext;
      const arg = this.toIdentifierFromTerminalNode(infoCtx.INFO());

      arg.name = arg.name.toUpperCase();

      command.args.push(arg);
    }

    return command;
  }
}
