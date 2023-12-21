import {BehaviorSubject} from "rxjs";
import {ContentPickerServices} from "../context/services";
import {compareId} from "../utils";
import {useBehaviorSubject} from "../hooks/use_behavior_subject";
import type {PickerProps} from "../components/types";
import type {ContentId} from "../types";

export class ContentPickerState {
  /** Query string to list of IDs. */
  protected readonly queryCache = new Map<string, BehaviorSubject<ContentId[]>>();
  public readonly selected$ = new BehaviorSubject<ContentId[]>([]);
  public readonly query$ = new BehaviorSubject<string>('');

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
    const hasId = selected.some((sel) => compareId(sel, id));
    if (!hasId) this.selected$.next([...selected, id]);
  }

  public unselect(id: ContentId) {
    const selected = this.selected$.getValue();
    const filtered = selected.filter((sel) => !compareId(sel, id));
    if (filtered.length !== selected.length) this.selected$.next(filtered);
  }

  public query(query: string) {
    this.query$.next(query);
  }

  public useSelected() {
    return useBehaviorSubject(this.selected$);
  }

  public useQuery() {
    return useBehaviorSubject(this.query$);
  }
}
