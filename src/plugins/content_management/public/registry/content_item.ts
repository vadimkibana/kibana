import type { ContentType } from './content_type';

export class ContentItem<D = unknown> {
  constructor (public readonly type: ContentType, public readonly data: D) {}
}
