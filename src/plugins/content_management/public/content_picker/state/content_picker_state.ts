import {BehaviorSubject, filter, switchMap} from "rxjs";
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
    this.query$.pipe(
      filter(q => !!q),
      switchMap(q => this.search(q).then(res => [q, res])),
    ).subscribe(([q, res]) => {
      const results = this.getQueryResults(q as string);
      results.next((res as any).hits.map(({type, id}: any) => [type, id]));
    });
  }

  public getQueryResults(query: string): BehaviorSubject<ContentId[]> {
    if (!this.queryCache.has(query)) {
      this.queryCache.set(query, new BehaviorSubject<ContentId[]>([]));
    }
    return this.queryCache.get(query)!;
  }

  private async search(query: string) {
    return await this.services.client.mSearch<{type: string, id: string}>({
      query: {
        text: query + '*',
      },
      contentTypes: this.props.types.map(contentTypeId => ({contentTypeId}))
    });
  }

  public async loadInitial() {
    const res = await this.search('');
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
