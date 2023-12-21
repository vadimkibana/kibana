import * as React from 'react';
import { EuiFlexGroup, EuiFlexItem, EuiSpacer } from '@elastic/eui';
import { useContentPicker } from '../../context/state';
import { useBehaviorSubject } from '../../hooks/use_behavior_subject';
import { GridPickerItem } from './grid_picker_item';
import { SearchBar } from './search_bar';

export const GridPickerConnected: React.FC = () => {
  const { state } = useContentPicker();
  const query = state.useQuery();
  const ids = useBehaviorSubject(state.getQueryResults(query));

  return (
    <>
      <SearchBar />
      <EuiSpacer />
      <div>
        <EuiFlexGroup>
          {ids.map((id) => (
            <EuiFlexItem key={id[0] + ':' + id[1]} grow={false}>
              <GridPickerItem key={id[0] + ':' + id[1]} id={id} />
            </EuiFlexItem>
          ))}
        </EuiFlexGroup>
      </div>
    </>
  );
};
