import {ContentId} from "../types";
import type {ContentPickerState} from "../state/content_picker_state";

export interface PickerProps {
  types: string[];
  onState?: (state: ContentPickerState) => void;
  onPick?: (ids: ContentId[]) => void;
  pickOnSelect?: boolean;
}
