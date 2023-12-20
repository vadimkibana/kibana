import * as React from 'react';
import {EuiListGroupItem} from '@elastic/eui';
import {useContentPicker} from '../../context/state';
import {useBehaviorSubject} from '../../hooks/use_behavior_subject';
import type {ContentId} from '../../types';

export interface Props {
  id: ContentId;
}

export const InlinePickerItem: React.FC<Props> = ({id}) => {
  const {state} = useContentPicker();
  // state.services.client.get$({contentTypeId: id}})
  const list = useBehaviorSubject(state.getQueryResults(''));

  return (
    <EuiListGroupItem
        iconType="bullseye"
        label={id[0] + ':' + id[1]}
        onClick={() => {}}
        // isActive
      />
  );
};
