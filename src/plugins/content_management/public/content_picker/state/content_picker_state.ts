import {BehaviorSubject} from "rxjs";
import {ContentPickerGlobalContextValue} from "../context/global";
import type {PickerProps} from "../components/types";

export class ContentPickerState {
  /** Query string to list of IDs. */
  protected readonly queryCache = new Map<string, BehaviorSubject<string[]>>();

  constructor (protected readonly services: ContentPickerGlobalContextValue, public readonly props: PickerProps) {
    this.loadInitial().catch(() => {});
  }

  public getQueryResults(query: string): BehaviorSubject<string[]> {
    if (!this.queryCache.has(query)) {
      this.queryCache.set(query, new BehaviorSubject<string[]>([]));
    }
    return this.queryCache.get(query)!;
  }

  public async loadInitial() {
    const res = await this.services.client.mSearch<{id: string}>({
      query: {
        text: '',
      },
      contentTypes: this.props.types.map(contentTypeId => ({contentTypeId}))
    });
    const results = this.getQueryResults('');
    results.next(res.hits.map(hit => hit.id));
  }
}
