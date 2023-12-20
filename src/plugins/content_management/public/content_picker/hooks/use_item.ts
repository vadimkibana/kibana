import * as React from "react";
import {useContentPicker} from "../context/state";
import type {ContentId} from "../types";

export const useItem = (id: ContentId) => {
  const {state} = useContentPicker();
  const item = React.useMemo(() => state.services.client.getItem({contentTypeId: id[0], id: id[1]}), [id[0], id[1]]);
  return item;
};
