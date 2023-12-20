import * as React from 'react';
import {ContentPickerState} from '../state/content_picker_state';
import {useContentPickerServices} from './services';
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
  const services = useContentPickerServices();
  const state = React.useMemo(() => {
    const state = new ContentPickerState(services, props);
    return state;
  }, []);
  React.useLayoutEffect(() => {
    if (props.onState && state) {
      props.onState(state);
    }
  }, [state]);

  return (
    <context.Provider value={{state}}>
      {children}
    </context.Provider>
  );
};
