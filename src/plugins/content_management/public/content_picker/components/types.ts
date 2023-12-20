import type {ContentPickerState} from "../state/content_picker_state";

export interface PickerProps {
  types: string[];
  onState?: (state: ContentPickerState) => void;
}
