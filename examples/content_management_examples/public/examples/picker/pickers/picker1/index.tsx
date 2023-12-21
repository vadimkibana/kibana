import * as React from 'react';
import { ContentPicker } from '@kbn/content-management-plugin/public';
import type {RenderPickerProps} from '../../picker_example';

export const Picker1: React.FC<RenderPickerProps> = ({onPick}) => {
  return (
    <ContentPicker
      types={['dashboard', 'visualization']}
      onPick={onPick}
    />
  );
};
