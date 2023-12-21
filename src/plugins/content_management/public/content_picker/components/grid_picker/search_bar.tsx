import * as React from 'react';
import {EuiFieldSearch} from '@elastic/eui';
import {useContentPicker} from '../../context/state';

export const SearchBar: React.FC = (props) => {
  const {state} = useContentPicker();
  const query = state.useQuery();

  return (
    <EuiFieldSearch
        placeholder="Search"
        value={query}
        onChange={(e: any) => {
          state.query(e.target.value);
        }}
        isClearable
      />
  );
};
