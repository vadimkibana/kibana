import {BehaviorSubject} from "rxjs";
import {ContentPickerGlobalContextValue} from "../context/global";
import type {PickerProps} from "../components/types";
import type {ContentId} from "../types";

export class ContentPickerState {
  /** Query string to list of IDs. */
  protected readonly queryCache = new Map<string, BehaviorSubject<ContentId[]>>();

  constructor (public readonly services: ContentPickerGlobalContextValue, public readonly props: PickerProps) {
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
}
