import type { ContentId } from '../content_picker/types';
import type { QueryObserverResult } from '@tanstack/react-query';
import type { ContentClient } from './content_client';
import useObservable from 'react-use/lib/useObservable';
import { ContentItem, ContentType } from '../registry';
import { BehaviorSubject, type Observable } from 'rxjs';
import { useBehaviorSubject } from '../content_picker/hooks/use_behavior_subject';
import { ContentTypeCommonFields } from '../registry/types';

export class ContentClientItem<D = unknown> {
  public readonly content$: BehaviorSubject<ContentItem<D> | undefined>;
  public readonly fields$: BehaviorSubject<ContentTypeCommonFields>;
  public readonly title$: BehaviorSubject<string>;

  constructor (
    public readonly client: ContentClient,
    public readonly type: ContentType,
    public readonly id: ContentId,
    protected readonly query$: Observable<QueryObserverResult<D, unknown>>,
  ) {
    this.query$.subscribe(result => {
      if (result.data) {
        this.content$.next(new ContentItem(type, id[1], (result.data as any).item));
      }
    });
    this.content$ = new BehaviorSubject<ContentItem<D> | undefined>(undefined);
    this.fields$ = new BehaviorSubject<ContentTypeCommonFields>({id});
    this.content$.subscribe(content => {
      if (!content) return;
      this.fields$.next(content.fields());
    });
    const idStr = id[0] + ':' + id[1];
    this.title$ = new BehaviorSubject<string>(idStr);
    this.fields$.subscribe(fields => {
      this.title$.next(fields.title || idStr);
    });
  }

  public content(): ContentItem<D> | undefined {
    return this.content$.getValue();
  }

  public useQuery() {
    return useObservable(this.query$);
  }

  public useContent() {
    return useBehaviorSubject(this.content$);
  }

  public useFields() {
    return useBehaviorSubject(this.fields$);
  }

  public useTitle() {
    return useBehaviorSubject(this.title$);
  }
}
