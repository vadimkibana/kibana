import type { ContentId } from '../content_picker/types';
import type { QueryObserverResult } from '@tanstack/react-query';
import { ContentItem, ContentType } from '../registry';
import type { ContentClient } from './content_client';
import { BehaviorSubject, type Observable } from 'rxjs';
import useObservable from 'react-use/lib/useObservable';
import { useBehaviorSubject } from '../content_picker/hooks/use_behavior_subject';

export class ContentClientItem<D = unknown> {
  public readonly content$ = new BehaviorSubject<ContentItem<D> | undefined>(undefined);

  constructor (
    public readonly client: ContentClient,
    public readonly type: ContentType,
    public readonly id: ContentId,
    protected readonly query$: Observable<QueryObserverResult<D, unknown>>,
  ) {
    this.query$.subscribe(result => {
      if (result.data) {
        this.content$.next(new ContentItem(type, result.data));
      }
    });
  }

  public content(): ContentItem<D> | undefined {
    return this.content$.getValue();
  }

  public readonly useQuery = () => {
    return useObservable(this.query$);
  };

  public readonly useContent = () => {
    return useBehaviorSubject(this.content$);
  };
}
