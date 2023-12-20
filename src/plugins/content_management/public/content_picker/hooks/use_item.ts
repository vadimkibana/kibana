import * as React from "react";
import type {ContentId} from "../types";
import {useContentPickerServices} from "../context/services";

export const useItem = (id: ContentId) => {
  const services = useContentPickerServices();
  const item = React.useMemo(() => services.client.getItem({contentTypeId: id[0], id: id[1]}), [id[0], id[1]]);
  return item;
};
