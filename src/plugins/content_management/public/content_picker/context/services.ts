import * as React from 'react';
import type {ContentTypeRegistry} from '../../registry';
import type {CoreStart} from '@kbn/core-lifecycle-browser';
import type {ContentClient} from '../../content_client';

export interface ContentPickerServices {
  core: CoreStart;
  client: ContentClient;
  registry: ContentTypeRegistry;
}

export const context = React.createContext<ContentPickerServices>(null!);

export const useContentPickerServices = () => {
  const ctx = React.useContext(context);
  if (!ctx) {
    throw new Error('ContentPickerServicesContext has not been set.');
  }
  return ctx;
};
