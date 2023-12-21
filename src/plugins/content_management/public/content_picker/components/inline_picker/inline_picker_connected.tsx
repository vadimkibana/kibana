import * as React from 'react';
import {EuiListGroup} from '@elastic/eui';
import {useContentPicker} from '../../context/state';
import {useBehaviorSubject} from '../../hooks/use_behavior_subject';
import {InlinePickerItem} from './inline_picker_item';
import {SearchBar} from './search_bar';

export const InlinePickerConnected: React.FC = () => {
  const {state} = useContentPicker();
  const query = state.useQuery();
  const ids = useBehaviorSubject(state.getQueryResults(query));

  return (
    <>
      <SearchBar />
      <EuiListGroup maxWidth={288}>
        {
          ids.map((id) => (
            <InlinePickerItem key={id[0] + ':' + id[1]} id={id} />
          ))
        }
      </EuiListGroup>
    </>
  );
};
