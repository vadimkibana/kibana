/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

// Low level functions to parse grammar
export { getParser, getLexer, ROOT_STATEMENT } from './antlr_facade';

/**
 * ES|QL Query string -> AST data structure
 * this is the foundational building block for any advanced feature
 * a developer wants to build on top of the ESQL language
 **/
export { getAstAndSyntaxErrors } from './ast_parser';

export { ESQLErrorListener } from './antlr_error_listener';
