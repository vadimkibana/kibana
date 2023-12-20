/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { validateVersion } from '@kbn/object-versioning/lib/utils';

import type { ContentTypeDefinition } from './content_type_definition';
import { ContentType } from './content_type';

export class ContentTypeRegistry {
  private readonly types: Map<string, ContentType<any>> = new Map();

  public register<Data = unknown>(definition: ContentTypeDefinition<Data>): ContentType<Data> {
    if (this.types.has(definition.id)) {
      throw new Error(`Content type with id "${definition.id}" already registered.`);
    }

    const { result, value } = validateVersion(definition.version?.latest);
    if (!result) {
      throw new Error(`Invalid version [${definition.version?.latest}]. Must be an integer.`);
    }

    if (value < 1) {
      throw new Error(`Version must be >= 1`);
    }

    const def: ContentTypeDefinition<Data> = {
      ...definition,
      version: { ...definition.version, latest: value },
    };
    const type = new ContentType<Data>(def);
    this.types.set(type.id, type);

    return type;
  }

  public get(id: string): ContentType | undefined {
    return this.types.get(id);
  }

  public getAll(): ContentType[] {
    return Array.from(this.types.values());
  }
}
