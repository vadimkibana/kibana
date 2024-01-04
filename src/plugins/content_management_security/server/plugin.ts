/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { CoreSetup, CoreStart, Plugin } from '@kbn/core/server';
import { ContentManagementServerSetup, ContentManagementServerStart } from '@kbn/content-management-plugin/server';
import { SecurityPluginSetup, SecurityPluginStart } from '@kbn/security-plugin/server';

export type ContentManagementSecurityServerSetup = void;

export type ContentManagementSecurityServerStart = void;

export interface ContentManagementSecurityServerSetupDependencies {
  contentManagement: ContentManagementServerSetup;
  security: SecurityPluginSetup;
}

export interface ContentManagementSecurityServerStartDependencies {
  contentManagement: ContentManagementServerStart;
  security: SecurityPluginStart;
}

export class ContentManagementSecurityServerPlugin
  implements
    Plugin<
      ContentManagementSecurityServerSetup,
      ContentManagementSecurityServerStart,
      ContentManagementSecurityServerSetupDependencies,
      ContentManagementSecurityServerStartDependencies
    >
{
  constructor() {}

  public setup(core: CoreSetup, plugins: ContentManagementSecurityServerSetupDependencies): ContentManagementSecurityServerSetup {
    // Nothing to do here yet
  }

  public start(core: CoreStart, plugins: ContentManagementSecurityServerStartDependencies): ContentManagementSecurityServerStart {
    const {contentManagement, security} = plugins;

    if (contentManagement && security) {
        contentManagement.setSecurity(security);
    }
  }

  public stop() {}
}
