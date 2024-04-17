/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import * as React from 'react';
import { getStartDeps as start } from '@kbn/react-kibana-context-common';
import { ConnectionDetailsOptsProvider } from '../context';
import { ConnectionDetailsOpts } from '../types';
import { useAsyncMemo } from '../hooks/use_async_memo';

const createOpts = async (props: KibanaConnectionDetailsProviderProps) => {
  const { options } = props;
  const { http, docLinks } = start().core;
  const locator = start().plugins?.share?.url?.locators.get('MANAGEMENT_APP_LOCATOR');
  const manageKeysLink = await locator?.getUrl({ sectionId: 'security', appId: 'api_keys' });
  const result: ConnectionDetailsOpts = {
    ...options,
    navigateToUrl: (link: string) => {
      props.onNavigation?.();
      start().core.application?.navigateToUrl?.(link);
    },
    links: {
      learnMore: docLinks.links.fleet.apiKeysLearnMore,
      ...options?.links,
    },
    endpoints: options?.endpoints,
    apiKeys: {
      manageKeysLink,
      createKey: async ({ name }) => {
        if (!http) {
          throw new Error('HTTP service is not available');
        }

        interface KeyResponse {
          id: string;
          name: string;
          expiration: number;
          api_key: string;
          encoded: string;
        }

        const response = await http.post<KeyResponse>('/internal/security/api_key', {
          body: JSON.stringify({
            name,
            expiration: '90d',
            metadata: '{}',
            role_descriptors: '{}',
          }),
        });

        return {
          apiKey: {
            id: response.id,
            name: response.name,
            key: response.api_key,
            encoded: response.encoded,
          },
        };
      },
      hasPermission: async () => true,
      ...options?.apiKeys,
    },
  };

  return result;
};

export interface KibanaConnectionDetailsProviderProps {
  onNavigation?: () => void;
  options?: ConnectionDetailsOpts;
}

export const KibanaConnectionDetailsProvider: React.FC<KibanaConnectionDetailsProviderProps> = (
  props
) => {
  const opts = useAsyncMemo(() => createOpts(props), [props.onNavigation, props.options]);

  if (!opts) {
    return null;
  }

  return <ConnectionDetailsOptsProvider {...opts}>{props.children}</ConnectionDetailsOptsProvider>;
};
