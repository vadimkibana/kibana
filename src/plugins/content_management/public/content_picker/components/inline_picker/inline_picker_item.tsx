import * as React from 'react';
import {EuiListGroupItem} from '@elastic/eui';
import {useContentPicker} from '../../context/state';
import {useBehaviorSubject} from '../../hooks/use_behavior_subject';

export interface Props {
  id: string;
}

export const InlinePickerItem: React.FC<Props> = ({id}) => {
  const {state} = useContentPicker();
  const list = useBehaviorSubject(state.getQueryResults(''));

  return (
    <EuiListGroupItem
        iconType="bullseye"
        label={id}
        onClick={() => {}}
        // isActive
      />
  );
};
