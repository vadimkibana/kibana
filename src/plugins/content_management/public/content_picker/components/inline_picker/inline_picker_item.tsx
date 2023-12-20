import * as React from 'react';
import useObservable from 'react-use/lib/useObservable';
import {EuiListGroupItem} from '@elastic/eui';
import {useContentPicker} from '../../context/state';
import type {ContentId} from '../../types';

export interface Props {
  id: ContentId;
}

export const InlinePickerItem: React.FC<Props> = ({id}) => {
  const {state} = useContentPicker();
  const item$ = React.useMemo(() => state.services.client.get$({contentTypeId: id[0], id: id[1]}), [id[0], id[1]]);
  const item = useObservable(item$);
  
  if (item?.status !== 'success') {
    return (
      <EuiListGroupItem
        iconType="loading"
        label={''}
        onClick={() => {}}
      />
    );
  }

  return (
    <EuiListGroupItem
      iconType="bullseye"
      label={(item.data as any).item.attributes.title}
      onClick={() => {}}
      // isActive
    />
  );
};
