import * as React from 'react';
import {EuiListGroup, EuiListGroupItem} from '@elastic/eui';
import {useContentPicker} from '../../context/state';
import {useBehaviorSubject} from '../../hooks/use_behavior_subject';

export const InlinePickerConnected: React.FC = () => {
  const {state} = useContentPicker();
  const list = useBehaviorSubject(state.getQueryResults(''));

  console.log('list', list);

  return (
    <EuiListGroup maxWidth={288}>
      <EuiListGroupItem
          iconType="bullseye"
          label="EUI button link"
          onClick={() => {}}
          // isActive
        />
    </EuiListGroup>
  );
};
