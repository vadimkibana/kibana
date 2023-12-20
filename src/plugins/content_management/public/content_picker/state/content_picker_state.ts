import {BehaviorSubject} from "rxjs";
import {ContentPickerServices} from "../context/services";
import type {PickerProps} from "../components/types";
import type {ContentId} from "../types";
import {compareId} from "../utils";
import {useBehaviorSubject} from "../hooks/use_behavior_subject";

export class ContentPickerState {
  /** Query string to list of IDs. */
  protected readonly queryCache = new Map<string, BehaviorSubject<ContentId[]>>();
  public readonly selected$ = new BehaviorSubject<ContentId | null>(null);

  constructor (public readonly services: ContentPickerServices, public readonly props: PickerProps) {
    this.loadInitial().catch(() => {});
  }

  public getQueryResults(query: string): BehaviorSubject<ContentId[]> {
    if (!this.queryCache.has(query)) {
      this.queryCache.set(query, new BehaviorSubject<ContentId[]>([]));
    }
    return this.queryCache.get(query)!;
  }

  public async loadInitial() {
    const res = await this.services.client.mSearch<{type: string, id: string}>({
      query: {
        text: '',
      },
      contentTypes: this.props.types.map(contentTypeId => ({contentTypeId}))
    });
    const results = this.getQueryResults('');
    results.next(res.hits.map(({type, id}) => [type, id]));
  }

  public select(id: ContentId) {
    const selected = this.selected$.getValue();
    if (!selected || !compareId(selected, id)) this.selected$.next(id);
  }

  public useSelected() {
    return useBehaviorSubject(this.selected$);
  }
}
