import * as React from "react";
import {useContentPicker} from "../context/state";
import useObservable from 'react-use/lib/useObservable';
import type {ContentId} from "../types";

export const useItem = (id: ContentId) => {
  const {state} = useContentPicker();
  const item$ = React.useMemo(() => state.services.client.get$({contentTypeId: id[0], id: id[1]}), [id[0], id[1]]);
  const item = useObservable(item$);
  return item;
};
