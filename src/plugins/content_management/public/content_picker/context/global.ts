import * as React from 'react';
import type {CoreStart} from '@kbn/core-lifecycle-browser';
import type {ContentClient} from '../../content_client';
import {ContentTypeRegistry} from '../../registry';

export interface ContentPickerGlobalContextValue {
  core: CoreStart;
  client: ContentClient;
  registry: ContentTypeRegistry;
}

export const context = React.createContext<ContentPickerGlobalContextValue>(null!);

export const useContentPickerGlobalContext = () => {
  const ctx = React.useContext(context);
  if (!ctx) {
    throw new Error('ContentPickerGlobalContext has not been set.');
  }
  return ctx;
};
