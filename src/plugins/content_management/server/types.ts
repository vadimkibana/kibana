/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import type { CoreApi } from './core';
import type { ContentManagementPlugin } from './plugin';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ContentManagementServerSetupDependencies {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ContentManagementServerStartDependencies {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ContentManagementServerSetup extends CoreApi {}

export type ContentManagementServerStart = ReturnType<ContentManagementPlugin['start']>;
