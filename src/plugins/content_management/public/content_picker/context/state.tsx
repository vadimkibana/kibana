import * as React from 'react';
import {ContentPickerState} from '../state/content_picker_state';
import type {PickerProps} from '../components/types';

export interface ContentPickerStateContextValue {
  state: ContentPickerState;
}

export const context = React.createContext<ContentPickerStateContextValue>(null!);

export const useContentPicker = () => {
  const ctx = React.useContext(context);
  if (!ctx) {
    throw new Error('ContentPickerStateContext has not been set.');
  }
  return ctx;
};

export interface ContentPickerStateProviderProps {
  props: PickerProps;
}

export const ContentPickerStateProvider: React.FC<ContentPickerStateProviderProps> = ({props, children}) => {
  const state = React.useMemo(() => new ContentPickerState(props), []);

  return (
    <context.Provider value={{state}}>
      {children}
    </context.Provider>
  );
};
