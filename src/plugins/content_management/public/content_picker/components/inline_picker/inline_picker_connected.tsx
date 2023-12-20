import * as React from 'react';
import {EuiListGroup} from '@elastic/eui';
import {useContentPicker} from '../../context/state';
import {useBehaviorSubject} from '../../hooks/use_behavior_subject';
import {ItemViewListItem} from '../../../item_views/list_item';

export const InlinePickerConnected: React.FC = () => {
  const {state} = useContentPicker();
  const ids = useBehaviorSubject(state.getQueryResults(''));

  return (
    <EuiListGroup maxWidth={288}>
      {
        ids.map((id) => (
          <ItemViewListItem key={id[0] + ':' + id[1]} id={id} />
        ))
      }
    </EuiListGroup>
  );
};
