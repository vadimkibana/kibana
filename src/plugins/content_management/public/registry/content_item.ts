import type { ContentId } from '../content_picker/types';
import type { ContentType } from './content_type';
import type { ContentTypeCommonFields } from './types';

export class ContentItem<D = unknown> {
  constructor (public readonly type: ContentType, public readonly id: string, public readonly data: D) {}

  public get contentId(): ContentId {
    return [this.type.id, this.id];
  }

  public fields(): ContentTypeCommonFields {
    const fields: ContentTypeCommonFields = {
      id: this.contentId,
    };
    const mapper = this.type.fields;
    if (mapper) {
      Object.assign(fields, mapper(this.data));
    }
    return fields;
  }
}
