/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import type {
  CoreSetup,
  CoreStart,
  Plugin,
  PluginInitializerContext,
  Logger,
} from '@kbn/core/server';
import { Core } from './core';
import { initRpcRoutes, registerProcedures, RpcService } from './rpc';
import type { Context as RpcContext } from './rpc';
import {
  ContentManagementServerSetup,
  ContentManagementServerStart,
  SetupDependencies,
} from './types';
import { procedureNames } from '../common';
import { EventStreamService } from './event_stream';

export class ContentManagementPlugin
  implements Plugin<ContentManagementServerSetup, ContentManagementServerStart, SetupDependencies>
{
  private readonly logger: Logger;
  private readonly core: Core;
  readonly #eventStream: EventStreamService;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
    this.core = new Core({ logger: this.logger });
    this.#eventStream = new EventStreamService({
      logger: this.logger,
      version: initializerContext.env.packageInfo.version,
    });
  }

  public setup(core: CoreSetup) {
    this.#eventStream.setup({ core });

    const { api: coreApi, contentRegistry } = this.core.setup();

    const rpc = new RpcService<RpcContext>();
    registerProcedures(rpc);

    const router = core.http.createRouter();
    initRpcRoutes(procedureNames, router, {
      rpc,
      contentRegistry,
    });

    return {
      ...coreApi,
    };
  }

  public start(core: CoreStart) {
    this.#eventStream.start();

    return {};
  }
}
