import * as React from 'react';
import { ContentPicker } from '@kbn/content-management-plugin/public';
import type {RenderPickerProps} from '../../picker_example';

export const Picker3: React.FC<RenderPickerProps> = ({types, onPick}) => {
  return (
    <ContentPicker
      picker={'modal'}
      types={types}
      onPick={onPick}
    />
  );
};
